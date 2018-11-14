/**
 * A class that extends Phaser.Scene and wraps up the core logic for the platformer level.
 */
import URLParams from "./utils/url-params.js";
import {XButton} from "./x-ui/x-button.js";
import SceneMap from "./scene-map.js";
import SceneModeEditor from "./scene-mode-editor.js";
import SceneModePlayer from "./scene-mode-player.js";

export default class PlatformerScene extends Phaser.Scene
{
  preload()
  {
    this.load.spritesheet(
      "player",
      "./assets/spritesheets/0x72-industrial-player-32px-extruded.png",
      { frameWidth: 32, frameHeight: 32, margin: 1, spacing: 2 }
    );
    this.load.image("tiles", "./assets/tilesets/smb.png");
    this.load.spritesheet("tilesSheet", "./assets/tilesets/smb.png",
      { frameWidth: 32, frameHeight: 32 }
    );

    this.load.tilemapTiledJSON("map", "./assets/tilemaps/scienceFair2018_template.json");
    this.xui.load("./assets/ui/x-ui-style.json");
  }

  create()
  {
    this.isPaused = false;
    this.isEditing = true;

    let map = this.map = new SceneMap(this, "map", "tilesSheet");

    this.physics.world.setBounds(
      0, 0,
      this.physics.world.bounds.width,
      this.physics.world.bounds.height,
      true, true, true, false
    );

    this.editor = new SceneModeEditor(this, map.layer.tilemapLayer, map);
    this.player = new SceneModePlayer(this, map.layer.tilemapLayer, map, map.editableTiles.coin);

    this.player.on(SceneModePlayer.Events.playerWin, this.win, this);
    this.player.on(SceneModePlayer.Events.playerDead, this.lose, this);

    this.modes = {
      editor: this.editor,
      player: this.player
    };

    this.params = URLParams.get();
    this.setMode(
      this.params.mode && this.params.mode == "player" ?
        this.modes.player :
        this.modes.editor,
      { levelId: this.params.levelId }
    );
    URLParams.clear();

    this.modes.editor.ui.first.buttons.play.on(
      XButton.Events.onPointerUp, () => {this.mode = this.modes.player});
    this.modes.player.ui.first.buttons.replay.on(
      XButton.Events.onPointerUp, () => {this.mode = this.modes.editor});
  }

  get mode()
  {
    return this.__mode;
  }

  setMode(newMode, params)
  {
    if (this.__mode == newMode) return;
    if (this.__mode)
      this.__mode.leave();

    this.__mode = newMode;
    this.__mode.enter(params);
  }

  set mode(newMode)
  {
    this.setMode(newMode)
  }

  update(time, delta) {
    if (this.isPaused) return;
    this.mode.update(time, delta);
  }

  win()
  {
    this.isPaused = true;
    let cam = this.cameras.main;

    this.player.player.freeze();
    this.xui.showDialog("Вы успешно создали уровень!\nХотите сохранить его?",
                          ["replay", "cancel", "ok"])
    .then(
      // OK
      () => this.map.level.push().then(
        (response) => {
          let link = window.location.href+"?levelId="+response.id;
          console.log(link);
          this.restart(true);
        },
        (error) => {
          console.log(error);
          this.restart();
        }
      ),
      // REPLAY, CANCEL
      (button) => {
        switch (button)
        {
        case "cancel":
          this.restart(true);
          break;
        case "replay":
          this.restart();
          break;
        }
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

  restart(clearLevel)
  {
    this.isPaused = true;
    const cam = this.cameras.main;
    cam.fade(250, 0, 0, 0);

    if (clearLevel)
    {
      this.urlParams = {};
      localStorage.clear();
    }

    this.player.player.freeze();

    cam.once("camerafadeoutcomplete", () => {
      this.editor.destroy();
      this.player.destroy();
      this.__mode = undefined;
      this.scene.restart();
    });
  }
}
