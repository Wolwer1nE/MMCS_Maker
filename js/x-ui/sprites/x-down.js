/**
  Down Sprite
*/

import XSprite from "../x-sprite.js"

export default class XDown extends XSprite
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
    let offset = 2 * style.borderWidth;
    //
    //   +     +
    //      +
    //
    let top =    {y: center.y - size/6, x: center.x - size/3};
    let point =  {y: center.y + size/6, x: center.x};
    let bottom = {y: center.y - size/6, x: center.x + size/3};

    let fillColor = style.featureColor ? style.featureColor : style.fillColor;
    let borderColor = style.borderColor ? style.borderColor : style.shadowColor;

    graphics.fillStyle(fillColor, style.alpha);
    graphics.lineStyle(style.borderWidth, borderColor, style.alpha);
    graphics.fillTriangle(top.x,top.y,point.x,point.y, bottom.x,bottom.y);

    var topColor = style.shadowColor;
    var bottomColor = style.highlightColor;
    switch(style.borderStyle) {
      case "plain":
        graphics.lineStyle(style.borderWidth, style.borderColor, style.alpha);
        graphics.strokeTriangle(top.x,top.y,point.x,point.y, bottom.x,bottom.y);
        break;
      case "sunk":
        topColor = style.highlightColor;
        bottomColor = style.shadowColor;
      case "raised":
        graphics.lineStyle(style.borderWidth, topColor, style.alpha);
        graphics.lineStyle(style.borderWidth, bottomColor, style.alpha);
        graphics.beginPath();
        graphics.moveTo(bottom.x, bottom.y);
        graphics.lineTo(top.x, top.y);
        graphics.strokePath();
    }
  }
}
