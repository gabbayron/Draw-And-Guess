const app = require('express')();
const http = require('http').createServer(app);
const Query = require('./db');
const cors = require('cors');
const morgan = require('morgan');
const io = require('socket.io')(http, { cors: { origin: "*" } });

// const connectionsLimit = 2
app.use(cors())
app.use(morgan('tiny'))
let activePlayers = 0

io.on('connection', socket => {
    console.log('connection')
    // if (io.engine.clientsCount > connectionsLimit) {
    //     socket.emit('err', { message: 'reach the limit of connections' })
    //     console.log('max users allowed')  
    //     socket.disconnect()      
    //     console.log('Disconnected...')   
    //     return       
    // }            

    app.get('/words/:mode', async (req, res) => {
        try {
            let q = `SELECT * FROM words WHERE mode = ?`;
            let result = await Query(q, [req.params.mode]);
            res.json(result);
        } catch (error) { console.log(error) };
    })

    socket.on('mode picked', () => { io.emit('mode picked'); });

    socket.on('signed', () => {
        activePlayers++;
        console.log('active ', activePlayers);
        if (activePlayers === 2) {
            console.log('game full');
            io.sockets.emit('game full');
        }
        console.log('signed!');
    })

    socket.on('check answer', (guess) => { socket.broadcast.emit('check answer', guess) });
    socket.on('right answer', score => socket.broadcast.emit('right answer', score));

    socket.emit('connection', { role: io.engine.clientsCount === 1 ? "draw" : "guess" });
    socket.on('disconnect', () => {
        activePlayers--;
        console.log('active ', activePlayers);
        console.log('user disconnected');
    });
    // -------------- Canvas Events ----------------

    socket.on('start draw', data => { setTimeout(() => { socket.broadcast.emit('start draw', data) }, 1000); });
    socket.on('draw', (data) => { setTimeout(() => { socket.broadcast.emit('draw', data) }, 1000); });
    socket.on('finish draw', () => { setTimeout(() => { socket.broadcast.emit('finish draw',) }, 1000); });
    socket.on('clear', () => { setTimeout(() => { socket.broadcast.emit('clear') }, 1000); });
})

const PORT = 4000 || process.env.PORT;

http.listen(PORT, () => console.log('Running on port ', PORT));