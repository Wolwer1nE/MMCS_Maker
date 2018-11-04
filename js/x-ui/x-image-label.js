/**
  TextLabel
*/
import XLabel from "./x-label.js"

export default class XImageLabel extends XLabel
{
  constructor(scene, style, width, height, sprite, text)
  {
    super(scene, style, width, height, { image: sprite, data: text });
  }

  __init(params)
  {
    super.__init(params.data);

    let sprite = this.sprite = params.data.image;
    let h = sprite.height/this.height;
    sprite.setScale(h);
    this.add(sprite);

    this.content.setPosition(sprite.width, sprite.y);
  }
}
