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
    let textStyle = this.style;
    switch (textStyle.render)
    {
      case "bitmap":
        textStyle.fontSize = textStyle.fontSize.replace(/px/g, "",);
        textStyle.color = textStyle.color.replace(/#/g, "0x");

        this.content = this.scene.add.bitmapText(0, 0,
          textStyle.fontFamily,
          params.data,
          textStyle.fontSize,
          textStyle.align
        );
        this.content.tint = textStyle.color;

        break;
      default:
        if (!textStyle.fontSize.endsWith("px"))
          textStyle.fontSize =textStyle.fontSize.concat("px");
        textStyle.color = textStyle.color.replace(/0x/g, "#");

        this.content = this.scene.add.text(0, 0, params.data, textStyle);
    }

    let content = this.content;
    content.setPosition(content.x, (this.height - content.height)/2);
    this.add(content);
  }
}
