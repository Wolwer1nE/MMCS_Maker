/**
*/

import MouseTileMarker from "./mouse-tile-maker.js";

export default class SceneTileEditor {

  constructor(scene, eLayer, map)
  {
    this.map = map;
    this.scene = scene;
    this.editedLayer = eLayer;
    this.marker = new MouseTileMarker(scene,map);

    SceneTileEditor.Mode = 
    { 
      "brick":
      {
        tile: 16,
        sprite: scene.add.sprite(100,100,"tilesSheet", 15)
                  .setAlpha(0.5)
                  .setOrigin(0.0)
                  .setVisible(false)
      }, 
      "coin":
      {
        tile: 11,
        sprite: scene.add.sprite(100,100,"tilesSheet", 10)
                  .setAlpha(0.5)
                  .setOrigin(0.0)
                  .setVisible(false)
      }, 
      "eraser": {
        tile: 0,
        sprite: null
      }
    };
    Object.freeze(SceneTileEditor.Mode);
    
    this.setMode(SceneTileEditor.Mode.brick);
    
    this.concrete = 40;
  }
  
  setMode(newMode)
  {
    if (this.mode == newMode)return;
    this.mode = newMode;
    this.marker.setSprite(this.mode.sprite);
  }

  update(pointer)
  {
    const worldPoint = pointer.positionToCamera(this.scene.cameras.main);
    const tileUnderPointer = this.editedLayer.getTileAtWorldXY(worldPoint.x, worldPoint.y);

    if ( (tileUnderPointer != null || this.mode == SceneTileEditor.Mode.eraser) &&
         (tileUnderPointer == null || this.mode != SceneTileEditor.Mode.eraser) ||
         (tileUnderPointer != null && tileUnderPointer.index == this.concrete))
    {
      this.marker.setHighlight(MouseTileMarker.Highlight.warning);
    } else {
      this.marker.setHighlight(MouseTileMarker.Highlight.normal);
    }

    this.marker.update(worldPoint);

    if (pointer.isDown)
    {
      if (this.mode == SceneTileEditor.Mode.eraser)
      {
        //console.log(tileUnderPointer);
        if (tileUnderPointer != null && tileUnderPointer.index != this.concrete &&
            tileUnderPointer.properties.collides)
            this.editedLayer.removeTileAtWorldXY(worldPoint.x, worldPoint.y);
      }
      else if (tileUnderPointer == null)
      {
        this.putTile(this.mode.tile, worldPoint);
      }
    }
  }

  putTile(tileId, worldPosition)
  {
    const tile = this.editedLayer.putTileAtWorldXY(tileId, worldPosition.x, worldPosition.y)
    tile.setCollision(true);
    tile.properties = {collides:true};
  }

  destroy()
  {
    this.marker.destroy();
  }
}
