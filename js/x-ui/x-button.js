/**
  TextLabel
*/
import XRender from "./x-render.js"
import XView from "./x-view.js"

export class XButton extends XView
{
  constructor(scene, style, width, height, params)
  {
    super(scene, style, width, height, params);
  }

  __init(params)
  {
    this.add(XRender.make.rect(this.scene, this.style, this.width, this.height).sprite);
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
  }
}

export class XImageButton extends XButton
{
  constructor(scene, style, width, height, sprite)
  {
    super(scene, style, width, height,
      { type: "image", data: sprite };
    );
  }
}

export class XOkButton extends XImageButton
{
  constructor(scene, style, width, height)
  {
    super(scene, style, width, height,
      XRender.make.ok(style, width, height).sprite);
  }
}

export class XTextButton extends XButton
{
  constructor(scene, style, width, height, text)
  {
    super(scene, style, width, height,
      { type: "text", data: text };
    );
  }
}
