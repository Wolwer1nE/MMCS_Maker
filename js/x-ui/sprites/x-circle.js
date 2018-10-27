/**
  Rectangle Sprite
*/

import XSprite from "../x-sprite.js"

export default class XCircle extends XSprite
{
  constructor(scene, style, width, height, textureKey)
  {
    super(scene, style, width, height, textureKey);
  }

  drawGraphics(graphics)
  {
    let style = this.style;

    let center = {x: this.width / 2, y: this.height / 2};
    let radius = (this.width > this.height ? this.height : this.width) /2;

    graphics.fillStyle(style.fillColor, style.alpha);
    graphics.fillCircle(center.x, center.y, radius);

    // Stroke
    let borderColor = style.borderColor ? style.borderColor : style.shadowColor;
    if (style.borderStyle != "none")
    {
      graphics.lineStyle(style.borderWidth, borderColor, style.alpha);
      graphics.strokeCircle(center.x, center.y, radius);
    }

    graphics.lineStyle(style.borderWidth, style.highlightColor, style.alpha);
    switch(style.borderStyle) {
      case "sunk":
        graphics.beginPath();
        graphics.arc(center.x, center.y, radius, 0, -Phaser.Math.TAU);
        graphics.strokePath();
      case "raised":
        graphics.beginPath();
        graphics.arc(center.x, center.y, radius, 1.7*Phaser.Math.TAU, 3.5*Phaser.Math.TAU,);
        graphics.strokePath();
    }
  }
}
