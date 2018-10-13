import Player from "./player.js";
import SceneUI from "./scene-ui.js";
import SceneTileEditor from "./scene-tile-editor.js";

/**
 * A class that extends Phaser.Scene and wraps up the core logic for the platformer level.
 */
export default class PlatformerScene extends Phaser.Scene {

  preload() {
    this.load.spritesheet(
      "player",
      "./assets/spritesheets/0x72-industrial-player-32px-extruded.png",
      {
        frameWidth: 32,
        frameHeight: 32,
        margin: 1,
        spacing: 2
      }
    );
    this.load.image("spike", "./assets/images/0x72-industrial-spike.png");
    this.load.image("tiles", "./assets/tilesets/smb.png");
    this.load.spritesheet("tilesSheet", "./assets/tilesets/smb.png",  {
        frameWidth: 32,
        frameHeight: 32
      });
    
    this.load.tilemapTiledJSON("map", "./assets/tilemaps/test_1.json");

    // SLICK UI

    // this.load.scenePlugin({
    //     key: 'SlickUI',
    //     url: './js/slick-ui.min.js',
    //     sceneKey: 'slickUI'
    // });
// console.log(this.plugins);
// this.slickUI.load('./assets/ui/kenney.json');    
  }

  create() {
    this.isPaused = false;
    this.isEditing = true;

    const map = this.make.tilemap({ key: "map" });
    const tiles = map.addTilesetImage("smb", "tiles");

    //map.createDynamicLayer("Background", tiles);
    //map.createDynamicLayer("Foreground", tiles);
    this.groundLayer = map.createDynamicLayer("Ground", tiles);

    // get collision tiles
    this.groundLayer.setCollisionByProperty({ collides: true });
    // No bottom
    this.physics.world.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height,
      true, true, true, false);

                // Instantiate a player instance at the location of the "Spawn Point" object in the Tiled map
    const spawnPoint = map.findObject("Objects", obj => obj.name === "spawnPoint");
    this.player = new Player(this, spawnPoint.x, spawnPoint.y);
    this.physics.world.addCollider(this.player.sprite, this.groundLayer);
    this.player.sprite.body.collideWorldBounds = true;

    const finishPoint = map.findObject("Objects", obj => obj.name === "finishPoint");
    this.finish = new Phaser.Geom.Point(finishPoint.x, finishPoint.y);

//    this.cameras.main.startFollow(this.player.sprite);
//    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.editor = new SceneTileEditor(this, this.groundLayer, map);

    //this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.ui = new SceneUI(this, this.editor, new Phaser.Geom.Rectangle(0,0,100,100));
    
    //map.createFromObjects("Objects","coin",{ key:"tiles" }, this);
}

  update(time, delta) {
    if (this.isPaused) return;
    this.player.update();
    this.ui.update();
    
    if (
      this.player.sprite.y > this.groundLayer.height ||
      this.physics.world.overlap(this.player.sprite, this.spikeGroup)
   ) {
     this.lose();
   }
   else if(
     Phaser.Math.Distance.Between(this.player.sprite.x,this.player.sprite.y,
                                  this.finish.x, this.finish.y) < this.player.sprite.width / 2
   ) {
     this.win();
   }
  }

  lose() {
    this.isPaused = true;

    const cam = this.cameras.main;
    cam.shake(100, 0.05);
    cam.fade(250, 0, 0, 0);

    // Freeze the player to leave them on screen while fading but remove the marker immediately
    this.player.freeze();
    this.editor.destroy();
    this.ui.destroy();

    cam.once("camerafadeoutcomplete", () => {
      this.player.destroy();
      this.scene.restart();
    });
  }

  win() {
    this.isPaused = true;
    const cam = this.cameras.main;
    cam.fade(120, 0, 0, 0);

    this.player.freeze();
    this.editor.destroy();
    this.ui.destroy();
    
    cam.once("camerafadeoutcomplete", () => {
      this.player.destroy();
      this.scene.restart();
    });
  }
}
