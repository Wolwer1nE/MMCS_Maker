/**
  Ok Sprite
*/

import XSprite from "../x-sprite.js"

export default class XReplay extends XSprite
{
  constructor(scene, style, width, height, textureKey)
  {
    super(scene, style, width, height, textureKey);
  }

  drawGraphics(graphics)
  {
    let style = this.style;

    let center = {x: this.width/ 2, y: this.height/ 2};
    let size = (this.width > this.height ? this.height : this.width) /2;

    let topLeft = {x: center.x - size/2, y: center.y - size/2 };
    let topRight = {x: center.x + size/6, y: center.y - size/2 };;
    let radiusOut = size/2;
    let radiusIn = radiusOut - style.borderWidth*2.8;
    let startAngle = 2 * Phaser.Math.TAU;
    let endAngle = 0.75 * Phaser.Math.TAU;

    let fillColor = style.featureColor ? style.featureColor : style.fillColor;
    var borderColor = style.borderColor ? style.borderColor : style.shadowColor;

    graphics.fillStyle(fillColor, style.alpha);
    graphics.lineStyle(style.borderWidth, borderColor, style.alpha);
    graphics.beginPath();
    graphics.arc(center.x, center.y, radiusOut, startAngle, endAngle);
    graphics.arc(center.x, center.y, radiusIn, endAngle, startAngle, true);
    graphics.lineTo(center.x - radiusIn + style.borderWidth*2, center.y);
    graphics.lineTo(center.x - (radiusOut+radiusIn)/2, center.y + style.borderWidth*3);
    graphics.lineTo(center.x - radiusOut - style.borderWidth*2, center.y);
    graphics.closePath();
    graphics.fillPath();

    switch(style.borderStyle)
    {
      case "plain":
        graphics.strokePath();
        break;
      case "sunk":
      case "raised":
        graphics.strokePath();
        graphics.lineStyle(style.borderWidth, style.highlightColor, style.alpha);
        graphics.beginPath();
        graphics.lineTo(center.x - radiusIn + style.borderWidth*2, center.y);
        graphics.lineTo(center.x - (radiusOut+radiusIn)/2, center.y + style.borderWidth*3);
        graphics.strokePath();
        graphics.beginPath();
        graphics.arc(center.x, center.y, radiusIn, startAngle*1.05, 3*Phaser.Math.TAU);
        graphics.strokePath();
        graphics.beginPath();
        graphics.arc(center.x, center.y, radiusOut, endAngle, 3.75*Phaser.Math.TAU, true);
        graphics.strokePath();
    }
  }
}
