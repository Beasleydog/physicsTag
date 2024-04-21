import Player from "../Player.js";
const World = require("../World.js");
import Renderer from "../Renderer.js";
import ClientMultiplayer from "./ClientMultiplayer.js";

//Have to wait till onload beacuse playcode is weird
window.onload = () => {
  const ourWorld = new World(true);

  //Setup canvas
  const gameCanvas = document.createElement("canvas");
  gameCanvas.width = window.innerWidth;
  gameCanvas.height = window.innerHeight;
  document.body.appendChild(gameCanvas);

  const ctx = gameCanvas.getContext("2d");
  const ourRenderer = new Renderer(ourWorld, ctx);

  const ourPlayer = new Player(0, 0);
  ourPlayer.setShouldInterpolatePositionUpdates(false);
  ourWorld.addPlayer(ourPlayer);

  ourWorld.bindKeys(ourPlayer, {
    up: "w",
    left: "a",
    down: "s",
    right: "d"
  });

  // Multiplayer stuff
  const multiplayer = new ClientMultiplayer(ourPlayer);
  multiplayer.joinRoom("test");
  multiplayer.addReceiveWorldListener((update) => {
    console.log("recieved update", update);
    ourWorld.deserialize(update.world, update.playersLatestPackets);
  });

  ourWorld.addEventListener((activeEvents, tickNumber) => {
    multiplayer.sendEvents(activeEvents, tickNumber);
    setTimeout(() => {
      console.log(ourWorld.storedEvents);
      // ourWorld.stop();
      // throw "stop";
    }, 10 * 1000);
  });

}