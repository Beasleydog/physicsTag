import Player from "../Player.js";
const World =require("../World.js");
console.log(World);
import Renderer from "../Renderer.js";
import ClientMultiplayer from "./ClientMultiplayer.js";

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

  const playerOne = new Player(20, 10);
  const playerTwo = new Player(10, 10);
  ourWorld.addPlayer(playerOne);

  ourWorld.bindKeys(playerOne,{
    up:"w",
    left:"a",
    down:"s",
    right:"d"
  });

  //Multiplayer stuff
  const multiplayer = new ClientMultiplayer(player);
  multiplayer.joinRoom("test");
  
  ourWorld.addEventListener((player,event,status)=>{
    console.log(player,event,status);
    multiplayer.sendEvent(event,status)
  })

  console.log(multiplayer);
}