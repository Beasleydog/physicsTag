import { PLAYER_RADIUS,PLAYER_MOVE_FORCE,PLAYER_MAX_SPEED,PLAYER_MASS,PLAYER_FRICTION } from './Constants.js';
class Player {
    constructor(spawnX, spawnY,moveKeys) {
        this.radius = PLAYER_RADIUS;
        this.p = {
            x: spawnX,
            y: spawnY
        }
        this.v = {
            x: 0,
            y: 0
        }
        this.a = {
            x: 1,
            y: 1
        }
        this.mass=PLAYER_MASS;
        this.radius=PLAYER_RADIUS;
        this.id = Math.random();

        this.directionsMoving=[];
        this.moveKeys=moveKeys;
    }
    tickMovement(){
      this.directionsMoving.forEach((direction)=>{
        this.handleMove(direction);
      });


      this.v.x*=(this.a.x*PLAYER_FRICTION);
      this.v.y*=(this.a.y*PLAYER_FRICTION);

      //Cap movement speeds
      if(Math.abs(this.v.x)>PLAYER_MAX_SPEED){
        this.v.x=Math.sign(this.v.x)*PLAYER_MAX_SPEED;
      }
      if(Math.abs(this.v.y)>PLAYER_MAX_SPEED){
        this.v.y=Math.sign(this.v.y)*PLAYER_MAX_SPEED;
      }


      this.p.x+=this.v.x;
      this.p.y+=this.v.y;
    }
    handleMove(direction){
      switch(direction){
        case "up":
          this.v.y-=PLAYER_MOVE_FORCE;
          break;
        case "down":
          this.v.y+=PLAYER_MOVE_FORCE;
          break;
        case "left":
          this.v.x-=PLAYER_MOVE_FORCE;
          break;
        case "right":
          this.v.x+=PLAYER_MOVE_FORCE;
          break;
        default:
          break;
      }
    }
    simulateEvent(eventName,eventStatus){
      if(["up","down","left","right"].includes(eventName)){
        //This is a movement event
        if(eventStatus){
          //Key Down
          this.directionsMoving.push(eventName);
        }else{
          //Key Up
          this.directionsMoving=this.directionsMoving.filter((dir)=>dir!==eventName);
        }
      }
    }
    
    getPosition() {
        return this.p;
    }
    getID() {
        return this.id;
    }
}
export default Player;