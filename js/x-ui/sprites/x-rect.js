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

    graphics.fillStyle(style.fillColor, style.alpha);
    // Fill
    if (style.borderRadius && style.borderRadius != 0)
      graphics.fillRoundedRect(0, 0, this.width, this.height, style.borderRadius);
    else
      graphics.fillRect(0, 0, this.width, this.height);

    var borderTopLeftColor = style.highlightColor;
    var borderBottomRightColor = style.shadowColor;
    // Stroke
    switch(style.borderStyle) {
      case "plain":
        graphics.lineStyle(style.borderWidth, style.borderColor, style.alpha);
        if (style.borderRadius && style.borderRadius != 0)
          graphics.strokeRoundedRect(0, 0, this.width, this.height, style.borderRadius);
        else
          graphics.strokeRect(0, 0, this.width, this.height);
      case "sunk":
        borderTopLeftColor = style.shadowColor;
        borderBottomRightColor = style.highlightColor;
      case "raised":
        graphics.lineStyle(style.borderWidth, borderBottomRightColor, style.alpha);
        graphics.beginPath();
        graphics.moveTo(0, this.height-style.borderWidth);
        graphics.lineTo(this.width-style.borderWidth,
                        this.height-style.borderWidth);
        graphics.lineTo(this.width-style.borderWidth, 0);
        graphics.strokePath();

        graphics.lineStyle(style.borderWidth, borderTopLeftColor, style.alpha);
        graphics.beginPath();
        graphics.moveTo(style.borderWidth,
                        this.height-style.borderWidth);
        graphics.lineTo(style.borderWidth,
                        style.borderWidth);
        graphics.lineTo(this.width-style.borderWidth,
                        style.borderWidth);
        graphics.strokePath();
    }
  }
}
