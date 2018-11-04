/**
*/
import SceneModeEditor from "./scene-mode-editor.js";
import SceneModePlayer from "./scene-mode-player.js";
import Player from "./player.js";
import MouseTileMarker from "./mouse-tile-marker.js";
import XRender from "./x-ui/x-render.js"

export default class SceneUI extends Phaser.Events.EventEmitter
{
  constructor(scene, bounds, levelEditor, levelPlayer)
  {
    super();
    this.scene = scene;
    this.bounds = bounds;
    this.levelEditor = levelEditor;
    this.levelPlayer = levelPlayer;

    this.style = this.scene.xui.style;

    SceneUI.Mode =
    {
      "player" : "player",
      "editor" : "editor"
    };
    Object.freeze();

    this.ui = this.scene.add.container();
    this.initUI(this.ui, bounds, this.style);

    const marker = this.marker = new MouseTileMarker(scene, this.style.marker);

    levelEditor.on(SceneModeEditor.Events.modeChanged,
      event => marker.setSprite(event.mode.sprite));
    levelEditor.on(SceneModeEditor.Events.pointerOut,
      event => marker.setVisible(false));
    levelEditor.on(SceneModeEditor.Events.pointerOver,
      event => marker.setVisible(true));

    levelEditor.on(SceneModeEditor.Events.tileChanged, marker.updateFor, marker);

    levelPlayer.on(SceneModePlayer.Events.coinCollected,this.updateCoins, this);
    levelPlayer.on(SceneModePlayer.Events.timerUpdated, this.updateTime, this);

    scene.input.addPointer();
    scene.input.addPointer();
    this.modeSwitch = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);

    // scene.input.on("gameobjectdown", this.onObjectDown, this);
    // scene.input.on("gameobjectup", this.onObjectUp, this);
    // scene.input.on("pointerup", this.onPointerUp, this);
    // scene.input.keyboard.on("keydown", this.onKeyboardDown, this);

    this.levelEditor.setMode(SceneModeEditor.Mode.brick);
  }

  setMode(newMode)
  {
    if (this.mode == newMode) return;
    // if (this.mode != null)
    //   Object.values(this.buttons[this.mode]).forEach((button)=>
    //   {
    //     button.visible = false;
    //   });

    this.mode = newMode;
    // Object.values(this.buttons[newMode]).forEach((button)=>
    // {
    //   button.visible = true;
    // });

    //this.levelEditor.setEditing(this.mode == SceneUI.Mode.editor);
    // this.marker.setVisible(this.mode == SceneUI.Mode.editor);
    // this.timeLabel.visible = this.mode == SceneUI.Mode.player;
    // this.coinsLabel.visible = this.mode == SceneUI.Mode.player;

    if (this.mode == SceneUI.Mode.player)
    {
      this.levelEditor.saveLevelData();
      this.levelPlayer.startLevel();
    }
    else
      this.levelPlayer.resetLevel();

  }

  initUI(ui, bounds, style)
  {
    // let levelEditorMenu = this.scene.xui.add.menu(style, bounds.width, bounds.height,
    //   [
    //     {
    //       name:"brick",
    //       sprite: SceneModeEditor.Mode["brick"].sprite
    //     }, {
    //       name: "coin",
    //       sprite: SceneModeEditor.Mode["coin"].sprite
    //     },
    //     "cancel", "play"], 0.3
    // );
    // levelEditorMenu.setPosition(bounds.x,bounds.y);

    let levelPlayerMenu = this.scene.xui.add.menu(style, bounds.width, bounds.height,
      ["left", "right", "up", "replay"], 0.3
    );
    levelPlayerMenu.setPosition(bounds.x,bounds.y);

    this.buttons = { editor: levelEditorMenu.buttons, player: levelPlayerMenu.buttons};

    //const panel = this.scene.xui.add.panel(style.panel, bounds.width, bounds.height)
    //ui.add(panel);
    //
    // let buttonSize = 48;
    // const buttonStep = panel.width / 4 - buttonSize;
    // const buttonPos = []
    //
    //
    // for (var i in [0,1,2,3]) {
    //   const x = panel.x + i*(buttonSize + buttonStep) + buttonStep /2;
    //   const y = panel.y + buttonSize;
    //   buttonPos.push({x: x, y: y});
    // }
    //
    // const coinsLabel = this.coinsLabel = this.scene.add.container();
    // const coinsIcon = this.scene.add.sprite( 0, 0,
    //   SceneTileEditor.Mode.coin.sprite.texture.key,
    //   SceneTileEditor.Mode.coin.sprite.frame.name)
    //   .setOrigin(0,0)
    //   .setScale(0.75);
    // const coinsText = this.scene.add.text(
    //   coinsIcon.width, 0,
    //   "COINS",
    //   this.style.label
    // );
    // coinsText.name = "label"
    // coinsLabel.add(coinsText);
    // coinsLabel.add(coinsIcon);
    // coinsLabel.setPosition(panel.x + style.button.size, style.label.margins.top)
    // ui.add(coinsLabel);
    //
    // const timeLabel = this.timeLabel = this.scene.add.container();
    // const timeIconShadow = this.scene.add.sprite( 0, 0,
    //   SceneTileEditor.Mode.coin.sprite.texture.key,
    //   "18")
    //   .setOrigin(0,0)
    //   .setScale(0.75)
    //   .setTint(0)
    //   .setPosition(style.label.shadow.offsetX, style.label.shadow.offsetY);
    // const timeIcon = this.scene.add.sprite( 0, 0,
    //   SceneTileEditor.Mode.coin.sprite.texture.key,
    //   "18")
    //   .setOrigin(0,0)
    //   .setScale(0.75);
    //  const timeText = this.scene.add.text(
    //   timeIcon.width, 0,
    //   "TIME",
    //   this.style.label
    // );
    // timeText.name = "label"
    // timeLabel.add(timeIconShadow);
    // timeLabel.add(timeIcon);
    // timeLabel.add(timeText);
    // timeLabel.setPosition(
    //   (panel.x + panel.width)/2 + style.button.size + buttonStep /2,
    //   style.label.margins.top
    // );
    // ui.add(this.timeLabel);

    // const maker = new MakerButtonBuilder(ui, style.button);
    // const buttons = {
    //   "player" : Object.keys(this.levelPlayer.player.keys)
    //              .concat(["replay"])
    //              .map((name, i) => this.makeButton(name, buttonSize, buttonPos[i])),
    //   "editor" : Object.keys(this.levelEditor.keys)
    //              .concat(["play"])
    //              .map((name, i) => this.makeButton(name, buttonSize, buttonPos[i])),
    // }
    //
    // this.buttons = { "player": Object(), "editor": Object() };
    // Object.keys(buttons).forEach((key)=>{
    //   buttons[key].forEach((button)=>{
    //     this.buttons[key][button.name] = button;
    //     panel.add(button);
    //   });
    // });

    //panel.setPosition(bounds.x, bounds.y);
  }

  update()
  {
    const buttons = this.buttons[this.mode];
    if (this.mode == SceneUI.Mode.player)
    {
      const isDown = (a)=> a.isDown;
      const playerKeys = {
        "left" :  { isDown: this.levelPlayer.player.keys.left.some(isDown)  || this.buttons.player.left.isDown},
        "right" : { isDown: this.levelPlayer.player.keys.right.some(isDown) || this.buttons.player.right.isDown},
        "up" :    { isDown: this.levelPlayer.player.keys.up.some(isDown)    || this.buttons.player.up.isDown}
      };
      this.levelPlayer.player.update(playerKeys);
    } else {
      const pointer = this.scene.input.activePointer;
      this.levelEditor.update(pointer);
      this.levelPlayer.player.update();
    }
  }

  onPointerUp(pointer)
  {
    if(pointer.touchDownInside)
      pointer.touchDownInside.isDown = false;
  }

  onObjectDown(pointer, object)
  {
    if (this.scene.isPaused) return;
    object.isDown = true;
    pointer.touchDownInside = object;
  }

  onObjectUp(pointer, object)
  {
    if (this.scene.isPaused) {
      if (this.popup)
      {
        switch(object.name)
        {
          case "ok":
            this.popup.onOk();
            break;
          case "cancel":
          case "replay":
            this.popup.onCancel(object.name);
            break;
          default:
            return;
        }
        this.popup.destroy();
        this.popup = null;
      }
      return;
    }

    if(SceneTileEditor.Mode.hasOwnProperty(object.name))
    {
      this.levelEditor.setMode(SceneTileEditor.Mode[object.name]);
    }
    else if (object == this.buttons.editor.play ||
             object == this.buttons.player.replay)
    {
      this.setMode(this.mode == SceneUI.Mode.editor ?
        SceneUI.Mode.player :
        SceneUI.Mode.editor
      );
    }
  }

  onKeyboardDown(event)
  {
    if (this.scene.isPaused) return;
    if(event.keyCode == this.modeSwitch.keyCode)
    {
      this.setMode(this.mode == SceneUI.Mode.editor ?
        SceneUI.Mode.player :
        SceneUI.Mode.editor
      );
    }
    else  if (this.mode == SceneUI.Mode.editor) {
      const levelEditorMode = Object.values(SceneModeEditor.Mode).find((x) => {return x.hotkey == event.keyCode});
      if (levelEditorMode)
        this.levelEditor.setMode(levelEditorMode);
    }
  }

  updateCoins(coins)
  {
    this.coinsLabel.getByName("label").text = coins.collected +"/"+coins.total;
  }

  updateTime(time)
  {
    const seconds = time/60 |0;
    const mseconds = time%60;
    this.timeLabel.getByName("label").text = (seconds<10 ? "0"+seconds : seconds) + ":" +
                                             (mseconds<10 ? "0"+mseconds : mseconds);
  }

  showDialog(text, buttons)
  {
    this.scene.isPaused = true;
    return new Promise((success, fail) =>
    {
      const popup = this.popup = this.createPopup(
        text,
        buttons,
        this.style
      );
      popup.onOk = success;
      popup.onCancel = fail;
    });
  }

  destroy()
  {
    this.ui.destroy();
  }
}
