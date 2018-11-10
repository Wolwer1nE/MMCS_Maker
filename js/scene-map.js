/*
*
*/

export default class SceneMap extends Phaser.Tilemaps.Tilemap
{
  static get Events() {
    return {
      "modified":"modified"
    }
  }

  constructor(scene, tilemapKey, tilesheetKey, tileWidth, tileHeight, insertNull)
  {
    if (tileWidth === undefined) { tileWidth = 32; }
    if (tileHeight === undefined) { tileHeight = 32; }
    if (insertNull === undefined) { insertNull = false; }

    let tilemapData = scene.cache.tilemap.get(tilemapKey);
    let mapData = Phaser.Tilemaps.Parsers.Parse(tilemapKey, tilemapData.format, tilemapData.data, tileWidth, tileHeight, insertNull);
    super(scene, mapData);

    let tiles = this.addTilesetImage(this.tilesets[0].name, tilesheetKey);
    this.layers.forEach (
      (layer) => {
        let isStatic = layer.properties.find((o) => o.name === "static")
        if (isStatic && isStatic.value == true)
        {
          this.createStaticLayer(layer.name, tiles);
        }
        else
        {
          let dyn = this.createDynamicLayer(layer.name, tiles);
          dyn.setCollisionByProperty({ collides: true });
        }
    });

    this.__editables = {};
    for (var index in tiles.tileProperties)
    {
      if (tiles.tileProperties[index].editable == true)
        this.__editables[tiles.tileProperties[index].name] = (0|index) + 1;
    }

    this.beckon = new Phaser.Events.EventEmitter();
  }

  destroy()
  {
    this.beckon.destroy();
    super.destroy();
  }

  get spawnPoint()
  {
    return this.findObject("Objects", obj => obj.name === "spawnPoint");
  }

  get finishPoint()
  {
    return this.findObject("Objects", obj => obj.name === "finishPoint");
  }

  get editableTiles()
  {
    return this.__editables;
  }

  getSpriteForTile(tileId)
  {
    return this.scene.add.sprite(0,0, this.tilesets[0].image.key, tileId-1)
              .setOrigin(0,0);
  }

  canPutAt(worldPosition)
  {
    let tile = this.layer.tilemapLayer.getTileAtWorldXY(worldPosition.x, worldPosition.y);
    return tile == null &&
           Phaser.Math.Distance.Between(
             worldPosition.x, worldPosition.y,
             this.finishPoint.x, this.finishPoint.y) > 2*this.tileWidth;
  }

  putTile(tileId, worldPosition)
  {
    let tile = this.layer.tilemapLayer.putTileAtWorldXY(tileId, worldPosition.x, worldPosition.y)
    tile.properties = this.tilesets[0].tileProperties[tileId-1];
    if (tile.properties.collides)
      tile.setCollision(true);

    this.emit(SceneMap.Events.modified, tile);
  }

  removeTileAt(worldPosition)
  {
    let tile = this.layer.tilemapLayer.removeTileAtWorldXY(worldPosition.x, worldPosition.y);

    this.emit(SceneMap.Events.modified, tile);
  }

  canRemoveAt(worldPosition)
  {
    let tile = this.layer.tilemapLayer.getTileAtWorldXY(worldPosition.x, worldPosition.y);
    return tile != null &&
           Object.values(this.editableTiles).includes(tile.index);
  }

  set dynamicLayerData(levelData)
  {
    levelData.forEach(
      (t) => {
        let tile = this.layer.tilemapLayer.putTileAt(t.index, t.x, t.y);
        tile.properties = t.properties;
    });
    this.layer.tilemapLayer.setCollisionByProperty({ collides: true });
  }

  get dynamicLayerData()
  {
    let levelData = [];
    this.layer.data.forEach( r => {
      r.forEach( t => {
        if (t.index != -1)
          levelData.push(
            {
              index: t.index,
              x: t.x,
              y: t.y,
              properties: t.properties
            });
      });
    });
    return levelData;
  }

  save()
  {
    this.scene.levelStorage.setData(this.dynamicLayerData);
  }

  load(levelData)
  {
    if (levelData === undefined)
      levelData = this.scene.levelStorage.getData();

    if (levelData == null) return;

    this.dynamicLayerData = levelData;
  }

  /*
  * BECKON
  */

  emit(event, payload)
  {
    this.beckon.emit(event, payload);
  }

  on(event, callback, context)
  {
    this.beckon.on(event, callback, context);
  }

  off(event, callback, context)
  {
    this.beckon.off(event, callback, context);
  }

  once(event, callback, context)
  {
    this.beckon.once(event, callback, context);
  }

  removeListener(event, callback, context, once)
  {
    this.beckon.removeListener(event, callback, context, once);
  }

  removeAllListeners(event)
  {
    this.beckon.removeAllListeners(event);
  }
}
