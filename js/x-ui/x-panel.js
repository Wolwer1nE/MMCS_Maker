/**
  Panel
*/
import XRender from "./x-render.js"
import XView from "./x-view.js"

export default class XPanel extends XView
{
  constructor(scene, style, width, height, params)
  {
    super(scene, style, width, height, params);
  }

  __init(params)
  {
    let underlay = XRender.make.rect(this.scene, this.style, this.width, this.height);
    this.add(underlay);
  }

}
