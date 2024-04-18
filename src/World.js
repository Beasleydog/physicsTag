const HandleCollision =require("./Collisions.js");
class World {
    constructor() {
        this.players = [];
        this.listeners=[];
        this.gameLoop();
    }
    addEventListener(callback){
      //Format for callback params:
      //Player, Event, Event Status
      this.listeners.push(callback);
    }
    bindKeys(player,eventsAndKeys){
      Object.keys(eventsAndKeys).forEach((event)=>{
          document.addEventListener("keydown",(e)=>{
              if(eventsAndKeys[event]===e.key){
                this.simulateEvent(player,event,true);
              }
          });
          document.addEventListener("keyup",(e)=>{
              if(eventsAndKeys[event]===e.key){
                this.simulateEvent(player,event,false);
              }
          });
      })
    }
    addPlayer(player) {
        this.players.push(player);
    }
    removePlayer(player){
      this.players = this.players.filter((p)=>p.id!==player.id);
    }
    getPlayers() {
        return this.players;
    }
    simulateEvent(player,event,eventStatus){
      this.listeners.forEach((c)=>{
        c(player,event,eventStatus);
      })
      player.simulateEvent(event,eventStatus);
    }
    gameLoop(){
      this.players.forEach((player)=>{
        player.tickMovement();

        this.players.forEach((secondaryPlayer)=>{
          if(player.id===secondaryPlayer.id)return;
          HandleCollision(player,secondaryPlayer);
        })
      })

      requestAnimationFrame(()=>{this.gameLoop()});
    }
}
module.exports=World;