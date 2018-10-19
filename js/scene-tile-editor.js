/**
*/

import MouseTileMarker from "./mouse-tile-marker.js";

export default class SceneTileEditor
{
  constructor(scene, editedLayer, map)
  {
    this.map = map;
    this.scene = scene;
    this.editedLayer = editedLayer;
    this.editedLayer.setInteractive();
    this.setEditing(true);

    this.finish = map.findObject("Objects", obj => obj.name === "finishPoint");
    //this.archiver = new jsscompress.Hauffman()

    SceneTileEditor.Mode =
    {
      "brick":
      {
        tile: 16,
        sprite: scene.add.sprite(0,0,"tilesSheet", 15) // IS THIS A LEAK?!
                  .setOrigin(0,0)
                  .setVisible(false),
        hotkey: Phaser.Input.Keyboard.KeyCodes.ONE
      },
      "coin":
      {
        tile: 11,
        sprite: scene.add.sprite(0,0,"tilesSheet", 10) // IS THIS A LEAK?!
                  .setOrigin(0,0)
                  .setVisible(false),
        hotkey: Phaser.Input.Keyboard.KeyCodes.TWO
      },
      "erase": {
        tile: 0,
        sprite: null,
        hotkey: Phaser.Input.Keyboard.KeyCodes.THREE
      }
    };
    Object.freeze(SceneTileEditor.Mode);

    SceneTileEditor.Events = {
      "modeChanged" : "modeChanged",
      "tileChanged" : "tileChanged",
      "pointerOut"  : "pointerOut",
      "pointerOver" : "pointerOver",
    }
    Object.freeze(SceneTileEditor.Events);

    SceneTileEditor.ConcreteTile = 40;

    //const { ONE, TWO, THREE } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard.addKeys({
      brick: SceneTileEditor.Mode.brick.hotkey,
      coin: SceneTileEditor.Mode.coin.hotkey,
      erase: SceneTileEditor.Mode.erase.hotkey
    });

    this.pointerOut = true;
  }

  setMode(newMode)
  {
    if (this.mode == newMode)return;
    this.mode = newMode;
    this.editedLayer.emit(SceneTileEditor.Events.modeChanged, {editor:this, mode:this.mode});
  }

  setEditing(avaliable)
  {
    if (avaliable){
      this.editedLayer.on("pointerdown", this.onPointerDown, this);
    } else {
      this.editedLayer.off("pointerdown", this.onPointerDown, this);
    }
  }

  saveLevelData()
  {
    const levelData = [];
    this.editedLayer.layer.data.forEach( r => {
      r.forEach( t => {
        if (t.index != -1)
          levelData.push({
            index:t.index,
            x:t.x, y:t.y,
            properties:t.properties
          });
      });
    });

    console.log("save",levelData.length);
    localStorage.setItem("levelData", LZString.compressToUTF16(JSON.stringify(levelData)));
  }

  update(pointer)
  {
    const worldPoint = pointer.positionToCamera(this.scene.cameras.main);
    if (worldPoint.x < 0 || worldPoint.x > this.editedLayer.width ||
        worldPoint.y < 0 || worldPoint.y > this.editedLayer.height)
      {
        if (this.pointerOver) {
          this.pointerOut = true;
          this.pointerOver = false;
          this.editedLayer.emit(SceneTileEditor.Events.pointerOut, {editor:this, pointer: pointer});
        }
        return;
      } else if (this.pointerOut) {
        this.pointerOut = false;
        this.pointerOver = true;
        this.editedLayer.emit(SceneTileEditor.Events.pointerOver, {editor:this, pointer: pointer});
      }

    const tileUnderPointer = this.editedLayer.getTileAtWorldXY(worldPoint.x, worldPoint.y);
    if (this.previousTile == null || this.previousTile != tileUnderPointer)
    {
      const tilePos = this.editedLayer.tilemap.worldToTileXY(worldPoint.x, worldPoint.y);
      const snappedWorldPoint = this.map.tileToWorldXY(tilePos.x, tilePos.y);

      this.editedLayer.emit(SceneTileEditor.Events.tileChanged, {
        editor: this,
        mode: this.mode,
        tilePos: snappedWorldPoint,
        canRemoveTile: this.canRemove(tileUnderPointer),
        canPutTile: this.canPut(tileUnderPointer, worldPoint)
      });
      this.previousTile = tileUnderPointer;
    }

    if(pointer.isDown) this.onPointerDown(pointer);
  }

  canPut(tile, worldPosition)
  {
    return tile == null &&
           Phaser.Math.Distance.Between(
             worldPosition.x, worldPosition.y,
             this.finish.x, this.finish.y) > 2.5*this.map.tileWidth;
  }

  putTile(tileId, worldPosition)
  {
    const tile = this.editedLayer.putTileAtWorldXY(tileId, worldPosition.x, worldPosition.y)
    if (this.mode == SceneTileEditor.Mode.brick)
    {
      tile.setCollision(true);
      tile.properties = {collides:true};
    }
    this.saveLevelData();
  }

  canRemove(tile)
  {
    return tile != null &&
           (tile.index == SceneTileEditor.Mode.coin.tile ||
            tile.index == SceneTileEditor.Mode.brick.tile);
  }

  removeTile(worldPosition)
  {
    this.editedLayer.removeTileAtWorldXY(worldPosition.x, worldPosition.y);
    this.saveLevelData();
  }

  onPointerDown(pointer)
  {
    const worldPoint = pointer.positionToCamera(this.scene.cameras.main);
    const tileUnderPointer = this.editedLayer.getTileAtWorldXY(worldPoint.x, worldPoint.y);
    if (this.mode == SceneTileEditor.Mode.erase)
    {
      if (this.canRemove(tileUnderPointer))
        this.removeTile(worldPoint);
    }
    else if (this.canPut(tileUnderPointer, worldPoint))
    {
      this.putTile(this.mode.tile, worldPoint);
    }
  }

  destroy()
  {
    //this.archiver.destroy();
  }
}
