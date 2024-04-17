const express = require('express');
const http = require('http');
const app = express();
const port = 3000;

const server = http.createServer(app);
const { Server } = require("socket.io");
const ServerRoomManager = require('./ServerRoomManager');
const io = new Server(server);

//Basic server stuff
app.use(express.static('dist'));
app.get('/', (req, res) => {
  res.sendFile('dist/index.html');
});

//Socket stuff
const roomManager = new ServerRoomManager();

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join-room', (roomId) => {
    //Handle a user joining a room
    let existingRoom = roomManager.getRoom(roomId);
    if(!existingRoom){
       existingRoom = roomManager.createRoom(roomId);
    }

    existingRoom.addPlayer(socket);
    socket.join(roomId);
  });

  socket.on('action', (action) => {
    
  });
});

server.listen(port);
