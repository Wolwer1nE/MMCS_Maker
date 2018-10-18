/**
*/
import Player from "./player.js";

export default class ScenePlayer extends Phaser.Events.EventEmitter
{
  constructor(scene, map, coinIndex)
  {
    super();
    this.scene = scene;
    this.map = map;
    this.collectible = coinIndex
    //this.playedLayer = map.createBlankDynamicLayer("playedLayer", "map");
    //this.playedLayer.putTilesAt(playedLayer.getTilesWithin());

    // Instantiate a player instance at the location of the "Spawn Point" object in the Tiled map
    const spawnPoint = map.findObject("Objects", obj => obj.name === "spawnPoint");
    const player = this.player = new Player(scene, spawnPoint.x, spawnPoint.y);
    scene.physics.world.addCollider(player.sprite, map.layer.tilemapLayer);
    player.sprite.body.collideWorldBounds = true;

    this.finish = map.findObject("Objects", obj => obj.name === "finishPoint");

    ScenePlayer.Events = {
      "coinCollected":"coinCollected",
      "timerUpdated" :"timerUpdated"
    }
    Object.freeze(ScenePlayer.Events);

    this.levelStarted = false;
  }

  update(time, delta)
  {
    if (!this.levelStarted) return;

    if (this.player.sprite.y > this.map.layer.tilemapLayer.height)
    {
      this.player.emit(Player.Events.death);
    }
    else if(Phaser.Math.Distance.Between(
      this.player.sprite.x, this.player.sprite.y,
      this.finish.x, this.finish.y) < this.map.tileWidth)
    {
      this.player.emit(Player.Events.win);
    }
  }

  destroy()
  {
    this.removeAllListeners();
    this.player.destroy();
  }

  startLevel()
  {
    this.levelStarted = true;
    this.coinsCollected = 0;
    this.coinsTotal = this.map.filterTiles( tile => tile.index == this.collectible).length;
    this.emit(ScenePlayer.Events.coinCollected, {collected: this.coinsCollected, total:this.coinsTotal});
    this.map.setTileIndexCallback(this.collectible, this.onCoinTouched, this, this.map.layer.tilemapLayer);
    this.startTimer();
  }

  resetLevel()
  {
    if (!this.levelStarted) return;
    this.levelStarted = false;
    this.stopTimer();
  }

  onCoinTouched(player, coin)
  {
    coin.layer.tilemapLayer.removeTileAt(coin.x, coin.y);
    this.coinsCollected +=1;
    this.emit(ScenePlayer.Events.coinCollected, {collected:this.coinsCollected, total:this.coinsTotal});
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
    this.emit(ScenePlayer.Events.timerUpdated, this.time);
  }

  stopTimer()
  {
    this.timeEvent.remove();
  }

  onTimerUpdate()
  {
    console.log(this.time / 60 | 0 , this.time % 60);
    this.time += 1;
    this.emit(ScenePlayer.Events.timerUpdated, this.time);
  }
}
