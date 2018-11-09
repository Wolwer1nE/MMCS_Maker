/*
*  Dialog
*/
import XView from "./x-view.js"
import XPanel from "./x-panel.js"
import XLabel from "./x-label.js"
import {XButton,XSystemButton} from "./x-button.js"

export default class XDialog extends XView
{

  constructor(scene, style, width, height, text, buttons, successButton = "ok")
  {
    super(scene, style, width, height,
      {text: text, buttons: buttons, successButton: successButton}
    );
  }

  __init(params)
  {
    let style = this.style;
    //style.label.fixedWidth = this.width;
    let label = new XLabel(
      this.scene, style.label ? style.label : style,
      this.width, this.height / 2,
      params.text);
    //console.log(label);
    let newWidth = label.content.width * 1.1;
    if (this.width < newWidth) this.width = newWidth;
    let newHeight = label.content.height * 3;
    if (this.height < newHeight) this.height = newHeight;

    let panel = this.add(new XPanel(
      this.scene, style.panel ? style.panel : style,
      this.width, this.height));
    panel.setPosition(
      (this.scene.xui.screen.width - this.width) / 2,
      (this.scene.xui.screen.height-this.height) / 2
    );
    panel.add(label);
    label.setPosition((this.width - label.content.width)/2, (this.height/2 - label.content.height)/2);

    let buttonSize = this.height / 3;
    let buttonStyle = style.button ? style.button : style;
    let buttonOffset = this.width / params.buttons.length - buttonSize;
    this.buttons = {};

    params.buttons.forEach(
      (buttonKey, i) =>
      {
        let button = new XSystemButton(this.scene,
          buttonStyle, buttonSize, buttonSize, buttonKey, buttonKey);
        panel.add(button);

        button.on( XButton.Events.onPointerUp,
          buttonKey == params.successButton ?
            () => { this.onSuccess(buttonKey); this.destroy(); } :
            () => { this.onCancel(buttonKey); this.destroy(); }
        );

        this.buttons[buttonKey] = button;

        button.setPosition(
          i * (buttonSize + buttonOffset) + buttonOffset/2,
          (this.height + this.height/2 - buttonSize) / 2
        );
    });
  }

  destroy()
  {
    if (this.scene.xui.dialog === this)
      this.scene.xui.dialog = null;
    super.destroy();
  }
}
