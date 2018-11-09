/**
  Rectangle Sprite
*/

import XSprite from "../x-sprite.js"

export default class XRect extends XSprite
{
  constructor(scene, style, width, height, textureKey)
  {
    super(scene, style, width, height, textureKey);
  }

  drawGraphics(graphics)
  {
    let style = this.style;

    var x = 0;
    var y = 0;
    var width = this.width;
    var height = this.height;
    if (style.borderStyle != "none")
    {
       x += style.borderWidth/2;
       y += style.borderWidth/2;
       width -= style.borderWidth;
       height -= style.borderWidth;
    }

    graphics.fillStyle(style.fillColor, style.alpha);
    // Fill
    if (style.borderRadius && style.borderRadius != 0)
      graphics.fillRoundedRect(x, y, width, height, style.borderRadius);
    else
      graphics.fillRect(x, y, width, height);

    var borderTopLeftColor = style.highlightColor;
    var borderBottomRightColor = style.shadowColor;
    // Stroke
    switch(style.borderStyle) {
      case "plain":
        graphics.lineStyle(style.borderWidth, style.borderColor, style.alpha);
        if (style.borderRadius && style.borderRadius != 0)
          graphics.strokeRoundedRect(x, y, width, height, style.borderRadius);
        else
          graphics.strokeRect(x, y, width, height);
        break;
      case "sunk":
        borderTopLeftColor = style.shadowColor;
        borderBottomRightColor = style.highlightColor;
      case "raised":
        let offset = style.borderRadius ? style.borderRadius/2 : 0;
        x += offset;
        y += offset;
        width -= offset;
        height -= offset;

        graphics.lineStyle(style.borderWidth, borderBottomRightColor, style.alpha);
        graphics.beginPath();
        graphics.moveTo(x, height);
        graphics.lineTo(width,height);
        graphics.lineTo(width, y);
        graphics.strokePath();

        graphics.lineStyle(style.borderWidth, borderTopLeftColor, style.alpha);
        graphics.beginPath();
        graphics.moveTo(x, height);
        graphics.lineTo(x, y);
        graphics.lineTo(width, y);
        graphics.strokePath();
    }
  }
}
