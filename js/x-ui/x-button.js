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
    this.add(this.underlay = XRender.make.rect(this.scene, this.style, this.width, this.height));

    switch (params.type)
    {
      case "text":
        this.content = this.scene.add.text(0, 0, params.data,
          this.style.text ? this.style.text : this.style);
        break;
      case "image":
        this.content = params.data;
        break;
      default:
        console.error(params);
    }

    if (this.content.width < this.width || this.content.height < this.height)
    {
      let x = Math.abs(this.content.width - this.width) / 2;
      let y = Math.abs(this.content.height - this.height) / 2;
      this.content.setPosition(x,y);
    }
    else if (this.content.width > this.width || this.content.height > this.height)
    {
      let x = this.width / this.content.width;
      let y = this.height / this.content.height;
      this.content.setScale(x,y);
    }
    this.add(this.content);
  }

  static get Events()
  {
    return XControl.Events
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
      XRender.make[type](scene, style, width, height));
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
