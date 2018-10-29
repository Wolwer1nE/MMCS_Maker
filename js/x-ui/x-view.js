/**
  View
*/

export default class XView extends Phaser.GameObjects.Container
{
  constructor(scene, style, width, height, params)
  {
    super(scene);

    if (this.__init === undefined) {
      throw new TypeError("Classes extending XView class must implement __init ");
    }

    this.style = style;
    if (style.margins)
    {
      width = width -
      (style.margins.left ? style.margins.left : 0) -
      (style.margins.right ? style.margins.right : 0);
      height = height -
      (style.margins.top ? style.margins.top : 0) -
      (style.margins.bottom ? style.margins.bottom : 0);
    }

    this.width = width;
    this.height = height;
    this.content = null;
    this.__init(params);
  }

  setPosition(x,y)
  {
    if (style.margins)
    {
      x = x + (style.margins.left ? style.margins.left : 0);
      if (y)
        y = y + (style.margins.top ? style.margins.top : 0);
    }
    super.setPosition(x,y);
  }
}
