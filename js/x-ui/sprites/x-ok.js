/**
  Ok Sprite
*/
import XSprite from "../x-sprite.js"

export default class XOk extends XSprite
{
  constructor(scene, style, width, height, textureKey)
  {
    super(scene, style, width, height, textureKey);
  }

  drawGraphics(graphics)
  {
    let style = this.style;

    let center = {x: this.width / 2, y: this.height / 2};
    let size = (this.width > this.height ? this.height : this.width) /2;
    let topLeft =  {x: center.x - size/2, y: center.y - size/2};
    let bottomRight = {x: center.x + size/2, y: center.y + size/2};
    let offset = 2 * style.borderWidth;
    //            +
    //    +         +
    //  +    +
    //
    //       +
    //
    let centerTop = {x: center.x, y: center.y};
    let centerBottom = {x: center.x, y: center.y + 2*offset};
    let topLeftRight = {x: center.x - 1.5*offset, y: center.y - 1.5*offset};
    let topLeftLeft = {x: center.x - 2.5*offset, y: center.y - 0.5*offset};
    let topRightLeft = {x: bottomRight.x, y: topLeft.y};
    let topRightRight = {x: bottomRight.x + offset, y: topLeft.y + offset};

    let fillColor = style.featureColor ? style.featureColor : style.fillColor;
    let borderColor = style.borderColor ? style.borderColor : style.shadowColor;

    graphics.lineStyle(style.borderWidth, borderColor, style.alpha);
    graphics.fillStyle(fillColor, style.alpha);
    graphics.beginPath();
    graphics.moveTo(topLeftLeft.x, topLeftLeft.y);
    graphics.lineTo(topLeftRight.x, topLeftRight.y);
    graphics.lineTo(centerTop.x, centerTop.y);
    graphics.lineTo(topRightLeft.x, topRightLeft.y);
    graphics.lineTo(topRightRight.x, topRightRight.y);
    graphics.lineTo(centerBottom.x, centerBottom.y);
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();

    switch(style.borderStyle) {
      case "raised":
        graphics.lineStyle(style.borderWidth, style.highlightColor, style.alpha);
        graphics.beginPath();
        graphics.moveTo(topRightRight.x, topRightRight.y);
        graphics.lineTo(centerBottom.x, centerBottom.y);
        graphics.strokePath();
    }
  }
}
