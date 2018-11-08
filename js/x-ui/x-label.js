/**
  TextLabel
*/
import XView from "./x-view.js"

export default class XLabel extends XView
{
  constructor(scene, style, width, height, text)
  {
    super(scene, style, width, height, { data : text });
  }

  __init(params)
  {
    switch (this.style.render)
    {
      case "bitmap":
        this.content = this.scene.add.bitmapText(0, 0,
          this.style.fontFamily,
          params.data,
          this.style.fontSize.replace(/px/g, "",),
          this.style.align
        );
        this.content.tint = this.style.color.replace(/#/g, "0x");
        break;
      default:
        this.content = this.scene.add.text(0, 0, params.data, this.style);
    }

    let content = this.content;
    content.setPosition(content.x, (this.height - content.height)/2);
    this.add(content);
  }
}
