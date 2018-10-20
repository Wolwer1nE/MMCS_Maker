/**
 * A class that extends Phaser.Scene and wraps up the core logic for the platformer level.
 */
import Player from "./player.js";
import SceneUI from "./scene-ui.js";
import SceneTileEditor from "./scene-tile-editor.js";
import ScenePlayer from "./scene-player.js";
import BackendPromise from "./backend-promise.js";

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

    this.backend = new BackendPromise("http://www.rndgd.ru/api/levels", 1);
  }

  create()
  {
    this.isPaused = false;
    this.isEditing = true;

    const map = this.map = this.make.tilemap({ key: "map" });
    const tiles = map.addTilesetImage("smb", "tiles");

    map.createStaticLayer("Background", tiles);
    this.groundLayer = map.createDynamicLayer("Ground", tiles);
    this.groundLayer.setCollisionByProperty({ collides: true });
    // No bottom
    this.physics.world.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height,
      true, true, true, false);

    this.editor = new SceneTileEditor(this, this.groundLayer, map);
    this.levelPlayer = new ScenePlayer(this, map, SceneTileEditor.Mode.coin.tile);
    this.levelPlayer.player.on(Player.Events.win, this.win, this);
    this.levelPlayer.player.on(Player.Events.death, this.lose, this);

    this.ui = new SceneUI(this,
      new Phaser.Geom.Rectangle(
        0,
        this.groundLayer.height,
        this.game.canvas.width,
        this.game.canvas.height - this.groundLayer.height),
      this.editor, this.levelPlayer
    );

    let urlParams = new URLSearchParams(window.location.search);
    let level = urlParams.get('level');
    if (level)
      this.loadLevelData(level)
  }

  resetLevelData(zipped)
  {
    var rawData = localStorage.getItem("levelData");
    if (rawData == null) return;
    if (zipped)
      rawData = LZString.decompressFromUTF16(rawData);

    const levelData = JSON.parse(rawData);
    if (levelData == null) return;

    levelData.forEach(t => {
      const tile = this.groundLayer.putTileAt(t.index, t.x, t.y);
      tile.properties = t.properties;
    });
    this.groundLayer.setCollisionByProperty({ collides: true });
  }

  update(time, delta) {
    if (this.isPaused) return;
    this.ui.update();
    this.levelPlayer.update(time,delta);
  }

  win()
  {
    this.isPaused = true;
    const cam = this.cameras.main;

    this.levelPlayer.player.freeze();
    this.ui.showWinDialog("Вы успешно создали уровень!\nХотите сохранить его?").then(
      () => this.sendLevelData(),
      () => {
        localStorage.removeItem("levelData");
        this.restart()
    });

  }

  loadLevelData(levelId)
  {
    this.backend.get(levelId).then((response) =>
    {
      response = JSON.parse(response)
      localStorage.setItem("levelData", response.data);
      this.resetLevelData();
    }
      );
  }

  sendLevelData()
  {
    const rawData = localStorage.getItem("levelData");
    if (rawData != null)
    {
      this.backend.send(rawData).then(
        (response) => {
          //this.backend.shorten(window.location.href+"?level="+response.id).then(
          response = JSON.parse(response);
          const link = window.location.href+"?level="+response.id;
          const textArea= document.createElement("textarea");

          textArea.innerText = link
          textArea.style  = "\
          position: absolute;\
          width:50%;\
          left: 134px;\
          top: 256px;\
          background-color: #0000;\
          font-size: 18px;\
          font: bold 18px Arial;\
          color: #e86000;\
          text-shadow: 1px 1px black; \
          border:  none;";
          document.querySelector("#game-container").appendChild(textArea);

          this.ui.showMessage("Ваша ссылка:\n\n").then(
           () => {
             textArea.parentNode.removeChild(textArea);
             localStorage.removeItem("levelData");
             this.restart()
          })
        },
        (error) => {
          console.log(error);
          //localStorage.removeItem("levelData");
          this.restart();
        }
      );
    }
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
