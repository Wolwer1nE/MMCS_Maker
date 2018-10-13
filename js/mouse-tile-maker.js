/**
 * A class that visualizes the mouse position within a tilemap. Call its update method from the
 * scene's update and call its destroy method when you're done with it.
 */
export default class MouseTileMarker {  

  constructor(scene, map) {
    this.map = map;
    this.scene = scene;
    
    MouseTileMarker.Highlight = { "normal":0xffffff, "warning":0xff4f78 };
    Object.freeze(MouseTileMarker.Highlight);
    
    this.normal = scene.add.graphics();    
    this.eraser = scene.add.graphics(); 
    
    this.sprite = null;
    this.graphics = this.eraser;
    
    this.setHighlight(MouseTileMarker.Highlight.normal);
  }

  setHighlight(newHighlight)
  {
    if (newHighlight == this.highlight) return;
    
    this.highlight = newHighlight;
    
    const g = this.graphics;
    
    g.lineStyle(3, this.highlight, 1);
    g.strokeRect(-1, -1, this.map.tileWidth+2, this.map.tileHeight+2);
    
    if (this.sprite == null)
    {
      g.beginPath();
      g.moveTo(0, 0);
      g.lineTo(this.map.tileWidth, this.map.tileHeight);
      g.moveTo(0, this.map.tileHeight);
      g.lineTo(this.map.tileWidth, 0);
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
      newSprite.setVisible(true);
      this.graphics = this.normal;
    }
    else 
      this.graphics = this.eraser;
    this.graphics.visible = true;
  }
  
  update(worldPosition) 
  {
    const pointerTileXY = this.map.worldToTileXY(worldPosition.x, worldPosition.y);
    const snappedWorldPoint = this.map.tileToWorldXY(pointerTileXY.x, pointerTileXY.y);  
  
    this.graphics.setPosition(snappedWorldPoint.x, snappedWorldPoint.y);
    if (this.sprite != null)
      this.sprite.setPosition(snappedWorldPoint.x, snappedWorldPoint.y);
  }

  destroy() {
    this.normal.destroy();
    this.eraser.destroy();
  } 
}
