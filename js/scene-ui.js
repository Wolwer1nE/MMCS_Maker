/**
*/
import SceneTileEditor from "./scene-tile-editor.js";
import ScenePlayer from "./scene-player.js";
import Player from "./player.js";
import MakerButtonBuilder from "./maker-button-builder.js";
import MouseTileMarker from "./mouse-tile-marker.js";

export default class SceneUI extends Phaser.Events.EventEmitter
{
  constructor(scene, bounds, levelEditor, levelPlayer)
  {
    super();
    this.scene = scene;
    this.bounds = bounds;
    this.levelEditor = levelEditor;
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
        font: "22px Menlo",
        align: "center",
        shadow: {
          offsetX: 2,
          offsetY: 2,
          fill: true
        }
      },
      popup: {
        color: "#e86010",
        font: "bold 18px Arial",
        align: "center",
        shadow: {
          offsetX: 1,
          offsetY: 1,
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
        width: levelEditor.editedLayer.tilemap.tileWidth,
        height: levelEditor.editedLayer.tilemap.tileHeight,
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

    levelEditor.on(SceneTileEditor.Events.modeChanged,
      event => marker.setSprite(event.mode.sprite));
    levelEditor.on(SceneTileEditor.Events.pointerOut,
      event => marker.setVisible(false));
    levelEditor.on(SceneTileEditor.Events.pointerOver,
      event => marker.setVisible(true));

    levelEditor.on(SceneTileEditor.Events.tileChanged, marker.updateFor, marker);

    levelPlayer.on(ScenePlayer.Events.coinCollected,this.updateCoins, this);
    levelPlayer.on(ScenePlayer.Events.timerUpdated, this.updateTime, this);

    scene.input.addPointer();
    scene.input.addPointer();
    this.modeSwitch = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);

    scene.input.on("gameobjectdown", this.onObjectDown, this);
    scene.input.on("gameobjectup", this.onObjectUp, this);
    scene.input.on("pointerup", this.onPointerUp, this);
    scene.input.keyboard.on("keydown", this.onKeyboardDown, this);

    this.levelEditor.setMode(SceneTileEditor.Mode.brick);
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

    this.levelEditor.setEditing(this.mode == SceneUI.Mode.editor);
    this.marker.setVisible(this.mode == SceneUI.Mode.editor);
    this.timeLabel.visible = this.mode == SceneUI.Mode.player;
    this.coinsLabel.visible = this.mode == SceneUI.Mode.player;

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

      if (!this.scene.sys.game.device.os.iOs &&
          !this.scene.sys.game.device.os.android)
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
                 .concat(["replay"])
                 .map((name, i)=>maker.makeButton(buttonPos[i], name)),
      "editor" : Object.keys(this.levelEditor.keys)
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

  createPopup(text, buttons, style)
  {
    const ui = this.scene.add.container();
    const panel = this.scene.add.graphics();
    const {widthInPixels, heightInPixels} = this.scene.map.layers[0];
    const bounds = new Phaser.Geom.Rectangle(
      widthInPixels/4, heightInPixels/3,
      widthInPixels/2, heightInPixels/3
    );

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
    ui.add(panel);

    const underlay = this.underlay = this.scene.add.graphics();
    const buttonStep = panelRect.width / buttons.length - style.button.size;
    const maker = new MakerButtonBuilder(ui, style.button);

    underlay.fillStyle(style.button.fillColor, style.button.alpha);
    buttons.forEach((name,i) =>
    {
      const x = panelRect.x + i*(style.button.size + buttonStep) + buttonStep /2;
      const y = panelRect.y + (panelRect.height + style.button.size)/2;

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

      maker.makeButton({x: x, y: y}, name).setVisible(true);
    });
    ui.addAt(underlay, 1);

    style.popup.wordWrap = { width: (panelRect.width - buttonStep)};
    const label = this.scene.add.text(
      panelRect.width/2, style.button.size,
      text,
      style.popup
    ).setOrigin(0.5, 0.5);

    ui.add(label);
    ui.setPosition(bounds.x, bounds.y);

    //document.body.appendChild(document.createChild("<a href="+link+">"+link+"</a>"));
    return ui;
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
          default:
            this.popup.onCancel(object.name);
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
      const levelEditorMode = Object.values(SceneTileEditor.Mode).find((x) => {return x.hotkey == event.keyCode});
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
