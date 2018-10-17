/**
 * A class that visualizes the mouse position within a tilemap. Call its update method from the
 * scene's update and call its destroy method when you're done with it.
 */
export default class MouseTileMarker {

  constructor(scene, style) {
    this.scene = scene;
    this.style = style;

    MouseTileMarker.Highlight = { "normal":"normal", "warning":"warning" };
    Object.freeze(MouseTileMarker.Highlight);

    this.normal = scene.add.graphics();
    this.eraser = scene.add.graphics();

    this.sprite = null;
    this.graphics = this.eraser;

    this.setHighlight(MouseTileMarker.Highlight.normal);
    this.setVisible(false);
  }

  setVisible(newVisible)
  {
    if(newVisible == this.visible) return;

    this.visible = newVisible;
    this.graphics.visible = this.visible;
    if (this.sprite)
      this.sprite.visible = this.visible;
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

  setSprite(newSprite)
  {
    if (this.sprite == newSprite) return;

    if (this.sprite != null)
    {
      this.sprite.setVisible(false);
      this.sprite.setPosition(0,0);
    }

    this.graphics.visible = false;

    this.sprite = newSprite;
    if (newSprite != null)
    {
      newSprite.setVisible(this.visible);
      this.graphics = this.normal;
    }
    else
      this.graphics = this.eraser;

    this.graphics.visible = this.visible;
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
