const HandleCollision = require("./Collisions.js");
const Player = require("./Player.js");
const accurateInterval = require("./utils/accurateInterval");
const { WORLD_TICK_SPEED } = require("./Constants.js");
class World {
  constructor(client) {
    this.players = [];
    this.listeners = [];
    this.storedEvents = {};
    this.client = client;
    this.tickNumber = 0;

    this.activeEvents = {};

    this.stopped = false;

    this.debugPoints=[];

    this.loop = accurateInterval(() => {
      this.gameLoop();
    }, WORLD_TICK_SPEED);
  }
  getDebugPoints(){
    return this.debugPoints;
  }
  addDebugPoint(x,y,radius,color){
    if(this.debugPoints.length>20){
      this.debugPoints=this.debugPoints.slice(1);
    }

    this.debugPoints.push({
      x,
      y,
      radius,
      color
    });
  }
  addEventListener(callback) {
    //Format for callback params:
    //Player, Event, Event Status
    this.listeners.push(callback);
  }
  bindKeys(player, eventsAndKeys) {
    Object.keys(eventsAndKeys).forEach((event) => {
      document.addEventListener("keydown", (e) => {
        if (e.repeat) return;
        if (eventsAndKeys[event] === e.key) {
          this.activeEvents[player.id].push({
            eventName: event
          });
        }
      });
      document.addEventListener("keyup", (e) => {
        if (eventsAndKeys[event] === e.key) {
          this.activeEvents[player.id] = this.activeEvents[player.id].filter(x => x.eventName != event);
        }
      });

    })
  }
  addPlayer(player) {
    this.players.push(player);
    this.activeEvents[player.id] = [];
  }
  removePlayer(player) {
    this.players = this.players.filter((p) => p.id !== player.id);

  }
  getPlayer(id) {
    return this.players.find((player) => player.id === id);
  }
  getPlayers() {
    return this.players;
  }
  simulatePlayersEvents(player, activeEvents) {
    this.activeEvents[player.id] = activeEvents;
  }
  runEvents(player, activeEvents) {
    activeEvents.forEach((event) => {
      if (["up", "down", "left", "right"].includes(event.eventName)) {
        //Movement event
        player.handleMove(event.eventName);
      }
    });
    player.tickMovement();
  }
  stop() {
    clearInterval(this.loop);
  }
  gameLoop() {
    if (this.stopped) return;

    if (this.lastLoopTime) {
      console.log("Loop speed", Date.now() - this.lastLoopTime, "ms");
    }
    this.lastLoopTime = Date.now();

    console.log("storing these events", JSON.stringify(this.activeEvents))
    console.log("latest tick stored",this.tickNumber);
    this.storedEvents[this.tickNumber] = JSON.parse(JSON.stringify(this.activeEvents));

    this.players.forEach((player) => {
      //Apply active events
      const activeEvents = this.activeEvents[player.id];
      this.runEvents(player, activeEvents);

      // player.tickMovement();
      this.players.forEach((secondaryPlayer) => {
        if (player.id === secondaryPlayer.id) return;
        HandleCollision(player, secondaryPlayer);
      });

      if (this.client) {
        console.log("PLAYER POSITION AT ", this.tickNumber, player.p);
      }
    })


    if (this.client) {
      console.log(this.activeEvents, this.tickNumber);

    }
    this.listeners.forEach((c) => {
      c(this.activeEvents, this.tickNumber);
    });
    this.tickNumber++;
  }
  serialize() {
    return {
      players: this.players.map((player) => {
        return player.serialize();
      }),
      tickNumber: this.tickNumber
    }
  }
  deserialize(newWorld, playersLatestPackets) {
    //Loop through all players in newWorld. If we have a player with the same id, update it. If not, add it.
    newWorld.players.forEach((newPlayer) => {
      
      let existingPlayer = this.getPlayer(newPlayer.id);
      
      if (existingPlayer) {
        existingPlayer.update(newPlayer);
      } else {
        //Turn the new player into a player object
        const newPlayerObject = new Player(0, 0);
        newPlayerObject.update(newPlayer);
        this.addPlayer(newPlayerObject);
        
        existingPlayer = newPlayerObject;
      }
      this.addDebugPoint(newPlayer.p.x,newPlayer.p.y,10,"red");
      this.addDebugPoint(existingPlayer.p.x,existingPlayer.p.y,10,"green");

      //Remove players that are no longer in the world
      this.players.forEach((player) => {
        if (!newWorld.players.find((p) => p.id === player.id)) {
          this.removePlayer(player);
        }
      });
    });

    //YOUR client will always be first object
    let lastTickServerSaw = playersLatestPackets[this.players[0].id];
    console.log("SERVER SAW TICK", this.tickNumber);
    console.log("server had us at this pos at that tick", newWorld.players.find(
      ((x) => {
        return x.id === this.players[0].id;
      })
    ).p);
    console.log("YO WE ARE THIS MANY TICKS BEHIND, ", this.tickNumber - lastTickServerSaw);
    console.log("WE ARE AT TICK ",this.tickNumber);
    for (var i = lastTickServerSaw+1; i < this.tickNumber; i++) {
      console.log("----");
      console.log("SIMULATING THESE EVENTS ", i,this.storedEvents[i][this.players[0].id]);
      const events = this.storedEvents[i][this.players[0].id];
      if(events.length>0){
        this.runEvents(this.players[0], events);
      }
    }
  }
}
module.exports = World;