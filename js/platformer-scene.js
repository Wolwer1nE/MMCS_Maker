/**
 * A class that extends Phaser.Scene and wraps up the core logic for the platformer level.
 */
import Player from "./player.js";
import {XButton} from "./x-ui/x-button.js";
import SceneMap from "./scene-map.js";
import SceneModeEditor from "./scene-mode-editor.js";
import SceneModePlayer from "./scene-mode-player.js";
import SceneStorage from "./scene-storage.js";
import {BACKEND_LEVEL_API} from "./backend-promise.js";

export default class PlatformerScene extends Phaser.Scene
{
  static get Mode()
  {
    return { "editor" : "editor", "player" : "player" }
  }

  static parseURL(url)
  {
    let options = {};
    for (var p in new URLSearchParams(url).entries())
    {
      options[p[0]] = p[1];
    }
    return options;
  }

  preload()
  {
    // var progress = this.add.graphics();
    //
    // this.load.on('progress',
    //  (value) => {
    //   progress.clear();
    //   progress.fillStyle(0x00ffff, 1);
    //   progress.fillRect(0, 270, 800 * value, 60);
    // });
    //
    // this.load.once('complete',
    // () => {
    //   progress.destroy();
    // });

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
    this.xui.load("./assets/ui/x-ui-style.json");
  }

  create()
  {
    this.isPaused = false;
    this.isEditing = true;
    let options = this.options = PlatformerScene.parseURL(window.location.search);
    // remove params
    history.pushState({}, null, window.location.origin + window.location.pathname);

    let map = this.map = new SceneMap(this, "map", "tilesSheet");

    this.physics.world.setBounds(
      0, 0,
      this.physics.world.bounds.width,
      this.physics.world.bounds.height,
      true, true, true, false
    );

    this.editor = new SceneModeEditor(this, map.layer.tilemapLayer, map);
    this.levelPlayer = new SceneModePlayer(this, map.layer.tilemapLayer, map, map.editableTiles.coin);

    this.modes = {
      editor: this.editor,
      player: this.levelPlayer
    };
    this.mode = this.modes.editor;

    this.modes.editor.ui.first.buttons.play.on(
      XButton.Events.onPointerUp, () => {this.mode = this.modes.player});
    this.modes.player.ui.first.buttons.replay.on(
      XButton.Events.onPointerUp, () => {this.mode = this.modes.editor});

    this.levelPlayer.player.on(Player.Events.win, this.win, this);
    this.levelPlayer.player.on(Player.Events.death, this.lose, this);

    this.levelStorage = new SceneStorage("levelData", options.levelId, BACKEND_LEVEL_API);
    if (options.levelId) {
      this.levelStorage.loadData().then(
        (r) => this.resetLevelData(r),
        (e) => {
          //console.log(e);
          this.resetLevelData(this.levelStorage.getData());
      });
    } else {
      this.resetLevelData(this.levelStorage.getData());
    }
  }

  get mode()
  {
    return this.__mode;
  }

  set mode(newMode)
  {
    if (this.__mode == newMode) return;
    if (this.__mode)
      this.__mode.leave();

    this.__mode = newMode;
    this.__mode.enter();
  }

  resetLevelData(levelData)
  {
    if (levelData == null) return;

    this.map.dynamicLayerData = levelData;
  }

  update(time, delta) {
    if (this.isPaused) return;
    this.mode.update(time, delta);
  }

  win()
  {
    this.isPaused = true;
    let cam = this.cameras.main;

    this.levelPlayer.player.freeze();
    this.xui.showDialog("Вы успешно создали уровень!\nХотите сохранить его?",
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
      }
    );

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
      this.__mode = undefined;
      this.scene.restart();
    });
  }
}
