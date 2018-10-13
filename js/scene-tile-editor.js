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

    this.tileBrush = 16;
    this.concrete = 40;
    this.isErasing = false;
  }

  update(pointer)
  {
    const worldPoint = pointer.positionToCamera(this.scene.cameras.main);
    const tileUnderPointer = this.editedLayer.getTileAtWorldXY(worldPoint.x, worldPoint.y);

    if ( tileUnderPointer != null )
    {
      this.marker.setHighlight(MouseTileMarker.Highlight.warning);
    } else {
      this.marker.setHighlight(MouseTileMarker.Highlight.normal);
    }

    this.marker.update(worldPoint);


    if (pointer.isDown)
    {
      if (this.isErasing)
      {
        //console.log(tileUnderPointer);
        if (tileUnderPointer != null && tileUnderPointer.index != this.concrete &&
            tileUnderPointer.properties.collides)
            this.editedLayer.removeTileAtWorldXY(worldPoint.x, worldPoint.y);
      }
      else if (tileUnderPointer == null)
      {
        this.putTile(this.tileBrush, worldPoint);
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
