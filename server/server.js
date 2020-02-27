const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const socketIo = require('socket.io');
const axios = require('axios');

dotenv.config({path: './config/config.env'})

// App setup
const PORT = process.env.PORT || 5000;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);
server.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Socket setup
const io = socketIo(server);
io.on('connection', socket => {
    console.log('New client connected');
    socket.on("disconnect", () => console.log("Client disconnected"));
});
