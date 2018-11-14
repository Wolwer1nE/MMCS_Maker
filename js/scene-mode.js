/*
*
*/
import XControl from "./x-ui/x-control.js";

// recursive object get
Phaser.GameObjects.Container.prototype.getAll =
  function (output, type)
  {
    this.list.forEach((object) => {
      if (object instanceof type) {
        output.push(object);
      } else if (object instanceof Phaser.GameObjects.Container) {
        object.getAll(output, type);
      }
    });
  };

export default class SceneMode extends Phaser.Events.EventEmitter
{
  constructor(scene, layer, map)
  {
    super();
    this.scene = scene;
    this.layer = layer;
    this.map = map;

    if (this.__initUI === undefined) {
      throw new TypeError("Classes extending SceneMode class must implement __initUI ");
    }

    this.__initUI(layer);
  }

  enter(params)
  {
    console.log(new Date(), "enter", params);
    this.params = params;
    if (params)
    {
      if (params.levelId)
      {
        this.scene.firebase.db.level.pull(this.params.levelId).then(
          (level) => {
            console.log(new Date(), "loaded");
            this.map.load(level);
          },
          (error) => console.warn(error)
        );
      }
      else
      {
        this.map.load();
      }
    }

    this.ui.setVisible(true);
    this.setHotkeysEnabled(true);
    this.active = true;
  }

  // update(time, delta)
  // {}

  leave()
  {
    console.log(new Date(), "leave");
    this.ui.setVisible(false);
    this.setHotkeysEnabled(false);
    this.active = false;
  }

  get ui()
  {
    return this.__ui;
  }

  setHotkeysEnabled (enabled)
  {
    let controls = [];
    this.ui.getAll(controls, XControl);

    controls.forEach(control =>
    {
      if (! control.hotkey) return;
      let keyName = control.hotkey.name();
      if (enabled) {
        this.scene.input.keyboard
          .on("keydown_"+keyName, control.onPointerDownInside, control)
          .on("keyup_"+keyName, control.onPointerUpInside, control);
      } else {
        control.onPointerUpOutside(this.scene.input.activePointer);
        this.scene.input.keyboard
          .off("keydown_"+keyName, control.onPointerDownInside, control)
          .off("keyup_"+keyName, control.onPointerUpInside, control);
      }
    });
  }
}
