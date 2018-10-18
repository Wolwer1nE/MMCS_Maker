/**
*/

export default class ScenePlayer
{
  constructor(scene, map, coinIndex)
  {
    this.scene = scene;
    this.map = map;
    //this.playedLayer = map.createBlankDynamicLayer("playedLayer", "map");
    //this.playedLayer.putTilesAt(playedLayer.getTilesWithin());


    ScenePlayer.Events = {
      "coinCollected":"coinCollected",
      "timerUpdated" :"timerUpdated"
    }
    Object.freeze(ScenePlayer.Events);

    this.coinsCollected = 0;
    this.coinsTotal = map.filterTiles( tile => tile.index == coinIndex).length;
    console.log(this.coinsTotal);
    map.setTileIndexCallback(coinIndex, this.onCoinTouched, this, map.layer.tilemapLayer);

    this.finish = map.filterObjects("Objects", obj => obj.name === "finishPoint");
  }

  update(time,delta)
  {

  }

  onCoinTouched(player, coin)
  {
    coin.layer.tilemapLayer.removeTileAt(coin.x, coin.y);
    this.coinsCollected +=1;
    console.log(this.coinsCollected);
    this.map.layer.tilemapLayer.emit(ScenePlayer.Events.coinCollected, this.coinsCollected);
  }

  startTimer()
  {
    this.time = 0;
    this.timeEvent = this.scene.time.addEvent({
      delay: 10,
      callback: this.onTimerUpdate,
      callbackScope: this,
      loop: true,
    });
  }

  stopTimer()
  {
    this.timeEvent.remove();
  }

  onTimerUpdate()
  {
    console.log(this.time / 60 | 0 , this.time % 60);
    this.time += 1;
    this.map.layer.emit(ScenePlayer.Events.timerUpdated, this.time);
  }

  destroy()
  {}
}
