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
    //let h = this.height/sprite.height;
    //sprite.setScale(h);
    this.add(sprite);

    sprite.setPosition(0, (this.height - this.sprite.height) / 2 );
    this.content.setPosition(sprite.width * sprite.scaleX,
      sprite.y + sprite.height* sprite.scaleY - this.content.height);
  }
}
