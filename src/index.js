import Player from "./Player.js";
import World from "./World.js";
import Renderer from "./Renderer.js";

const ourWorld = new World();

const gameCanvas = document.createElement("canvas");
gameCanvas.width = window.innerWidth;
gameCanvas.height = window.innerHeight;
document.body.appendChild(gameCanvas);

const ctx = gameCanvas.getContext("2d");
const ourRenderer = new Renderer(ourWorld, ctx);

const player = new Player(100, 100);
ourWorld.addPlayer(player);