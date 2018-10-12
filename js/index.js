/**
 * Author: Michael Hadley, mikewesthad.com
 * Asset Credits:
 *  - Tileset by 0x72 under CC-0, https://0x72.itch.io/16x16-industrial-tileset
 */

import PlatformerScene from "./platformer-scene.js";

const config = {
  type: Phaser.AUTO,
  width: 512,
  height: 512,
  parent: "game-container",
  pixelArt: true,
  backgroundColor: "#5c94fc",
  scene: PlatformerScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1000 }
    }
  }
};

const game = new Phaser.Game(config);
