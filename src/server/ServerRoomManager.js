const Room =require('./Room.js');
class ServerRoomManager{
    constructor(){
        this.rooms = [];
    }

    createRoom(roomName){
        let room = new Room(roomName);
        this.rooms.push(room);
        return room;
    }

    getRoom(roomName){
        return this.rooms.find(room => room.name === roomName);
    }
}
module.exports = ServerRoomManager;