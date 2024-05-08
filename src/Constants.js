const SERVER_UPDATE_INTERVAL = 1000 / 1;

const PLAYER_RADIUS = 30;
const PLAYER_MOVE_FORCE = .5;
const PLAYER_MAX_SPEED = 8;
const PLAYER_FRICTION = .95;
const PLAYER_MASS = 10;
const PLAYER_POSITION_INTERPOLATION_TIME = SERVER_UPDATE_INTERVAL/10;
const WORLD_TICK_SPEED = 1000 / 60;

const FAKE_LAG = 0;
module.exports = {
    PLAYER_RADIUS,
    PLAYER_MOVE_FORCE,
    PLAYER_MAX_SPEED,
    PLAYER_FRICTION,
    PLAYER_MASS,
    PLAYER_POSITION_INTERPOLATION_TIME,
    SERVER_UPDATE_INTERVAL,
    WORLD_TICK_SPEED,
    FAKE_LAG
}