import World from "../World.js";

class Room{
    constructor(name){
        this.name = name;
        this.world = new World();
    }

    addPlayer(player){
        this.world.addPlayer(player);
    }

    removePlayer(player){
        this.world.removePlayer(player);
    }

    getPlayer(playerName){
        return this.players.find(player => player.name === playerName);
    }
}