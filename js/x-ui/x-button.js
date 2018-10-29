/**
*  Button
*/
import XRender from "./x-render.js"
import XControl from "./x-control.js"

export class XButton extends XControl
{
  constructor(scene, style, width, height, params)
  {
    super(scene, style, width, height, params);
  }

  __init(params)
  {
    this.add(this.underlay = XRender.make.rect(this.scene, this.style, this.width, this.height).sprite);
    switch (params.type)
    {
      case "text":
        this.content = this.scene.add.text(
          this.style.padding ? this.style.padding.left : 0,
          this.style.padding ? this.style.padding.top : 0,
          params.data, this.style);
        break;
      case "image":
        this.content = params.data;
        break;
    }
    this.add(this.content);
  }
}

export class XImageButton extends XButton
{
  constructor(scene, style, width, height, sprite)
  {
    super(scene, style, width, height,
      { type: "image", data: sprite }
    );
  }
}

export class XSystemButton extends XImageButton
{
  constructor(scene, style, width, height, type)
  {
    if (!XSystemButton.Type.hasOwnProperty(type))
    {
      throw new TypeError("Wrong system button type: "+ type)
    }
    super(scene, style, width, height,
      XRender.make[type](scene, style, width, height).sprite);
  }

  static get Type() {
    return {
      "ok" : "ok",
      "cancel" : "cancel",
      "play" : "play",
      "pause" : "pause",
      "replay" : "replay",
      "up" : "up",
      "down" : "down",
      "left" : "left",
      "right" : "right",
    }
  }
}

export class XTextButton extends XButton
{
  constructor(scene, style, width, height, text)
  {
    super(scene, style, width, height,
      { type: "text", data: text }
    );
  }
}
