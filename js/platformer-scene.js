/**
 * A class that extends Phaser.Scene and wraps up the core logic for the platformer level.
 */
import Player from "./player.js";
import SceneUI from "./scene-ui.js";
import SceneTileEditor from "./scene-tile-editor.js";
import ScenePlayer from "./scene-player.js";
import SceneStorage from "./scene-storage.js";
import {BACKEND_LEVEL_API} from "./backend-promise.js";

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

  create()
  {
    this.isPaused = false;
    this.isEditing = true;

    let options = this.options = this.parseURL(window.location.search);
    // remove params
    history.pushState({}, null, window.location.origin+window.location.pathname);

    const map = this.map = this.make.tilemap({ key: "map" });
    const tiles = map.addTilesetImage("smb", "tiles");

    map.createStaticLayer("Background", tiles);
    this.groundLayer = map.createDynamicLayer("Ground", tiles);
    this.groundLayer.setCollisionByProperty({ collides: true });

    this.physics.world.setBounds(
      0, 0,
      this.physics.world.bounds.width, this.physics.world.bounds.height,
      true, true, true, false
    );

    this.editor = new SceneTileEditor(this, this.groundLayer, map);
    this.levelPlayer = new ScenePlayer(this, map, SceneTileEditor.Mode.coin.tile);

    this.levelPlayer.player.on(Player.Events.win, this.win, this);
    this.levelPlayer.player.on(Player.Events.death, this.lose, this);

    let uiRect = new Phaser.Geom.Rectangle(
      0, this.groundLayer.height,
      this.game.canvas.width,
      this.game.canvas.height - this.groundLayer.height
    );

    this.levelStorage = new SceneStorage("levelData", options.levelId, BACKEND_LEVEL_API);
    if (options.levelId) {
      this.levelStorage.loadData().then(
        (r) => this.editor.resetLevelData(r),
        (e) => {
          console.log(e);
          this.editor.resetLevelData(this.levelStorage.getData());
      });
    } else {
      this.editor.resetLevelData(this.levelStorage.getData());
    }

    this.ui = new SceneUI(this, uiRect, this.editor, this.levelPlayer);
    this.ui.setMode(options.mode ? options.mode : SceneUI.Mode.editor);
  }

  parseURL(url)
  {
    var options = {}
    for( var p of new URLSearchParams(url)){
      options[p[0]] = p[1];
    }
    return options;
  }

  update(time, delta) {
    if (this.isPaused) return;
    this.ui.update();
    this.levelPlayer.update(time,delta);
  }

  win()
  {
    this.isPaused = true;
    let cam = this.cameras.main;

    this.levelPlayer.player.freeze();
    this.ui.showDialog("Вы успешно создали уровень!\nХотите сохранить его?",
                          ["replay", "cancel", "ok"])
    .then(
      // OK
      () => this.levelStorage.sendData().then(
        (response) => {
          let link = window.location.href+"?levelId="+response.id;
          console.log(link);
          this.levelStorage.removeData();
          this.restart();
        },
        (error) => {
          console.log(error);
          this.restart();
        }
      ),
      // REPLAY, CANCEL
      (button) => {
        if (button == "cancel")
            this.levelStorage.removeData();
       this.restart();
    });

  }

  lose()
  {
    this.isPaused = true;

    const cam = this.cameras.main;
    cam.shake(100, 0.05);

    this.restart();
  }

  restart()
  {
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
