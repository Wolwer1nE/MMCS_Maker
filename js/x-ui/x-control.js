/**
*  Control
*/

import XView from "./x-view.js";

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
  }

  onPointerDown(pointer)
  {
    this.__isDown = true;
    this.__isUp = false;
    this.emit(XControl.Events.onPointerDown, this);
  }

  onPointerUp(pointer)
  {
    this.__isDown = false;
    this.__isUp = true;
    this.emit(XControl.Events.onPointerUp, this);
  }

  get hotkey () {
    return this.__hotkey;
  }

  set hotkey (key) {
    if (key == null)
    {
      this.__hotkey.listeners.remove(this);
      if (this.__hotkey.listeners.count == 0)
       this.scene.input.keyboard.removeKey(this.__hotkey);
      this.__hotkey = undefined;
    }
    else
    {
      this.__hotkey = this.scene.input.keyboard.addKey(key);
      if (this.__hotkey.listeners === undefined)
        this.__hotkey.listeners = [];
      this.__hotkey.listeners.append(this);
    }
  }

  get isDown()
  {
    return this.__isDown || this.__hotkey.isDown;
  }

  get isUp()
  {
    return this.__isUp || this.__hotkey.isUp;
  }
}
