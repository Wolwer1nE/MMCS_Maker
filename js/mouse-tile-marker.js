/**
 * A class that visualizes the mouse position within a tilemap. Call its update method from the
 * scene's update and call its destroy method when you're done with it.
 */

import XView from "./x-ui/x-view.js"

export default class MouseTileMarker extends XView
{
  static get Highlight()
  {
    return { "normal" : "normal", "warning" : "warning" };
  }

  constructor(scene, style, width, height)
  {
    this.normal = scene.add.graphics();
    this.eraser = scene.add.graphics();

    this.sprite = null;
    this.graphics = this.eraser;

    this.setHighlight(MouseTileMarker.Highlight.normal);
    this.setVisible(false);
  }

  setHighlight(newHighlight)
  {
    if (newHighlight == this.highlight) return;

    this.highlight = newHighlight;

    const style = this.style;

    const g = this.graphics;

    g.lineStyle(style.borderWidth, style.borderColor[this.highlight], style.alpha);
    g.strokeRect(style.margins.left, style.margins.top,
                style.width - style.margins.right,
                style.height - style.margins.bottom);

    if (this.sprite == null)
    {
      g.beginPath();
      g.moveTo(0, 0);
      g.lineTo(style.width, style.height);
      g.moveTo(0, style.height);
      g.lineTo(style.width, 0);
      g.strokePath();
    }
  }

  set sprite(newSprite)
  {
    if (this.__sprite == newSprite) return;

    var pos = null;
    if (this.__sprite)
    {
      this.__sprite.setVisible(false);
      //this.sprite.setPosition(0,0);
      pos = this.__sprite.position;
    }

    this.__sprite = newSprite;
    if (newSprite)
    {
      newSprite.setVisible(this.visible);
      newSprite.setAlpha(0.5)
      if (pos)
        newSprite.setPosition(pos.x,pos.y);
      this.graphics = this.normal;
    }
    else
      this.graphics = this.eraser;
  }

  updateFor(event)
  {
    const tilePos = event.tilePos;

    const isErasing = this.sprite == null;

    if (isErasing && event.canRemoveTile ||
        !isErasing && event.canPutTile)
      this.setHighlight(MouseTileMarker.Highlight.normal);
    else
      this.setHighlight(MouseTileMarker.Highlight.warning);

    this.graphics.setPosition(tilePos.x, tilePos.y);
    if (this.sprite)
      this.sprite.setPosition(tilePos.x, tilePos.y);
  }

  destroy() {
    this.normal.destroy();
    this.eraser.destroy();
  }
}
