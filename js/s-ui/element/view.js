/**
  Basic container class
*/
import SUI from "../s-ui.js"
import SUIMaker from "../s-ui-maker.js"

class SUIView extends Phaser.GameObjects.Container
{
  contructor(style, x, y, parent)
  {
   super(SUI.scene, x, y);

   this.style = style;

   this.parentContainer = parent;
   this.children = new Phaser.GameObjects.Container(SUI.scene, 0, 0);
   this.children.parentContainer = this;
  }
}
