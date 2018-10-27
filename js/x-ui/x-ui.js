/**
*/
import XRender from "./x-render.js"
import XPanel from "./x-panel.js"

export class XUI extends Phaser.GameObjects.Container
{
  constructor(scene, style)
  {
    this.scene = scene;
    this.root = scene.add.container();
    this.style = style;

  }

  get add ()
  {
    return
    {
     panel: (width, height) => {
       return new XPanel(this.scene, this.style.panel, width, height)
     }
     label: (text, width, height) => {
       return new XLabel(this.scene, text, this.style.text, width, height)
     }
    }
  }
}
