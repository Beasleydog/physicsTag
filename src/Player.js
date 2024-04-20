const { PLAYER_POSITION_INTERPOLATION_TIME, PLAYER_RADIUS, PLAYER_MOVE_FORCE, PLAYER_MAX_SPEED, PLAYER_MASS, PLAYER_FRICTION } = require('./Constants.js');
class Player {
  constructor(spawnX, spawnY, moveKeys) {
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
    this.mass = PLAYER_MASS;
    this.radius = PLAYER_RADIUS;
    this.id = Math.random();

    this.directionsMoving = [];
    this.moveKeys = moveKeys;

    this.shouldInterpolatePositionUpdates = true;

    this.tickNumber = 0;
  }
  setShouldInterpolatePositionUpdates(shouldInterpolate) {
    this.shouldInterpolatePositionUpdates = shouldInterpolate;
  }
  update(player) {
    //Update to a new player object (probably from the server)

    if (this.shouldInterpolatePositionUpdates) {
      //Interpolate the position
      this.targetP = player.p;
      this.startingP = this.p;
      this.pTargetTime = Date.now() + PLAYER_POSITION_INTERPOLATION_TIME;
      this.pStartingTime = Date.now();
    } else {
      this.p = player.p;
    }
    this.v = player.v;
    this.a = player.a;
    this.mass = player.mass;
    this.radius = player.radius;
    this.id = player.id;
  }
  tickMovement() {
    this.tickNumber++;

    this.directionsMoving.forEach((direction) => {
      this.handleMove(direction);
    });


    this.v.x *= (this.a.x * PLAYER_FRICTION);
    this.v.y *= (this.a.y * PLAYER_FRICTION);

    //Cap movement speeds
    if (Math.abs(this.v.x) > PLAYER_MAX_SPEED) {
      this.v.x = Math.sign(this.v.x) * PLAYER_MAX_SPEED;
    }
    if (Math.abs(this.v.y) > PLAYER_MAX_SPEED) {
      this.v.y = Math.sign(this.v.y) * PLAYER_MAX_SPEED;
    }


    this.p.x += this.v.x;
    this.p.y += this.v.y;

    //Handle position interpolation
    if (this.pTargetTime && this.startingP && this.targetP) {
      const now = Date.now();
      const timeLeft = this.pTargetTime - now;
      if (timeLeft > 0) {
        const timePassed = now - this.pStartingTime;
        const percentToTarget = timePassed / PLAYER_POSITION_INTERPOLATION_TIME;
        this.p.x = this.startingP.x + ((this.targetP.x - this.startingP.x) * percentToTarget);
        this.p.y = this.startingP.y + ((this.targetP.y - this.startingP.y) * percentToTarget);
      } else {
        this.pTargetTime = null;
      }

    }
  }
  handleMove(direction) {
    switch (direction) {
      case "up":
        this.v.y -= PLAYER_MOVE_FORCE;
        break;
      case "down":
        this.v.y += PLAYER_MOVE_FORCE;
        break;
      case "left":
        this.v.x -= PLAYER_MOVE_FORCE;
        break;
      case "right":
        this.v.x += PLAYER_MOVE_FORCE;
        break;
      default:
        break;
    }
  }
  simulateEvent(eventName, eventStatus) {
    this.tickLastEvent = this.tickNumber;
    if (["up", "down", "left", "right"].includes(eventName)) {
      //This is a movement event
      if (eventStatus) {
        //Key Down
        this.directionsMoving.push(eventName);
      } else {
        //Key Up
        this.directionsMoving = this.directionsMoving.filter((dir) => dir !== eventName);
      }
    }
  }

  getPosition() {
    return this.p;
  }
  getID() {
    return this.id;
  }

  serialize() {
    return {
      ...this,
      ticksSinceLastEvent: this.tickNumber - (this.tickLastEvent || 0)
    }
  }
}

module.exports = Player;  