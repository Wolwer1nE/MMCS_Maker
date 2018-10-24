/**
  Button
*/

import SUIView from "./view.js"
import SUIMaker from "../s-ui-maker.js"

export default class SUIButton extends SUIView
{
  constructor(scene, x, y)
  {
    super(scene,x,y,parent);
    this.underlay = this.makeUnderlay()
  }

  makeUnderlay()
  {
    let underlay = this.scene.add.graphics();
  }

  setSprite(newSprite)
  {
    this.sprite = newSprite
  }

  setText(newText)
  {
    this.text = newText
  }
}
