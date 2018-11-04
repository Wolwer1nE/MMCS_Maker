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
    let content = this.content = this.scene.add.text(0, 0, params.data, this.style);
    content.setPosition(content.x, (this.height - content.height)/2);
    this.add(content);
  }
}
