/**
*  Control
*/

import XView from "./x-view.js";

Phaser.Input.Keyboard.Key.prototype.name =
  function () {
    return Object.keys(Phaser.Input.Keyboard.KeyCodes)
      .find(name => Phaser.Input.Keyboard.KeyCodes[name] === this.keyCode);
  };

export default class XControl extends XView
{
   static get Events() {
    return {
      "onPointerDown":"onPointerDown",
      "onPointerUp":"onPointerUp",
    }
  }

  constructor(scene, style, width, height, params)
  {
    super(scene, style, width, height, params);
    this.__isDown = false;
    this.__isUp = true;
    this.__hotkey = null;
    this.setInteractive(this.underlay, this.onHitCheck);
  }

  onHitCheck(area,x,y,me)
  {
    let pointer = me.scene.input.activePointer;
    let bounds = new Phaser.Geom.Rectangle();
    area.getBounds(bounds);
    return Phaser.Geom.Rectangle.Contains(bounds,pointer.position.x, pointer.position.y);
  }

  onPointerDownInside(pointer)
  {
    this.__isDown = true;
    this.__isUp = false;
    this.emit(XControl.Events.onPointerDown, this);

    pointer.objectDownInside = this;
  }

  onPointerUpInside(pointer)
  {
    console.log("UP", this.name);
    this.__isDown = false;
    this.__isUp = true;
    this.emit(XControl.Events.onPointerUp, this);
  }

  onPointerUpOutside(pointer)
  {
    this.__isDown = false;
    this.__isUp = true;

    pointer.objectDownInside = null;
  }

  get hotkey () {
    return this.__hotkey;
  }

  set hotkey (keyCode) {
    if (keyCode == null)
    {
      this.__hotkey.listeners.remove(this);
      if (this.__hotkey.listeners.count == 0)
        this.scene.input.keyboard.removeKey(this.__hotkey);

      let keyName = this.__hotkey.name();
      this.scene.input.keyboard
        .removeListeners("keydown_"+keyName, this.onPointerDownInside, this)
        .removeListeners("keyup_"+keyName, this.onPointerUpInside, this);

      this.__hotkey = undefined;
    }
    else
    {
      this.__hotkey = this.scene.input.keyboard.addKey(keyCode);

      if (this.__hotkey.listeners === undefined)
        this.__hotkey.listeners = [];
      this.__hotkey.listeners.push(this);
    }
  }

  removeHotkey()
  {
    this.hotkey = null;
  }

  get isDown()
  {
    return this.__isDown || this.__hotkey && this.__hotkey.isDown;
  }

  get isUp()
  {
    return this.__isUp || this.__hotkey && this.__hotkey.isUp;
  }
}
