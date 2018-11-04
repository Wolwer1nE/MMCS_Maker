/**
*/
import SceneMode from "./scene-mode.js"
import Player from "./player.js";
import {XButton} from "./x-ui/x-button.js";

export default class SceneModePlayer extends SceneMode
{
  static get Events()
  {
    return {
      "coinCollected":"coinCollected",
      "timerUpdated" :"timerUpdated"
    }
  }

  constructor(scene, layer, map, coinIndex)
  {
    super(scene, layer, map);
    this.collectible = coinIndex

    // Instantiate a player instance at the location of the "Spawn Point" object in the Tiled map
    const spawnPoint = this.spawnPoint = this.map.findObject("Objects", obj => obj.name === "spawnPoint");
    const player = this.player = new Player(scene, spawnPoint.x, spawnPoint.y);
    scene.physics.world.addCollider(player.sprite, this.layer);
    player.sprite.body.collideWorldBounds = true;

    this.finish = map.findObject("Objects", obj => obj.name === "finishPoint");

    this.levelStarted = false;
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
    let { ONE, TWO, THREE, FOUR } = Phaser.Input.Keyboard.KeyCodes;
    left.hotkey = ONE;
    right.hotkey = TWO;
    up.hotkey = THREE;
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
      this.map.getSprite(11),
      "COINS"
    );
    coinsLabel.setPosition(dataPlate.width/6,
      (dataPlate.height - coinsLabel.content.height)/ 2);
    dataPlate.add(coinsLabel);

    let timeLabel = this.timeLabel = this.scene.xui.add.imageLabel(
      this.scene.xui.style.label,
      dataPlate.width/6, dataPlate.height,
      this.map.getSprite(19),
      "TIME"
    );
    timeLabel.setPosition(4*dataPlate.width/6,
      (dataPlate.height - timeLabel.content.height)/2);
    dataPlate.add(timeLabel);

    this.__ui.setVisible(false);
  }

  destroy()
  {
    this.player.destroy();
    super.destroy();
  }

  enter()
  {
    super.enter();
    this.levelStarted = true;

    this.coinsCollected = 0;
    this.coinsTotal = this.map.filterTiles( tile => tile.index == this.collectible).length;
    this.map.setTileIndexCallback(this.collectible, this.onCoinTouched, this, this.map.layer.tilemapLayer);
    this.coinsLabel.content.text = this.coinsCollected +"/"+ this.coinsTotal;
    this.startTimer();
  }

  leave()
  {
    super.leave();
    this.levelStarted = false;
    this.player.reset(this.spawnPoint);
    this.stopTimer();
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
      this.stopTimer();
      this.player.emit(Player.Events.win);
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
