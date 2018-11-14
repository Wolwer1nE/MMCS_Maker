/**
*/
import SceneMode from "./scene-mode.js"
import SceneMap from "./scene-map.js"
import {XButton} from "./x-ui/x-button.js";

export default class SceneModeEditor extends SceneMode
{

  constructor(scene, layer, map)
  {
    super(scene, layer, map);

    map.layers.forEach(
      (l) => this.scene.xui.insert(l.tilemapLayer)
    );
    this.setEditing(true);
    this.finish = map.finishPoint;

    // Modes!
    this.modes = {}
    let editables = this.map.editableTiles;
    for (var name in editables)
    {
      this.modes[name] = {
        tile: editables[name],
        //sprite: this.map.getSprite(editables[name]).setVisible(false),
      };
    }
    this.modes["erase"] = { tile: 0, sprite: null };
    this.mode = this.modes.brick;

    map.once(SceneMap.Events.modified, this.onMapModified, this);
  }

  update(time, delta)
  {
    let pointer = this.scene.input.activePointer;
    let worldPoint = pointer.positionToCamera(this.scene.cameras.main);
    if (worldPoint.x < 0 || worldPoint.x > this.layer.width ||
        worldPoint.y < 0 || worldPoint.y > this.layer.height)
    {
      this.setEditing(false);
    }
    else
      if(pointer.isDown) this.onPointerDown(pointer);
  }

  leave()
  {
    this.map.save(true);
    super.leave();
  }

  destroy()
  {
    window.onbeforeunload = () => {};
    super.destroy();
  }

  __initUI(layer)
  {
    this.__ui = this.scene.add.container();

    let editables = this.map.editableTiles;
    let height = this.scene.xui.screen.height - this.layer.height;
    let menu = this.scene.xui.add.menu(
      this.scene.xui.style,
      this.scene.xui.screen.width,
      Math.ceil(2*height/3),
      [ {
          name:"brick",
          sprite: this.map.getSpriteForTile(editables["brick"])
        },{
          name: "coin",
          sprite: this.map.getSpriteForTile(editables["coin"])
        },{
          name: "erase",
          type: "cancel"
        },
        "play"
      ], 0.3
    );
    menu.setPosition(0, this.layer.height + height/3);

    let {brick, coin, erase, play} = menu.buttons;
    brick.on(XButton.Events.onPointerUp, this.onModeButtonPressed, this);
    coin.on(XButton.Events.onPointerUp, this.onModeButtonPressed, this);
    erase.on(XButton.Events.onPointerUp, this.onModeButtonPressed, this);

    let { ONE, TWO, THREE, FOUR } = Phaser.Input.Keyboard.KeyCodes;
    brick.hotkey = ONE;
    coin.hotkey = TWO;
    erase.hotkey = THREE;
    play.hotkey  = FOUR;

    this.__ui.add(menu);

    let dataPlate = this.scene.xui.add.panel(
      this.scene.xui.style.panel,
      this.scene.xui.screen.width,
      Math.ceil(height/3) + this.scene.xui.style.panel.borderWidth
    );
    dataPlate.setPosition(0, this.layer.height);
    this.__ui.add(dataPlate);

    this.__ui.setVisible(false);
  }

  get mode()
  {
    return this.__mode;
  }

  set mode(newMode)
  {
    if (this.__mode == newMode)return;
    this.__mode = newMode;
  }

  onModeButtonPressed(button)
  {
    this.mode = this.modes[button.name];
  }

  setEditing(avaliable)
  {
    if (avaliable) {
      this.layer.on("pointerdown", this.onPointerDown, this);
    } else {
      this.layer.off("pointerdown", this.onPointerDown, this);
    }
  }

  onMapModified(tile)
  {
    window.onbeforeunload = () => {
      return "Are you sure you want to leave this page? \
      This will abandon any progress on changes to your level";
    }
  }

  onPointerDown(pointer)
  {
    let worldPoint = pointer.positionToCamera(this.scene.cameras.main);
    if (this.mode == this.modes.erase)
    {
      if (this.map.canRemoveAt(worldPoint)) {
        this.map.removeTileAt(worldPoint);
      }
    }
    else if (this.map.canPutAt(worldPoint))
    {
      this.map.putTile(this.mode.tile, worldPoint);
    }
  }
}
