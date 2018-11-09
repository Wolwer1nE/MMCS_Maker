/**
  Render
*/

export class XRender
{
  constructor(scene, style)
  {
    if (this.constructor === XRender) {
      throw new TypeError("Abstract class 'XRender' cannot be instantiated directly.");
    }

    if (this.drawGraphics === undefined) {
      throw new TypeError("Classes extending the render abstract class must return sprites");
    }

    this.scene = scene;
    this.style = style;
  }

}

String.prototype.hash = function () {
  return this.split("").reduce(
    function(a,b) {
      a=((a<<5)-a)+b.charCodeAt(0);
      return a&a
    }, 0);
};

export default class XSprite extends XRender
{
  constructor(scene, style, width, height, textureKey, frame)
  {
    super(scene, style);

    this.width = width ? width : style.width;
    this.height = height ? height : style.height;

    if (textureKey == undefined)
      textureKey = this.constructor.name +
        "_" + width + "x" + height +
        "_" + JSON.stringify(style).hash();

    this.key = textureKey;
    this.frame = frame
  }

  drawGraphics() {}

  get sprite()
  {
    if (!this.scene.textures.exists(this.key))
    {
      let graphics = this.scene.add.graphics();
      this.drawGraphics(graphics);
      graphics.generateTexture(this.key, this.width, this.height);
      graphics.destroy();
    }
    else console.log("reused: ", this.key);
    return this.scene.add.sprite(0, 0, this.key, this.frame).setOrigin(0,0);
  }
}
