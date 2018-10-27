/**
  View
*/

import XUI from "./x-ui.js"

export default class XView extends Phaser.GameObjects.Container
{
  constructor(scene, style, width, height, params)
  {
    super(scene);

    if (this.__init === undefined) {
      throw new TypeError("Classes extending the view class must init contents");
    }

    this.style = style;
    this.width = width;
    this.height = height;
    this.__init(params);
  }
}
