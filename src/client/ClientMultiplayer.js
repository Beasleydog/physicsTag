const { io } = require("socket.io-client");

class ClientMultiplayer{
    constructor(){
        this.socket=io();
    }
    joinRoom(roomId){
        this.socket.emit("join-room",roomId);
    }
    sendAction(action){
        this.socket.emit("action",action);
    }
}
export default ClientMultiplayer;