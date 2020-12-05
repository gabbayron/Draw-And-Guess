const express = require('express')
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const morgan = require('morgan');
const io = require('socket.io')(http, { cors: { origin: "*" } });

app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))

let activePlayers = 0
let roleCounter = true

app.use('/words', require('./routes/words'))
app.use('/scores', require('./routes/scores'))

io.on('connection', socket => {
    roleCounter ? roleCounter = false : roleCounter = true
    socket.on('mode picked', () => { socket.broadcast.emit('mode picked'); });

    socket.on('signed', () => {
        activePlayers++;
        if (activePlayers === 2) {
            io.sockets.emit('game full');
        }
    });

    socket.on('check answer', data => { socket.broadcast.emit('check answer', data) });
    socket.on('right answer', score => io.sockets.emit('right answer', score));
    socket.emit('connection', { role: roleCounter ? "draw" : "guess" });
    socket.on('end game', () => socket.broadcast.emit('end game'))
    socket.on('disconnect', () => { if (activePlayers > 0) activePlayers--; });

    // -------------- Canvas Events ----------------
    socket.on('start draw', data => { setTimeout(() => { socket.broadcast.emit('start draw', data) }, 1000); });
    socket.on('draw', (data) => { setTimeout(() => { socket.broadcast.emit('draw', data) }, 1000); });
    socket.on('finish draw', () => { setTimeout(() => { socket.broadcast.emit('finish draw',) }, 1000); });
    socket.on('clear', () => { setTimeout(() => { socket.broadcast.emit('clear') }, 1000); });
});

const PORT = process.env.PORT || 4000;

http.listen(PORT, () => console.log('Running on port ', PORT)); 