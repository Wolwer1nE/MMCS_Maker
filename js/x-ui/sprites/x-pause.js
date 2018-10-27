/**
  Right Sprite
*/

import XSprite from "../x-sprite.js"

export default class XPause extends XSprite
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
    //
    //     + + + +
    //
    //     + + + +
    //
    let topLeft =  {x: center.x - size/2, y: center.y - size/2};
    let topRight =  {x: center.x - size/2 + 2*size/3, y: center.y - size/2};

    let fillColor = style.featureColor ? style.featureColor : style.fillColor;
    graphics.fillStyle(fillColor, style.alpha);
    graphics.fillRect(topRight.x, topRight.y, size/3, size);
    graphics.fillRect(topLeft.x, topLeft.y, size/3, size);

    var borderTopLeftColor = style.shadowColor;
    var borderBottomRightColor = style.highlightColor;
    switch(style.borderStyle)
    {
      case "plain":
        graphics.lineStyle(style.borderWidth, style.borderColor, style.alpha);
        graphics.strokeRect(topRight.x, topRight.y, size/3, size);
        graphics.strokeRect(topLeft.x, topLeft.y, size/3, size);
        break;
      case "sunk":
        borderTopLeftColor = style.highlightColor;
        borderBottomRightColor = style.shadowColor;
      case "raised":
      graphics.lineStyle(style.borderWidth, borderBottomRightColor, style.alpha);
      graphics.strokeRect(topRight.x, topRight.y, size/3, size);
      graphics.strokeRect(topLeft.x, topLeft.y, size/3, size);

      graphics.lineStyle(style.borderWidth, borderTopLeftColor, style.alpha);
      graphics.beginPath();
      graphics.moveTo(topLeft.x, topLeft.y + size+1);
      graphics.lineTo(topLeft.x, topLeft.y-1);
      graphics.moveTo(topLeft.x-1, topLeft.y);
      graphics.lineTo(topLeft.x + size/3+1, topLeft.y);
      graphics.moveTo(topRight.x, topRight.y + size);
      graphics.lineTo(topRight.x, topRight.y-1);
      graphics.moveTo(topRight.x-1, topRight.y);
      graphics.lineTo(topRight.x + size/3, topRight.y);
      graphics.strokePath();
    }
  }
}
