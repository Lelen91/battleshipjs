const express = require('express');
const dotenv = require('dotenv');
const socket = require('socket.io');

dotenv.config({path: './config/config.env'})

// App setup
const PORT = process.env.PORT || 5000;

const app = express();
app.get('/', (req, res) => res.send('Hello World'));
const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Static files
app.use(express.static('client'));

// Socket setup
const io = socket(server);
io.on('connection', function(socket){console.log('made socket connection')});
