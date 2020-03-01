const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const socketIo = require('socket.io');
// const axios = require('axios');

const { addUser, removeUser, getUser, getRoomUsers } = require('./users/index'); 

dotenv.config({path: './config/config.env'})

// App setup
const PORT = process.env.PORT || 5000;
const router = require("./routes/index");

const app = express();
app.use(router);

const server = http.createServer(app);
server.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Socket setup
const io = socketIo(server);

//io.on() wait for an event within the front end
io.on('connection', socket => {
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });

        if(error) return callback(error);

        //emit an event to the front end
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}.` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined!` });

        socket.join(user.room);

        //Ensure the callback function in the front end gets called every time, the if statement in the front end won't be executed if there's no error
        callback();
    });

    socket.on('sendMessage', (message, callback) => { 
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message });

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user) {
            io.to(user.room).emit('message', { user:'admin', text: `${user.name} has left.`})
        }
    });
});
