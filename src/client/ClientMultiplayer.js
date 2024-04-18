const { io } = require("socket.io-client");

class ClientMultiplayer{
    constructor(player){
        this.player=player;
        this.socket=io();
        this.packetNumber = 0;
    }
    joinRoom(roomId){
        this.socket.emit("join-room",roomId);
    }
    sendEvent(eventName,eventStatus){
        this.socket.emit("event",{
            player:this.player,
            eventName:eventName,
            eventStatus:eventStatus,
            packetNumber:this.packetNumber
        });
        this.packetNumber++;
    }
}
export default ClientMultiplayer;