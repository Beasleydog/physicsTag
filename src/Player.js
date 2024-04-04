import { PLAYER_RADIUS } from './Constants.js';
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = PLAYER_RADIUS;
        this.v = {
            x: 0,
            y: 0
        }
        this.a = {
            x: 0,
            y: 0
        }
        this.id = Math.random();
    }
    getPosition() {
        return {
            x: this.x,
            y: this.y
        }
    }
    getID() {
        return this.id;
    }
}
export default Player;