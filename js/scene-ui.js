/**
*/
import SceneTileEditor from "./scene-tile-editor.js";

export default class SceneUI
{
  constructor(scene, editor, bounds)
  {
    this.scene = scene;
    this.input = scene.input;
    this.bounds = bounds;
    this.editor = editor;
    
    // uiPlugin.add(this.panel = new SlickUI.Element.Panel(bounds.x,bounds.y, bounds.width, bounds.height));
    // this.panel.add(button = new SlickUI.Element.Button(0,bounds.height / 2, 140, 80))
    //   .events.onInputUp.add(function () {
    //     console.log('Clicked save game');
    //   });
    
    this.input.keyboard.on("keydown", this.onKeyDown, this.scene);
  }

  onKeyDown(event)
  {
    console.log(event);
    switch (event.code)
    {
      case "Backquote":
        this.editor.setMode(SceneTileEditor.Mode.eraser);
        break;
      case "Digit1":
        this.editor.setMode(SceneTileEditor.Mode.brick);
        break;
      case "Digit2":
        this.editor.setMode(SceneTileEditor.Mode.coin);
        break;
    }
  }
  
  update() 
  {
    const pointer = this.input.activePointer;
    this.editor.update(pointer);
  }
  
  destroy()
  {
    // this.panel.destroy();
  }
}
