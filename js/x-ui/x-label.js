/**
  TextLabel
*/
import XView from "./x-view.js"

export default class XLabel extends XView
{
  constructor(scene, style, width, height, text)
  {
    super(scene, style, width, height, { data : text });
  }

  __init(params)
  {
    this.content = this.scene.add.text(0, 0, params.data, this.style);
    this.add(this.content);
  }
}
