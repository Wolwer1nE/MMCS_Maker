/**
*/
import SceneTileEditor from "./scene-tile-editor.js";
import MakerButton from "./maker-button.js";

export default class SceneUI
{

  constructor(scene, bounds, editor, player)
  {
    this.scene = scene;
    this.bounds = bounds;
    this.editor = editor;
    this.player = player;
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
        borderColor: 0x000000,
        fillColor: 0xe86010,
        highlightColor: 0xf0d0b0,
        alpha: 1
      }
    }
    // uiPlugin.add(this.panel = new SlickUI.Element.Panel(bounds.x,bounds.y, bounds.width, bounds.height));
    // this.panel.add(button = new SlickUI.Element.Button(0,bounds.height / 2, 140, 80))
    //   .events.onInputUp.add(function () {
    //     console.log('Clicked save game');
    //   });

    SceneUI.Mode =
    {
      "player" : "player",
      "editor" : "editor"
    };
    Object.freeze();

    this.ui = this.scene.add.container();
    this.initUI(this.ui, bounds, this.style);

    this.modeSwitch = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
    console.log(this.modeSwitch);
    this.setMode(SceneUI.Mode.editor);
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
    this.switched = true;
  }

  initUI(ui, bounds, style)
  {
    const panel = this.panel = this.scene.add.graphics();

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

    const overlay = this.overlay = this.scene.add.graphics();
    const underlay = this.overlay = this.scene.add.graphics();
    const buttonStep = panelRect.width / 4 - style.button.size;
    const buttonPos = []

    overlay.lineStyle(style.button.borderWidth, style.button.borderColor, style.button.alpha);
    underlay.fillStyle(style.button.fillColor, style.button.alpha);

    for (var i in [0,1,2,3]) {
      const x = panelRect.x + i*(style.button.size + buttonStep) + buttonStep /2;
      const y = panelRect.y + style.button.size;
      buttonPos.push({x:x,y:y});

      overlay.strokeRoundedRect(
        x, y,
        style.button.size, style.button.size,
        style.button.borderRadius
      );

      underlay.fillRoundedRect(
        x, y,
        style.button.size, style.button.size,
        style.button.borderRadius
      );
      underlay.lineStyle(style.button.borderWidth, style.button.borderColor, style.button.alpha);
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
    }
    ui.addAt(underlay, 1);


    const maker = new MakerButton(ui, style.button);
    const buttons = {
      "player" : Object.keys(this.player.keys)
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
      });
    });

    ui.addAt(overlay, ui.length-1);

    ui.setPosition(bounds.x, bounds.y);

  }

  update()
  {
    if ((this.modeSwitch.isDown ||
        this.buttons.editor.play.isDown ||
        this.buttons.player.pause.isDown) && !this.switched )
    {
      this.setMode(this.mode == SceneUI.Mode.editor ?
              SceneUI.Mode.player :
              SceneUI.Mode.editor);
    } else if(this.modeSwitch.isUp &&
              !this.buttons.editor.play.isDown && 
              !this.buttons.player.pause.isDown)
    {
      this.switched = false;
    }

    const buttons = this.buttons[this.mode];
    if (this.mode == SceneUI.Mode.editor)
    {
      const pointer = this.scene.input.activePointer;
      const editorKeys = {
        "erase" : { isDown: this.editor.keys.erase.isDown || buttons.erase.isDown},
        "brick" : { isDown: this.editor.keys.brick.isDown || buttons.brick.isDown},
        "coin" :  { isDown: this.editor.keys.coin.isDown  || buttons.coin.isDown}
      };
      this.editor.update(pointer, editorKeys);
    } else {
      const isDown = (a)=> a.isDown;
      const playerKeys = {
        "left" :  { isDown: this.player.keys.left.some(isDown)  || buttons.left.isDown},
        "right" : { isDown: this.player.keys.right.some(isDown) || buttons.right.isDown},
        "up" :    { isDown: this.player.keys.up.some(isDown)    || buttons.up.isDown}
      };
      this.player.update(playerKeys);
    }
  }

  destroy()
  {
    // this.panel.destroy();
  }
}
