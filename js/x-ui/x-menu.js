/*
*  Menu
*/
import XView from "./x-view.js"
import XPanel from "./x-panel.js"
import XRender from "./x-render.js"
import {XSystemButton, XTextButton, XImageButton} from "./x-button.js"

export default class XMenu extends XView
{

  constructor(scene, style, width, height, buttons, buttonSpace, axis)
  {
    super(scene, style, width, height, {buttons: buttons, buttonSpace: buttonSpace, axis: axis});
  }

  __init(params)
  {
    let style = this.style;

    let panel = this.add(new XPanel(
      this.scene, style.panel ? style.panel : style,
      this.width, this.height));

    let buttonSize = Math.sqrt( params.buttonSpace*this.width*this.height / params.buttons.length );
    let buttonStyle = style.button ? style.button : style;
    let buttonOffset = this.width / params.buttons.length - buttonSize;

    this.buttons = {};

    params.buttons.forEach(
      (buttonKey, i) =>
      {
        var button = undefined;
        if (typeof buttonKey == "string")
        {
          if (XSystemButton.Type.hasOwnProperty(buttonKey))
          {
            button = new XSystemButton(this.scene,
              buttonStyle, buttonSize, buttonSize,
              buttonKey, buttonKey);
          }
          else
          {
            button = new XTextButton(this.scene,
              buttonStyle, buttonSize, buttonSize,
              buttonKey, buttonKey);
          }
          button.name = buttonKey;
        }
        else if (typeof buttonKey == "object")
        {
          if (buttonKey.sprite)
          {
            button = new XImageButton(this.scene,
              buttonStyle, buttonSize, buttonSize, buttonKey.name,
              XRender.make.copy(this.scene, buttonKey.sprite));
          }
          else if (buttonKey.type)
          {
            button = new XSystemButton(this.scene,
              buttonStyle, buttonSize, buttonSize,
              buttonKey.name, buttonKey.type);
          }
          else if (buttonKey.text)
          {
            button = new XTextButton(this.scene,
              buttonStyle, buttonSize, buttonSize,
              buttonKey.name, buttonKey.text);
          }
        }

        this.buttons[button.name] = button;
        panel.add(button);

        button.setPosition(
          i * (buttonSize + buttonOffset) + buttonOffset/2,
          (this.height - buttonSize) / 2
        );
    });
  }
}
