/**
*/
import SceneTileEditor from "./scene-tile-editor.js";
import ScenePlayer from "./scene-player.js";
import MakerButtonBuilder from "./maker-button-builder.js";
import MouseTileMarker from "./mouse-tile-marker.js";

export default class SceneUI
{
  constructor(scene, bounds, editor, levelPlayer)
  {
    this.scene = scene;
    this.bounds = bounds;
    this.editor = editor;
    this.levelPlayer = levelPlayer;

    this.style = {
      panel: {
        margins: {
          top: 1,
          left: 1,
          bottom: 2,
          right: 2,
        },
        borderWidth: 2,
        borderRadius: 5,
        borderColor: 0x000000,
        fillColor: 0xf0d0b0,
        alpha: 1
      },
      button: {
        size: bounds.height / 4 * 1.5,
        borderWidth: 2,
        borderRadius: 3,
        shadowColor: 0x000000,
        fillColor: 0xe86010,
        highlightColor: 0xf0d0b0,
        alpha: 1
      },
      hotkey: {
        margins: {left: 2},
        color: "#000000",
        align: 'left'
      },
      label: {
        margins: {left: 2, top:2},
        color: "#e86010",
        fontSize: 24,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          fill: true
        }
      },
      marker: {
        margins: {
          top: -1,
          left: -1,
          bottom: -2,
          right: -2,
        },
        width: editor.editedLayer.tilemap.tileWidth,
        height: editor.editedLayer.tilemap.tileHeight,
        borderWidth: 2,
        borderColor: {
          normal: 0xffffff,
          warning: 0xff4f78
        }
      }
    }

    SceneUI.Mode =
    {
      "player" : "player",
      "editor" : "editor"
    };
    Object.freeze();

    this.ui = this.scene.add.container();
    this.initUI(this.ui, bounds, this.style);

    const marker = this.marker = new MouseTileMarker(scene, this.style.marker);

    editor.editedLayer.on(SceneTileEditor.Events.modeChanged,
      event => marker.setSprite(event.mode.sprite));
    editor.editedLayer.on(SceneTileEditor.Events.pointerOut,
      event => marker.setVisible(false));
    editor.editedLayer.on(SceneTileEditor.Events.pointerOver,
      event => marker.setVisible(true));

    editor.editedLayer.on(SceneTileEditor.Events.tileChanged, marker.updateFor, marker);
    levelPlayer.on(ScenePlayer.Events.coinCollected,
    coins => this.updateCoins(coins));
    levelPlayer.on(ScenePlayer.Events.timerUpdated, this.updateTime, this);

    scene.input.addPointer();
    scene.input.addPointer();
    this.modeSwitch = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);

    scene.input.on("gameobjectdown", this.onObjectDown, this);
    scene.input.on("gameobjectup", this.onObjectUp, this);
    scene.input.on("pointerup", this.onPointerUp, this);
    scene.input.keyboard.on("keydown", this.onKeyboardDown, this);

    this.setMode(SceneUI.Mode.editor);
    this.editor.setMode(SceneTileEditor.Mode.brick);
  }

  setMode(newMode)
  {
    if (this.mode == newMode) return;
    if (this.mode != null)
      Object.values(this.buttons[this.mode]).forEach((button)=>
      {
        button.visible = false;
      });

    this.mode = newMode;
    Object.values(this.buttons[newMode]).forEach((button)=>
    {
      button.visible = true;
    });

    this.editor.setEditing(this.mode == SceneUI.Mode.editor);
    this.marker.setVisible(this.mode == SceneUI.Mode.editor);
    this.timeLabel.visible = this.mode == SceneUI.Mode.player;
    this.coinsLabel.visible = this.mode == SceneUI.Mode.player;

    if (this.mode == SceneUI.Mode.player)
    {
      this.levelPlayer.startLevel();
    }
    else
      this.levelPlayer.resetLevel();
  }

  initUI(ui, bounds, style)
  {
    const panel = this.scene.add.graphics();

    const panelRect = new Phaser.Geom.Rectangle(
      style.panel.margins.left,
      style.panel.margins.top,
      bounds.width - style.panel.margins.right,
      bounds.height - style.panel.margins.bottom
    );

    panel.fillStyle(style.panel.fillColor, style.panel.alpha);
    panel.fillRoundedRect(panelRect.x, panelRect.y, panelRect.width, panelRect.height,
      style.panel.borderRadius
    );
    panel.lineStyle(style.panel.borderWidth, style.panel.borderColor, style.panel.alpha);
    panel.strokeRoundedRect(panelRect.x, panelRect.y, panelRect.width, panelRect.height,
      style.panel.borderRadius
    );
    //panel.visible = false;
    ui.add(panel);

    const underlay = this.underlay = this.scene.add.graphics();
    const buttonStep = panelRect.width / 4 - style.button.size;
    const buttonPos = []

    underlay.fillStyle(style.button.fillColor, style.button.alpha);

    for (var i in [0,1,2,3]) {
      const x = panelRect.x + i*(style.button.size + buttonStep) + buttonStep /2;
      const y = panelRect.y + style.button.size;
      buttonPos.push({x: x, y: y});

      underlay.fillRoundedRect(
        x, y,
        style.button.size, style.button.size,
        style.button.borderRadius
      );
      underlay.lineStyle(style.button.borderWidth, style.button.shadowColor, style.button.alpha);
      underlay.beginPath();
      underlay.moveTo(x, y+style.button.size-style.button.borderWidth);
      underlay.lineTo(x+style.button.size-style.button.borderWidth,
                      y+style.button.size-style.button.borderWidth);
      underlay.lineTo(x+style.button.size-style.button.borderWidth, y);
      underlay.strokePath();

      underlay.lineStyle(style.button.borderWidth, style.button.highlightColor, style.button.alpha);
      underlay.beginPath();
      underlay.moveTo(x+style.button.borderWidth,
                      y+style.button.size-style.button.borderWidth);
      underlay.lineTo(x+style.button.borderWidth,
                      y+style.button.borderWidth);
      underlay.lineTo(x+style.button.size-style.button.borderWidth,
                      y+style.button.borderWidth);
      underlay.strokePath();

      if (this.scene.sys.game.device.os.desktop)
      {
        const hotkey = Number(i) + 1;
        ui.add(this.scene.add.text(
          x + style.button.size + style.hotkey.margins.left,
          y,
          hotkey,
          style.hotkey
        ));
      }
    }
    ui.addAt(underlay, 1);

    const coinsLabel = this.coinsLabel = this.scene.add.container();
    const coinsIcon = this.scene.add.sprite( 0, 0,
      SceneTileEditor.Mode.coin.sprite.texture.key,
      SceneTileEditor.Mode.coin.sprite.frame.name)
      .setOrigin(0,0)
      .setScale(0.75);
    const coinsText = this.scene.add.text(
      coinsIcon.width, 0,
      "COINS",
      this.style.label
    );
    coinsText.name = "label"
    coinsLabel.add(coinsText);
    coinsLabel.add(coinsIcon);
    coinsLabel.setPosition(panelRect.x + style.button.size, style.label.margins.top)
    ui.add(coinsLabel);

    const timeLabel = this.timeLabel = this.scene.add.container();
    const timeIconShadow = this.scene.add.sprite( 0, 0,
      SceneTileEditor.Mode.coin.sprite.texture.key,
      "18")
      .setOrigin(0,0)
      .setScale(0.75)
      .setTint(0)
      .setPosition(style.label.shadow.offsetX, style.label.shadow.offsetY);
    const timeIcon = this.scene.add.sprite( 0, 0,
      SceneTileEditor.Mode.coin.sprite.texture.key,
      "18")
      .setOrigin(0,0)
      .setScale(0.75);
     const timeText = this.scene.add.text(
      timeIcon.width, 0,
      "TIME",
      this.style.label
    );
    timeText.name = "label"
    timeLabel.add(timeIconShadow);
    timeLabel.add(timeIcon);
    timeLabel.add(timeText);
    timeLabel.setPosition((panelRect.x + panelRect.width)/2 + style.button.size + buttonStep /2, style.label.margins.top);
    ui.add(this.timeLabel);

    const maker = new MakerButtonBuilder(ui, style.button);
    const buttons = {
      "player" : Object.keys(this.levelPlayer.player.keys)
                 .concat(["pause"])
                 .map((name, i)=>maker.makeButton(buttonPos[i], name)),
      "editor" : Object.keys(this.editor.keys)
                 .concat(["play"])
                 .map((name, i)=>maker.makeButton(buttonPos[i], name))
    }

    this.buttons = { "player": Object(), "editor": Object() };
    Object.keys(buttons).forEach((key)=>{
      buttons[key].forEach((button)=>{
        this.buttons[key][button.name] = button;
        ui.add(button);
      });
    });

    ui.setPosition(bounds.x, bounds.y);
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
      this.editor.update(pointer);
    }
  }

  onPointerUp(pointer)
  {
    if(pointer.touchDownInside)
      pointer.touchDownInside.isDown = false;
  }

  onObjectDown(pointer, object)
  {
    object.isDown = true;
    pointer.touchDownInside = object;
  }

  onObjectUp(pointer, object)
  {
    if(SceneTileEditor.Mode.hasOwnProperty(object.name))
    {
      this.editor.setMode(SceneTileEditor.Mode[object.name]);
    }
    else if (object == this.buttons.editor.play ||
             object == this.buttons.player.pause)
    {
      this.setMode(this.mode == SceneUI.Mode.editor ?
        SceneUI.Mode.player :
        SceneUI.Mode.editor
      );
    }
  }

  onKeyboardDown(event)
  {
    if(event.keyCode == this.modeSwitch.keyCode)
    {
      this.setMode(this.mode == SceneUI.Mode.editor ?
        SceneUI.Mode.player :
        SceneUI.Mode.editor
      );
    }
    else  if (this.mode == SceneUI.Mode.editor) {

      const editorMode = Object.values(SceneTileEditor.Mode).find((x) => {return x.hotkey == event.keyCode});
      if (editorMode)
       this.editor.setMode(editorMode);
    }
    // if(SceneTileEditor.Mode.values(object.name))
    // {
    //   this.editor.setMode(SceneTileEditor.Mode[object.name]);
    // }
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

  destroy()
  {
    this.ui.destroy();
  }
}
