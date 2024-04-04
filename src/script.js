import Constants from "./Constants.js";
import Player from "./Player.js";
import World from "./World.js";
import Renderer from "./Renderer/Renderer.js";

const ourWorld = new World();

const gameCanvas = document.createElement("canvas");
document.body.appendCHild(gameCanvas);
const ctx = gameCanvas.getContext("2d");
const ourRenderer = new Renderer(ctx,ourWorld);
