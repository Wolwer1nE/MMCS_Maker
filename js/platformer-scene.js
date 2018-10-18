import Player from "./player.js";
import SceneUI from "./scene-ui.js";
import SceneTileEditor from "./scene-tile-editor.js";
import ScenePlayer from "./scene-player.js";

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
    this.load.image("tiles", "./assets/tilesets/smb.png");
    this.load.spritesheet("tilesSheet", "./assets/tilesets/smb.png", {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.tilemapTiledJSON("map", "./assets/tilemaps/scienceFair2018_template.json");
  }

  create() {
    this.isPaused = false;
    this.isEditing = true;

    const map = this.map = this.make.tilemap({ key: "map" });
    const tiles = map.addTilesetImage("smb", "tiles");

    map.createStaticLayer("Background", tiles);
    this.groundLayer = map.createDynamicLayer("Ground", tiles);

    // get collision tiles
    this.groundLayer.setCollisionByProperty({ collides: true });
    // No bottom
    this.physics.world.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height,
      true, true, true, false);

    this.resetLevelData();
    this.editor = new SceneTileEditor(this, this.groundLayer, map);
    this.levelPlayer = new ScenePlayer(this, map, SceneTileEditor.Mode.coin.tile);
    this.levelPlayer.player.on(Player.Events.win, this.restart, this);
    this.levelPlayer.player.on(Player.Events.death, this.lose, this);

    this.ui = new SceneUI(this,
      new Phaser.Geom.Rectangle(
        0,
        this.groundLayer.height,
        this.game.canvas.width,
        this.game.canvas.height - this.groundLayer.height),
      this.editor, this.levelPlayer
    );
  }

  resetLevelData()
  {
    const levelData = Cookies.getJSON('levelData');
    console.log(levelData);
    if (levelData == null) return;
    for(var i = 0; i < levelData.length; ++i)
    for(var j = 0; j < levelData[i].length; ++j)
    {
      const tile = this.groundLayer.putTileAt(levelData[i][j], j, i);
      // if (tile.index == SceneTileEditor.Mode.brick.tile)
      // {
      //   tile.setCollision(true);
      //   tile.properties = {collides:true};
      // }

    }
    this.groundLayer.setCollisionByProperty({ collides: true });
  }

  update(time, delta) {
    if (this.isPaused) return;
    this.ui.update();

    this.levelPlayer.update(time,delta);
  }

  lose() {
    this.isPaused = true;

    const cam = this.cameras.main;
    cam.shake(100, 0.05);

    this.restart();
  }

  restart() {
    this.isPaused = true;
    const cam = this.cameras.main;
    cam.fade(250, 0, 0, 0);

    this.levelPlayer.player.freeze();

    cam.once("camerafadeoutcomplete", () => {
      this.editor.destroy();
      this.levelPlayer.destroy();
      this.ui.destroy();
      this.scene.restart();
    });
  }
}
