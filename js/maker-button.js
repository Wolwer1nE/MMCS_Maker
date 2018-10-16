/**
  Small fabric for button graphics
*/
import SceneTileEditor from "./scene-tile-editor.js";

export default class MakerButton
{
  constructor(parent, style)
  {
    this.parent = parent;
    this.style = style;
  }

  makeButton(position, name)
  {
    var button = null;
    var offset = 0;
    switch (name)
    {
      case "pause":
        button = this.drawPause("pauseButton");
        break;
      case "play":
        button = this.drawPlay("playButton");
        break;
      case "erase":
        button = this.drawErase("eraseButton");
        break;
      case "left":
        button = this.drawLeft("leftButton");
        break;
      case "right":
        button = this.drawRight("rightButton");
        break;
      case "up":
        button = this.drawUp("upButton");
        break;
      default:
        if (SceneTileEditor.Mode.hasOwnProperty(name))
        {
          button = this.makeCopyOf(SceneTileEditor.Mode[name].sprite);
          button.setScale((this.style.size - 3*this.style.borderWidth)/button.width);
          offset = this.style.borderWidth;
        } else
          button = this.parent.scene.add.graphics();
    }

    if(this.parent != null)
      this.parent.add(button);

    button.setPosition(position.x+2*offset, position.y+1.5*offset);
    button.visible = false;

    button.setInteractive();
    button.on('pointerover', (event) => {console.log(event);});
    button.on('pointerdown', () => {button.isDown = true; button.isUp = false;});
    button.on('pointerup', () => {button.isDown = false; button.isUp = true;});
    button.on('pointerout', () => {button.isDown = false; button.isUp = false;} );

    button.name = name;
    return button;
  };

  drawPlay(textureKey)
  {
    const button = this.parent.scene.add.graphics();
    const style = this.style;
    const top =    {x: style.size/ 4,   y: style.size/ 4};
    const point =  {x: 3*style.size/ 4, y: style.size/ 2};
    const bottom = {x: style.size/ 4,   y: 3*style.size/ 4};

    button.fillStyle(style.fillColor, style.alpha);
    button.fillTriangle(top.x,top.y,point.x,point.y, bottom.x,bottom.y);

    button.lineStyle(style.borderWidth, style.borderColor, style.alpha);
    button.beginPath();
    button.moveTo(bottom.x, bottom.y);
    button.lineTo(top.x, top.y);
    button.lineTo(point.x, point.y);
    button.strokePath();

    button.lineStyle(style.borderWidth, style.highlightColor, style.alpha);
    button.beginPath();
    button.moveTo(bottom.x, bottom.y);
    button.lineTo(point.x, point.y);
    button.strokePath();

    button.generateTexture(textureKey, style.size, style.size);
    button.destroy();

    return this.makeSprite(textureKey);
  }

  drawPause(textureKey)
  {
    const button = this.parent.scene.add.graphics();
    const style = this.style;
    const topLeft =  {x: style.size/ 4,                 y: style.size/ 4};
    const topRight = {x: style.size/ 4 + style.size/ 3, y: style.size/ 4};

    button.fillStyle(style.fillColor, style.alpha);
    button.fillRect(topRight.x, topRight.y, style.size/6, style.size/2);
    button.fillRect(topLeft.x, topLeft.y, style.size/6, style.size/2);

    button.lineStyle(style.borderWidth, style.highlightColor, style.alpha);
    button.strokeRect(topRight.x, topRight.y, style.size/6, style.size/2);
    button.strokeRect(topLeft.x, topLeft.y, style.size/6, style.size/2);

    button.lineStyle(style.borderWidth, style.borderColor, style.alpha);
    button.beginPath();
    button.moveTo(topLeft.x, topLeft.y + style.size/2+1);
    button.lineTo(topLeft.x, topLeft.y-1);
    button.moveTo(topLeft.x-1, topLeft.y);
    button.lineTo(topLeft.x + style.size/6+1, topLeft.y);
    button.moveTo(topRight.x, topRight.y + style.size/2);
    button.lineTo(topRight.x, topRight.y-1);
    button.moveTo(topRight.x-1, topRight.y);
    button.lineTo(topRight.x + style.size/6, topRight.y);
    button.strokePath();

    button.generateTexture(textureKey, style.size, style.size);
    button.destroy();

    return this.makeSprite(textureKey);
  }

  drawErase(textureKey)
  {
    const button = this.parent.scene.add.graphics();
    const style = this.style;

    const topLeft =  {x: style.size/ 4, y: style.size/ 4};
    const bottomRight = {x: style.size/ 4 + style.size/ 2, y: style.size/ 4+ style.size/ 2};
    const offset = 2 * style.borderWidth;

    const topLeftLeft = {x: topLeft.x, y: topLeft.y + offset};
    const topLeftRight = {x: topLeft.x + offset, y: topLeft.y};
    const bottomRightLeft = {x:bottomRight.x - offset, y: bottomRight.y};
    const bottomRightRight = {x: bottomRight.x, y: bottomRight.y - offset};

    const topRightLeft = {x: bottomRight.x - offset, y: topLeft.y};
    const bottomLeftRight = {x: topLeft.x + offset, y:bottomRight.y};
    const bottomLeftLeft = {x: topLeft.x, y: bottomRight.y - offset};
    const topRightRight = {x:bottomRight.x, y:topLeft.y + offset};

    const centerTop = {x: style.size /2, y: style.size /2 - offset};
    const centerBottom = {x:style.size /2, y: style.size /2 + offset};
    const centerLeft = {x:style.size /2 - offset, y: style.size /2};
    const centerRight = {x:style.size /2 + offset, y: style.size /2};

    button.lineStyle(style.borderWidth, style.highlightColor, style.alpha);
    button.fillStyle(style.fillColor, style.alpha);
    button.beginPath();

    button.moveTo(topLeftLeft.x, topLeftLeft.y);
    button.lineTo(topLeftRight.x, topLeftRight.y);
    button.lineTo(centerTop.x, centerTop.y);
    button.lineTo(topRightLeft.x, topRightLeft.y);
    button.lineTo(topRightRight.x, topRightRight.y);
    button.lineTo(centerRight.x, centerRight.y);
    button.lineTo(bottomRightRight.x, bottomRightRight.y);
    button.lineTo(bottomRightLeft.x, bottomRightLeft.y);
    button.lineTo(centerBottom.x, centerBottom.y);
    button.lineTo(bottomLeftRight.x, bottomLeftRight.y);
    button.lineTo(bottomLeftLeft.x, bottomLeftLeft.y);
    button.lineTo(centerLeft.x, centerLeft.y);
    button.closePath();

    button.fillPath();
    button.strokePath();

    button.lineStyle(style.borderWidth, style.borderColor, style.alpha);
    button.beginPath();

    button.moveTo(bottomLeftRight.x, bottomLeftRight.y);
    button.lineTo(bottomLeftLeft.x, bottomLeftLeft.y);
    button.lineTo(centerLeft.x, centerLeft.y);
    button.lineTo(topLeftLeft.x, topLeftLeft.y);
    button.lineTo(topLeftRight.x, topLeftRight.y);
    button.lineTo(centerTop.x, centerTop.y);
    button.lineTo(topRightLeft.x, topRightLeft.y);
    button.lineTo(topRightRight.x, topRightRight.y);

    button.moveTo(centerRight.x, centerRight.y);
    button.lineTo(bottomRightRight.x, bottomRightRight.y);

    button.moveTo(centerBottom.x, centerBottom.y);
    button.lineTo(bottomRightLeft.x, bottomRightLeft.y);

    button.strokePath();

    button.generateTexture(textureKey, style.size, style.size);
    button.destroy();

    return this.makeSprite(textureKey);
  }

  drawRight(textureKey)
  {
    const button = this.parent.scene.add.graphics();
    const style = this.style;
    const top =    {x: style.size/ 2 - style.size /12,   y: style.size/ 3};
    const point =  {x: 2*style.size/ 3 - style.size /12, y: style.size/ 2};
    const bottom = {x: style.size/ 2- style.size /12,   y: 2*style.size/ 3};

    button.fillStyle(style.fillColor, style.alpha);
    button.fillTriangle(top.x,top.y,point.x,point.y, bottom.x,bottom.y);

    button.lineStyle(style.borderWidth, style.borderColor, style.alpha);
    button.beginPath();
    button.moveTo(bottom.x, bottom.y);
    button.lineTo(top.x, top.y);
    button.lineTo(point.x, point.y);
    button.strokePath();

    button.lineStyle(style.borderWidth, style.highlightColor, style.alpha);
    button.beginPath();
    button.moveTo(bottom.x, bottom.y);
    button.lineTo(point.x, point.y);
    button.strokePath();

    button.generateTexture(textureKey, style.size, style.size);
    button.destroy();

    return this.makeSprite(textureKey);
  }

  drawLeft(textureKey)
  {
    const button = this.parent.scene.add.graphics();
    const style = this.style;
    const top =    {x: style.size/ 2 +style.size /12,   y: style.size/ 3};
    const point =  {x: style.size/ 3 + style.size /12, y: style.size/ 2};
    const bottom = {x: style.size/ 2 +style.size /12,   y: 2*style.size/ 3};

    button.fillStyle(style.fillColor, style.alpha);
    button.fillTriangle(top.x,top.y,point.x,point.y, bottom.x,bottom.y);

    button.lineStyle(style.borderWidth, style.borderColor, style.alpha);
    button.beginPath();
    button.moveTo(top.x, top.y);
    button.lineTo(point.x, point.y);
    button.lineTo(bottom.x, bottom.y);
    button.strokePath();

    button.lineStyle(style.borderWidth, style.highlightColor, style.alpha);
    button.beginPath();
    button.moveTo(bottom.x, bottom.y);
    button.lineTo(top.x, top.y);
    button.strokePath();

    button.generateTexture(textureKey, style.size, style.size);
    button.destroy();

    return this.makeSprite(textureKey);
  }

  drawUp(textureKey)
  {
    const button = this.parent.scene.add.graphics();
    const style = this.style;
    const top =    {y: style.size/ 2 +style.size /12,   x: style.size/ 3};
    const point =  {y: style.size/ 3 + style.size /12, x: style.size/ 2};
    const bottom = {y: style.size/ 2 +style.size /12,   x: 2*style.size/ 3};

    button.fillStyle(style.fillColor, style.alpha);
    button.fillTriangle(top.x,top.y,point.x,point.y, bottom.x,bottom.y);

    button.lineStyle(style.borderWidth, style.borderColor, style.alpha);
    button.beginPath();
    button.moveTo(top.x, top.y);
    button.lineTo(point.x, point.y);
    button.lineTo(bottom.x, bottom.y);
    button.strokePath();

    button.lineStyle(style.borderWidth, style.highlightColor, style.alpha);
    button.beginPath();
    button.moveTo(bottom.x, bottom.y);
    button.lineTo(top.x, top.y);
    button.strokePath();

    button.generateTexture(textureKey, style.size, style.size);
    button.destroy();

    return this.makeSprite(textureKey);
  }

  makeCopyOf(source)
  {
    return this.makeSprite(source.texture.key, source.frame.name);
  }

  makeSprite(textureKey, frame)
  {
    const style = this.style;
    const button = this.parent.scene.add.sprite(0, 0, textureKey, frame)
            .setOrigin(0,0);
    return button;
  }
}
