const { io } = require("socket.io-client");
const { FAKE_LAG } = require("../Constants.js");
class ClientMultiplayer {
    constructor(player) {
        this.player = player;
        this.socket = io();
        this.recieveWorldListeners = [];

        this.socket.on("world-state", (world) => {
            this.recieveWorldListeners.forEach((listener) => {
                listener(world);
            });
        });
    }
    joinRoom(roomId) {
        this.socket.emit("join-room", { roomId, playerId: this.player.id });
    }
    sendEvents(events, tickNumber) {
        setTimeout(() => {
            this.socket.emit("events", {
                playerId: this.player.id,
                events: events,
                tickNumber: tickNumber
            });
        }, FAKE_LAG);
    }
    addReceiveWorldListener(callback) {
        this.recieveWorldListeners.push(callback);
    }

}
export default ClientMultiplayer;