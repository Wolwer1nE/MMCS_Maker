/**
*  XUI
*/
import XLabel from "./x-label.js"
import XImageLabel from "./x-image-label.js"
import XPanel from "./x-panel.js"
import XControl from "./x-control.js"
import XDialog from "./x-dialog.js"
import XMenu from "./x-menu.js"
import {XSystemButton, XImageButton, XTextButton} from "./x-button.js"

const XUI_STYLE = "x-ui-style";

export default class XUI extends Phaser.Plugins.ScenePlugin
{
  constructor(scene, pluginManager)
  {
    super(scene, pluginManager);
  }

  boot()
  {
    this.screen = {
      width: this.scene.game.canvas.width,
      height: this.scene.game.canvas.height
    };

    var eventEmitter = this.systems.events;
    //eventEmitter.on("update", this.update, this);
    eventEmitter.on("start", this.start, this);
    eventEmitter.on("shutdown", this.shutdown, this);
    eventEmitter.once("destroy", this.destroy, this);
  }

  load(styleSheet)
  {
    this.scene.load.json(XUI_STYLE, styleSheet);

    this.isQueued = false;
    this.uiFilesPath = styleSheet.replace(/\/[^\/]+$/, '/');

    this.scene.load.on("load", this.loadAssetQueue, this);
  }

  loadAssetQueue(file)
  {
    // If style loaded and processed  and assets are not queued yet
    if (!file.loader.cacheManager.json.exists(XUI_STYLE) || this.isQueued)
    { return; }

    this.style = file.loader.cacheManager.json.get(XUI_STYLE);
    if (this.style.assets)
    {
      if (this.style.assets.fonts)
        this.style.assets.fonts.forEach (
          (font) => {
            this.scene.load.bitmapFont(font,
              this.uiFilesPath + "/fonts/"+font+".png",
              this.uiFilesPath + "/fonts/"+font+".fnt")
          }
        );
    }
    this.isQueued = true;
    this.scene.load.removeListener("load", this.loadAssetQueue, this);
  }

  start()
  {
    console.log("XUI START");
    this.container = this.scene.add.container();
    this.container.name = "XUI_Container"
    // Init controls reaction
    this.scene.input.on("gameobjectdown", this.onObjectDown, this);
    this.scene.input.on("gameobjectup", this.onObjectUp, this);
    this.scene.input.on("pointerup", this.onPointerUp, this);
  }

  shutdown()
  {
    console.log("XUI SHUTDOWN");
    this.container.destroy();
  }

  // update(time, delta)
  // {
  // }

  destroy()
  {
    this.scene = undefined;
  }

  showDialog(text, buttons, successButton = "ok")
  {
    return new Promise((success, cancel) =>
    {
      let w = this.screen.width / 2;
      let h = this.screen.height / 4;
      let st = this.style.dialog ? this.style.dialog : this.style
      let d = this.dialog = this.add.dialog(st, w, h, text, buttons, successButton);
      d.onSuccess = success;
      d.onCancel = cancel;
    });
  }

  get SystemButtons()
  {
    return XSystemButton.Type;
  }

  get add()
  {
    var uis =
    {
      panel : (st,w,h) => this.__add(new XPanel(this.scene, st, w, h)),
      label : (st,w,h,text) => this.__add(new XLabel(this.scene, st, w, h, text)),
      imageLabel : (st,w,h,image,text) => this.__add(new XImageLabel(this.scene, st, w, h, image, text)),
      imageButton : (st,w,h,image) => this.__add(new XImageButton(this.scene, st, w, h, image)),
      textButton : (st,w,h,text) => this.__add(new XTextButton(this.scene, st, w, h, text)),
      systemButton : (st,w,h,key) => this.__add(new XSystemButton(this.scene, st, w, h, XSystemButton.Type[key])),
      dialog : (st,w,h,msg,bts,ok) => this.__add(new XDialog(this.scene, st, w, h, msg, bts, ok), true),
      menu : (st,w,h,bts,spc,axs) => this.__add(new XMenu(this.scene, st, w, h, bts, spc, axs)),
    }

    // SystemButtons
    Object.keys(XSystemButton.Type).forEach((key)=>
    {
      uis[key+"Button"] = (st,w,h) => { return uis.systemButton(st,w,h,key) };
    });

    return uis;
  }

  insert(object)
  {
    this.__add(object);
  }

  __add(v, front)
  {
    if (front)
    {
      this.container.add(v);
      this.container.bringToTop(v);
    } else
      this.container.add(v);
    return v;
  }

  onObjectDown(pointer, object)
  {
    if (object instanceof XControl)
    {
      // when we have a dialog window lock the controls to dialog only
      if (this.dialog && !this.dialog.hasChild(object))
        return;
      object.onPointerDownInside(pointer);
    }
  }

  onObjectUp(pointer, object)
  {
    if (object instanceof XControl && object.isDown)
    {
      object.onPointerUpInside(pointer);
    }
  }

  onPointerUp(pointer)
  {
    if (pointer.objectDownInside)
      pointer.objectDownInside.onPointerUpOutside(pointer);
  }

}
