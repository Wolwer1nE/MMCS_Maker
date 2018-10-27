/**
  Small fabric for button graphics
*/
import SceneTileEditor from "./scene-tile-editor.js";
import XRender from "./x-ui/x-render.js";

export default class MakerButtonBuilder
{
  constructor(parent, style)
  {
    this.parent = parent;
    this.style = style;
  }

  makeButton(position, name)
  {
    var button = null;
    var offset = 0;

    switch (name)
    {

      case "erase":
        button = XRender.make.cancel(this.parent.scene, this.style, this.style.size, this.style.size);
        break;
      case "ok":
      case "pause":
      case "play":
      case "replay":
      case "cancel":
      case "left":
      case "right":
      case "up":
      case "down":
        button = XRender.make[name](this.parent.scene, this.style, this.style.size, this.style.size);
        break;
      default:
        if (SceneTileEditor.Mode.hasOwnProperty(name))
        {
          button = this.makeCopyOf(SceneTileEditor.Mode[name].sprite);
          button.setScale((this.style.size - 3*this.style.borderWidth)/button.width);
          offset = this.style.borderWidth;
        } else
          button = this.parent.scene.add.graphics();
    }

    if(this.parent != null)
      this.parent.add(button);

    button.setPosition(position.x+2*offset, position.y+1.5*offset);
    button.visible = false;

    button.setInteractive();
    button.isDown = false;

    button.name = name;
    return button;
  };

  makeCopyOf(source)
  {
    return this.makeSprite(source.texture.key, source.frame.name);
  }

  makeSprite(textureKey, frame)
  {
    const style = this.style;
    const button = this.parent.scene.add.sprite(0, 0, textureKey, frame)
            .setOrigin(0,0);
    return button;
  }
}
