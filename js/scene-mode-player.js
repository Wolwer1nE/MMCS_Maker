/**
*/
import {SceneMode} from "./scene-mode.js"
import Player from "./player.js";
import {XButton} from "./x-ui/x-button.js";

export default class SceneModePlayer extends SceneMode
{
  static get Events()
  {
    return {
      "coinCollected":"coinCollected",
      "timerUpdated" :"timerUpdated",
      "playerDead"   :"playerDead",
      "playerWin"    :"playerWin"
    }
  }

  constructor(scene, layer, map, coinIndex)
  {
    super(scene, layer, map);
    this.collectible = coinIndex

    // Instantiate a player instance at the location of the "Spawn Point" object in the Tiled map
    let spawnPoint = this.spawnPoint = this.map.spawnPoint;
    let player = this.player = new Player(scene, spawnPoint.x, spawnPoint.y);
    scene.physics.world.addCollider(player.sprite, this.layer);
    player.sprite.body.collideWorldBounds = true;

    this.finish = map.findObject("Objects", obj => obj.name === "finishPoint");
  }

  __initUI(layer)
  {
    this.__ui = this.scene.add.container();

    let height = this.scene.xui.screen.height - this.layer.height;
    let menu = this.scene.xui.add.menu(
      this.scene.xui.style,
      this.scene.xui.screen.width,
      Math.ceil(2*height/3),
      [ "left", "right", "up", "replay"],
      0.3
    );
    menu.setPosition(0, this.layer.height + height/3);

    let {left, right, up, replay} = menu.buttons;
    let { A, D, W, FOUR } = Phaser.Input.Keyboard.KeyCodes;
    left.hotkey = A;
    right.hotkey = D;
    up.hotkey = W;
    replay.hotkey  = FOUR;

    this.__ui.add(menu);

    let dataPlate = this.scene.xui.add.panel(
      this.scene.xui.style.panel,
      this.scene.xui.screen.width,
      Math.ceil(height/3) + this.scene.xui.style.panel.borderWidth
    );
    dataPlate.setPosition(0, this.layer.height);
    this.__ui.add(dataPlate);

    let coinsLabel = this.coinsLabel = this.scene.xui.add.imageLabel(
      this.scene.xui.style.label,
      dataPlate.width/6, dataPlate.height,
      this.map.getSpriteForTile(11),
      "COINS"
    );
    coinsLabel.setPosition(dataPlate.width/6,
      (dataPlate.height - coinsLabel.height)/ 2);
    dataPlate.add(coinsLabel);

    let timeLabel = this.timeLabel = this.scene.xui.add.imageLabel(
      this.scene.xui.style.label,
      dataPlate.width/6, dataPlate.height,
      this.map.getSpriteForTile(19),
      "TIME"
    );
    timeLabel.setPosition(4*dataPlate.width/6,
      (dataPlate.height - timeLabel.height)/2);
    dataPlate.add(timeLabel);

    this.__ui.setVisible(false);
  }

  destroy()
  {
    this.player.destroy();
    super.destroy();
  }

  enter(params)
  {
    super.enter(params);
    this.map.setTileIndexCallback(this.collectible, this.onCoinTouched, this, this.map.layer.tilemapLayer);

    this.coinsCollected = 0;
    this.coinsTotal = this.map.filterTiles( tile => tile.index == this.collectible).length;
    this.coinsLabel.content.text = this.coinsCollected +"/"+ this.coinsTotal;
    this.startTimer();

  }

  leave()
  {
    this.player.reset(this.spawnPoint);
    this.stopTimer();
    this.map.load();

    super.leave();
  }

  update(time, delta)
  {
    if (this.player.sprite.y > this.map.layer.tilemapLayer.height)
    {
      this.emit(SceneModePlayer.Events.playerDead);
    }
    else if(Phaser.Math.Distance.Between(
      this.player.sprite.x, this.player.sprite.y,
      this.finish.x, this.finish.y) < this.map.tileWidth)
    {
      this.stopTimer();
      this.emit(SceneModePlayer.Events.playerWin);
    }

    let {left, right, up} = this.ui.list[0].buttons;
    let keys = {
      "left"  : { isDown: left.isDown  },
      "right" : { isDown: right.isDown },
      "up"    : { isDown: up.isDown    }
    };
    this.player.update(keys);
  }

  onCoinTouched(player, coin)
  {
    this.layer.removeTileAt(coin.x, coin.y);
    this.coinsCollected +=1;
    this.coinsLabel.content.text = this.coinsCollected +"/"+ this.coinsTotal;
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
    let time = this.time += 1;
    let seconds = time/60 |0;
    let mseconds = time%60;
    this.timeLabel.content.text = (seconds<10 ? "0"+seconds : seconds) + ":" +
                                             (mseconds<10 ? "0"+mseconds : mseconds);
  }
}
