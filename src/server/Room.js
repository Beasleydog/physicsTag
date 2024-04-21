const World = require("../World.js");

class Room {
    constructor(name) {
        this.name = name;
        this.world = new World();
        this.queuedEvents = [];
        this.playersLatestPackets = {};
    }
    simulateEvents(events) {
        this.playersLatestPackets[events.playerId] = events.tickNumber;

        //Pass a event recieved over network to our copy of the world
        const player = this.world.getPlayer(events.playerId);

        console.log("--------");
        // console.log(events, JSON.stringify(player.p));

        this.world.simulatePlayersEvents(player, events.events[player.id]);
        // this.world.runEvents(player, events.events[player.id]);

        console.log("JUST SIMULATED PACKET", events.tickNumber);


        console.log(player.p);
    }
    dumpEvents() {
        this.queuedEvents = [];

    }
    addPlayer(player) {
        this.world.addPlayer(player);
    }

    removePlayer(player) {
        this.world.removePlayer(player);
    }

    getPlayer(playerName) {
        return this.players.find(player => player.name === playerName);
    }
    serializeWorld() {
        return {
            playersLatestPackets: this.playersLatestPackets,
            world: this.world.serialize()
        }
    }
}

module.exports = Room