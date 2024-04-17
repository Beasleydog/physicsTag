import {HandleCollision} from "./Collisions.js";
class World {
    constructor() {
        this.players = [];
        this.gameLoop();
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
    simulateEvent(event,player){
      player.handleEvent(event);
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
export default World;