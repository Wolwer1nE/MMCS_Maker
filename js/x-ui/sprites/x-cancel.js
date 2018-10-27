/**
  Cancel Sprite
*/

import XSprite from "../x-sprite.js"

export default class XCancel extends XSprite
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
    let bottomRight = {x: center.x + size/2, y: center.y + size/2 };
    let offset = 2 * style.borderWidth;
    //    +     +
    //  +    +    +
    //     +   +
    //  +    +    +
    //    +     +
    let topLeftLeft = {x: topLeft.x, y: topLeft.y + offset};
    let topLeftRight = {x: topLeft.x + offset, y: topLeft.y};
    let bottomRightLeft = {x: bottomRight.x - offset, y: bottomRight.y};
    let bottomRightRight = {x: bottomRight.x, y: bottomRight.y - offset};

    let topRightLeft = {x: bottomRight.x - offset, y: topLeft.y};
    let bottomLeftRight = {x: topLeft.x + offset, y:bottomRight.y};
    let bottomLeftLeft = {x: topLeft.x, y: bottomRight.y - offset};
    let topRightRight = {x: bottomRight.x, y:topLeft.y + offset};

    let centerTop = {x: center.x, y: center.y - offset};
    let centerBottom = {x: center.x, y: center.y + offset};
    let centerLeft = {x: center.x - offset, y: center.y};
    let centerRight = {x: center.x + offset, y: center.y};

    let fillColor = style.featureColor ? style.featureColor : style.fillColor;
    let borderColor = style.borderColor ? style.borderColor : style.highlightColor;

    graphics.lineStyle(style.borderWidth, borderColor, style.alpha);
    graphics.fillStyle(fillColor, style.alpha);
    graphics.beginPath();

    graphics.moveTo(topLeftLeft.x, topLeftLeft.y);
    graphics.lineTo(topLeftRight.x, topLeftRight.y);
    graphics.lineTo(centerTop.x, centerTop.y);
    graphics.lineTo(topRightLeft.x, topRightLeft.y);
    graphics.lineTo(topRightRight.x, topRightRight.y);
    graphics.lineTo(centerRight.x, centerRight.y);
    graphics.lineTo(bottomRightRight.x, bottomRightRight.y);
    graphics.lineTo(bottomRightLeft.x, bottomRightLeft.y);
    graphics.lineTo(centerBottom.x, centerBottom.y);
    graphics.lineTo(bottomLeftRight.x, bottomLeftRight.y);
    graphics.lineTo(bottomLeftLeft.x, bottomLeftLeft.y);
    graphics.lineTo(centerLeft.x, centerLeft.y);
    graphics.closePath();

    graphics.fillPath();
    graphics.strokePath();

    switch(style.borderStyle) {
      case "raised":
        graphics.lineStyle(style.borderWidth, style.shadowColor, style.alpha);
        graphics.beginPath();

        graphics.moveTo(bottomLeftRight.x, bottomLeftRight.y);
        graphics.lineTo(bottomLeftLeft.x, bottomLeftLeft.y);
        graphics.lineTo(centerLeft.x, centerLeft.y);
        graphics.lineTo(topLeftLeft.x, topLeftLeft.y);
        graphics.lineTo(topLeftRight.x, topLeftRight.y);
        graphics.lineTo(centerTop.x, centerTop.y);
        graphics.lineTo(topRightLeft.x, topRightLeft.y);
        graphics.lineTo(topRightRight.x, topRightRight.y);

        graphics.moveTo(centerRight.x, centerRight.y);
        graphics.lineTo(bottomRightRight.x, bottomRightRight.y);

        graphics.moveTo(centerBottom.x, centerBottom.y);
        graphics.lineTo(bottomRightLeft.x, bottomRightLeft.y);

        graphics.strokePath();
    }
  }
}
