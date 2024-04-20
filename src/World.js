const HandleCollision = require("./Collisions.js");
const Player = require("./Player.js");
const { WORLD_TICK_SPEED } = require("./Constants.js");
class World {
  constructor(client) {
    this.players = [];
    this.listeners = [];
    this.storedEvents = {};
    this.client = client;
    this.tickNumber = 0;

    this.activeEvents = {};

    this.gameLoop();
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
    })
  }
  gameLoop() {
    this.tickNumber++;
    this.storedEvents[this.tickNumber] = this.activeEvents;

    this.players.forEach((player) => {
      //Apply active events
      const activeEvents = this.activeEvents[player.id];
      this.runEvents(player, activeEvents);

      player.tickMovement();
      console.log(player.p);
      this.players.forEach((secondaryPlayer) => {
        if (player.id === secondaryPlayer.id) return;
        HandleCollision(player, secondaryPlayer);
      })
    })

    setTimeout(() => {
      this.gameLoop();
    }, WORLD_TICK_SPEED);

    if (this.client) {
      console.log(this.activeEvents, this.tickNumber);
    }
    this.listeners.forEach((c) => {
      c(this.activeEvents, this.tickNumber);
    });
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
      // console.log("got a player from server");
      // console.log(newPlayer.p);
      // console.log(newPlayer.v);
      // console.log(newPlayer.a);

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

      //Remove players that are no longer in the world
      this.players.forEach((player) => {
        if (!newWorld.players.find((p) => p.id === player.id)) {
          this.removePlayer(player);
        }
      });
    });

    //YOUR client will always be first object
    let lastTickServerSaw = playersLatestPackets[this.players[0].id];
    console.log("YO WE ARE THIS MANY TICKS BEHIND, ", this.tickNumber - lastTickServerSaw);
    for (var i = lastTickServerSaw; i < this.tickNumber; i++) {
      this.runEvents(this.players[0], this.storedEvents[i][this.players[0].id]);
      this.players[0].tickMovement();
    }
  }
}
module.exports = World;