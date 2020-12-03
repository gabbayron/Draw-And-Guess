const express = require('express')
const app = express();
const http = require('http').createServer(app);
const Query = require('./db');
const cors = require('cors');
const morgan = require('morgan');
const io = require('socket.io')(http, { cors: { origin: "*" } });

// const connectionsLimit = 2
app.use(express.json())
app.use(cors())

app.use(morgan('tiny'))
let activePlayers = 0

app.get('/words/:mode', async (req, res) => {
    try {
        let q = `SELECT * FROM words WHERE mode = ?`;
        let result = await Query(q, [req.params.mode]);
        res.json(result);
    } catch (error) { console.log(error) };
});

app.post('/scores', async (req, res) => {
    const { score, user1, user2 } = req.body
    let q = `INSERT INTO games (score,user1,user2) VALUES (?,?,?)`
    await Query(q, [score, user1, user2])
    res.sendStatus(201)
});
app.get('/scores', async (req, res) => {
    let q = `SELECT * FROM games ORDER BY score DESC LIMIT 3`
    let result = await Query(q)
    res.json(result)
});


io.on('connection', socket => {
    console.log('connection')
    // if (io.engine.clientsCount > connectionsLimit) {
    //     socket.emit('err', { message: 'reach the limit of connections' })
    //     console.log('max users allowed')  
    //     socket.disconnect()      
    //     console.log('Disconnected...')   
    //     return       
    // }            



    socket.on('mode picked', () => { socket.broadcast.emit('mode picked'); });

    socket.on('signed', () => {
        activePlayers++;
        console.log('active ', activePlayers);
        if (activePlayers === 2) {
            console.log('game full');
            io.sockets.emit('game full');
        }
        console.log('signed!');
    });

    socket.on('check answer', data => { socket.broadcast.emit('check answer', data) });
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
});

const PORT = 4000 || process.env.PORT;

http.listen(PORT, () => console.log('Running on port ', PORT)); 