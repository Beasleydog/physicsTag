const World =require("../World.js");

class Room{
    constructor(name){
        this.name = name;
        this.world = new World();
        this.queuedEvents=[];
    }
    simulateEvent(event){
        //Pass a event recieved over network to our copy of the world
        this.world.simulateEvent(event.player,event.eventName,event.eventStatus);
        this.queuedEvents.push(event);
    }
    dumpEvents(){
        this.queuedEvents=[];
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