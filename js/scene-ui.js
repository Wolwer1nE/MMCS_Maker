/**
*/
import SceneTileEditor from "./scene-tile-editor.js";

export default class SceneUI
{
  constructor(scene, bounds, editor, player)
  {
    this.scene = scene;
    this.bounds = bounds;
    this.editor = editor;
    this.player = player;
    
    // uiPlugin.add(this.panel = new SlickUI.Element.Panel(bounds.x,bounds.y, bounds.width, bounds.height));
    // this.panel.add(button = new SlickUI.Element.Button(0,bounds.height / 2, 140, 80))
    //   .events.onInputUp.add(function () {
    //     console.log('Clicked save game');
    //   });

    SceneUI.Mode =
    {
      "player":0,
      "editor":1
    };
    Object.freeze();
    
    this.setMode(SceneUI.Mode.editor);
  }

  setMode(newMode)
  {
    if (this.mode == newMode) return;
    this.mode = newMode;
  }
  
  update() 
  {
    // Hanple editor inputs
    const pointer = this.scene.input.activePointer;
    const editorKeys = {
      "eraser" : { isDown: this.editor.keys.eraser.isDown},
      "brick" : { isDown: this.editor.keys.brick.isDown},
      "coin" : { isDown: this.editor.keys.coin.isDown}
    };    

    this.editor.update(pointer, editorKeys);

    const isDown = (a)=> a.isDown;
    const playerKeys = {
      "left" : { isDown: this.player.keys.left.some(isDown)},
      "right" : { isDown: this.player.keys.right.some(isDown)},
      "up" : { isDown: this.player.keys.up.some(isDown)}
    };

    this.player.update(playerKeys);
  }
  
  destroy()
  {
    // this.panel.destroy();
  }
}
