/**
  View
*/

export default class XView extends Phaser.GameObjects.Container
{
  constructor(scene, style, width, height, params)
  {
    super(scene);
    if (this.constructor === XView) {
      throw new TypeError("Abstract class 'XView' cannot be instantiated directly.");
    }
    if (this.__init === undefined)
      throw new TypeError("Classes extending XView class must implement __init");

    this.style = style;
    this.width = width;
    this.height = height;

    this.content = null;
    this.__init(params);
  }
}
