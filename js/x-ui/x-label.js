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
    this.content = this.scene.add.text(
        this.style.padding ? this.style.padding.left : 0,
        this.style.padding ? this.style.padding.top : 0,
        params.data, this.style);
    this.add(this.content);
  }
}
