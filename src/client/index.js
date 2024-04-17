import Player from "../Player.js";
import World from "../World.js";
import Renderer from "../Renderer.js";
import {initSocket} from "./ClientMultiplayer.js";

//Have to wait till onload beacuse playcode is weird
window.onload = ()=>{
  const ourWorld = new World();

  //Setup canvas
  const gameCanvas = document.createElement("canvas");
  gameCanvas.width = window.innerWidth;
  gameCanvas.height = window.innerHeight;
  document.body.appendChild(gameCanvas);

  const ctx = gameCanvas.getContext("2d");
  const ourRenderer = new Renderer(ourWorld, ctx);

  const playerOne = new Player(20, 10,{
    up:"w",
    left:"a",
    down:"s",
    right:"d"
  });
  const playerTwo = new Player(10, 10,{
    up:"ArrowUp",
    left:"ArrowLeft",
    down:"ArrowDown",
    right:"ArrowRight"
  });
  ourWorld.addPlayer(playerOne);
  ourWorld.addPlayer(playerTwo);


  //Multiplayer stuff
  const socket = initSocket();
  console.log(socket);
}