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
    
    this.graphics = scene.add.graphics();    
    this.setHighlight(MouseTileMarker.Highlight.normal);
  }

  setHighlight(newHighlight)
  {
    if (newHighlight == this.highlight) return;
    this.highlight = newHighlight;
    this.graphics.lineStyle(3, this.highlight, 1);
    this.graphics.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);
  }
  
  update(worldPosition) 
  {
    const pointerTileXY = this.map.worldToTileXY(worldPosition.x, worldPosition.y);
    const snappedWorldPoint = this.map.tileToWorldXY(pointerTileXY.x, pointerTileXY.y);  
  
    this.graphics.setPosition(snappedWorldPoint.x, snappedWorldPoint.y);
  }

  destroy() {
    this.graphics.destroy();
  } 
}
