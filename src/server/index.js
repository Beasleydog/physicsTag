const express = require("express");
const http = require("http");
const app = express();
const port = 3000;
const { SERVER_UPDATE_INTERVAL,FAKE_LAG } = require("../Constants.js");
const Player = require("../Player.js");

const server = http.createServer(app);
const { Server } = require("socket.io");
const ServerRoomManager = require("./ServerRoomManager");
const io = new Server(server);

//Basic server stuff
app.use(express.static("dist"));
app.get("/", (req, res) => {
  res.sendFile("dist/index.html");
});

//Socket stuff
const roomManager = new ServerRoomManager();

io.on("connection", (socket) => {
  console.log("a user connected");


  socket.on("join-room", ({ roomId, playerId }) => {
    const player = new Player(0, 0);
    //Overwrite id to ensure it matches the id of the player on the client
    player.id = playerId;

    //Handle a user joining a room
    let existingRoom = roomManager.getRoom(roomId);
    if (!existingRoom) {
      existingRoom = roomManager.createRoom(roomId);
    }
   
    if(!existingRoom||existingRoom.world.players.length==0){
      //If they are the first in the room, they are IT by default
      player.setIt(true);

    }

    existingRoom.addPlayer(player);
    socket.room = existingRoom;
    socket.player = player;
    socket.join(roomId);
  });

  socket.on("events", (events) => {
    if (!socket.room) {
      console.error("DEAD CLIENT");
      return;
    }
    setTimeout(()=>{
      socket.room.simulateEvents(events);
    },FAKE_LAG);

  });

  socket.on("disconnect", () => {
    if (!socket.room) {
      console.error("DEAD CLIENT");
      return;
    }
    socket.room.removePlayer(socket.player);
  });
});

setInterval(() => {
  roomManager.rooms.forEach((room) => {
    //Broadcast world state to each socket in room
    io.to(room.name).emit("world-state", room.serializeWorld());
    room.dumpEvents();
  });
}, SERVER_UPDATE_INTERVAL);

server.listen(port);
