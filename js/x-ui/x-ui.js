/**
*  XUI
*/
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
    var eventEmitter = this.systems.events;
    eventEmitter.once('destroy', this.destroy, this);
  }

  load(styleSheet)
  {
    this.scene.load.json(XUI_STYLE, styleSheet);
    this.scene.load.once("complete",
      (loader) => {
        this.style = loader.cacheManager.json.get(XUI_STYLE);
      }, this
    );
  }

  destroy()
  {
    this.scene = undefined;
  }

  showDialog()
  {
    // return new Promise(success, fail)
  }

  get make() {
    var uis = {
      panel : (st,w,h) => { return new XPanel(this.scene, st, w, h) },
      label : (st,w,h,text) => { return new XLabel(this.scene, st, w, h, text) },
      //button : (st,w,h) => { return new XButton(this.scene, st, w, h) },
      imageButton : (st,w,h,image) => { return new XImageButton(this.scene, st, w, h, image) },
      textButton : (st,w,h,text) => { return new XTextButton(this.scene, st, w, h, text) },
    }

    //SystemButtons

    Object.keys(XSystemButton.Type).forEach((key)=>
    {
      uis[key+"Button"] = (st,w,h) => { return new XSystemButton(this.scene, st, w, h, XSystemButton.Type[key]) };
    });

    return uis;
  }
}
