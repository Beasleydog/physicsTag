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

    this.debugPoints = [];

    this.loop = accurateInterval(() => {
      this.gameLoop();
    }, WORLD_TICK_SPEED);
  }
  getDebugPoints() {
    return this.debugPoints;
  }
  addDebugPoint(x, y, radius, color) {
    if (this.debugPoints.length > 2) {
      this.debugPoints = this.debugPoints.slice(1);
    }
    this.debugPoints.push({
      x,
      y,
      radius,
      color,
    });
  }
  addEventListener(callback) {
    this.listeners.push(callback);
  }
  bindKeys(player, eventsAndKeys) {
    Object.keys(eventsAndKeys).forEach((event) => {
      document.addEventListener("keydown", (e) => {
        if (e.repeat) return;
        if (eventsAndKeys[event] === e.key) {
          this.activeEvents[player.id].push({
            eventName: event,
          });
        }
      });
      document.addEventListener("keyup", (e) => {
        if (eventsAndKeys[event] === e.key) {
          this.activeEvents[player.id] = this.activeEvents[player.id].filter(
            (x) => x.eventName != event
          );
        }
      });
    });
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
    // if(!!this.activeEvents[player.id]) this.activeEvents[player.id]=[];
    // this.activeEvents[player.id]=this.activeEvents[player.id].concat(activeEvents);
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
    this.stopped = true;
  }
  gameLoop() {
    if (this.stopped) return;

    this.lastLoopTime = Date.now();

    const eventsToStore = JSON.parse(
      JSON.stringify(this.activeEvents)
    );
    console.log("at tick ",this.tickNumber," these are the events ", eventsToStore)
    this.storedEvents[this.tickNumber] = eventsToStore;

    this.players.forEach((player) => {
      //Apply active events
      const activeEvents = this.activeEvents[player.id];
      this.runEvents(player, activeEvents);

      // player.tickMovement();
      this.players.forEach((secondaryPlayer) => {
        if (player.id === secondaryPlayer.id) return;
        const collided = HandleCollision(player, secondaryPlayer);

        //Handle the switching of it
        if (collided) {
          if (player.isIt()) {
            player.setIt(false);
            secondaryPlayer.setIt(true);
          } else if (secondaryPlayer.isIt()) {
            player.setIt(true);
            secondaryPlayer.setIt(false);
          }
        }
      });
    });

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
      tickNumber: this.tickNumber,
    };
  }
  deserialize(newWorld, playersLatestPackets) {
    console.log(newWorld);
    //Loop through all players in newWorld. If we have a player with the same id, update it. If not, add it.
    let currentPosition;
    newWorld.players.forEach((newPlayer,i) => {
      let existingPlayer = this.getPlayer(newPlayer.id);
      if(i==0&&existingPlayer){
        currentPosition={
          x:existingPlayer.p.x,
          y:existingPlayer.p.y,
        }
      }
      if (existingPlayer) {
      this.addDebugPoint(existingPlayer.p.x,existingPlayer.p.y,10,"green");
        existingPlayer.update(newPlayer);
      } else {
        //Turn the new player into a player object
        const newPlayerObject = new Player(0, 0);
        newPlayerObject.update(newPlayer);
        this.addPlayer(newPlayerObject);

        existingPlayer = newPlayerObject;
      }
      this.addDebugPoint(newPlayer.p.x,newPlayer.p.y,20,"red");

      //Remove players that are no longer in the world
      this.players.forEach((player) => {
        if (!newWorld.players.find((p) => p.id === player.id)) {
          this.removePlayer(player);
        }
      });
    });

    
    //SERVER RECONCILLATION, NOT WORKING ATM
    
    //YOUR client will always be first object
    // let lastTickServerSaw = playersLatestPackets[this.players[0].id];
    // console.log("-----");
    // console.log(JSON.parse(JSON.stringify(this.storedEvents)));
    // console.log(lastTickServerSaw);
    // const allEventIdsToDo = Object.keys(this.storedEvents).slice(
    //   Object.keys(this.storedEvents).indexOf(String(lastTickServerSaw))
    // );
    // console.log(allEventIdsToDo);
    // const allEvents=[];
    // allEventIdsToDo.forEach((tickToRun) => {
    //   const events = this.storedEvents[tickToRun][this.players[0].id];
    //   allEvents.push(events);
    //   this.runEvents(this.players[0], events);
    // });
    // console.log("here are the events we ran to reconcile, ",allEvents);

    // const newPos = {
    //   x:this.players[0].p.x,
    //   y:this.players[0].p.y,
    // }

    // this.addDebugPoint(this.players[0].p.x,this.players[0].p.y,"pink");

    // const distance = Math.sqrt(Math.pow(currentPosition.x-newPos.x,2)+Math.pow(currentPosition.y-newPos.y,2));
    // console.log("AFTER RECONCILING, WE ARE THIS FAR AWAY FROM POSTION ",distance);
  }
}
module.exports = World;
