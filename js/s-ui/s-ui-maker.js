/**
*/

export default var SUIMaker = {}


  SUIMaker.defaultSprite = function (defaultSpriteName, style, width, height)
  {
    switch(defaultSpriteName) {
      case "ok":
      return makeOk(this.scene, style, width, height);
      case "cancel":
      return makeCancel(this.scene, style, width, height);
      case "play":
      return makePlay(this.scene, style, width, height);
      case "pause":
      return makePause(this.scene, style, width, height);
      case "replay":
      return makeReplay(this.scene, style, width, height);
      case "up":
      return makeUp(this.scene, style, width, height);
      case "down":
      return makeDown(this.scene, style, width, height);
      case "right":
      return makeRight(this.scene, style, width, height);
      case "left":
      return makeLeft(this.scene, style, width, height);
    }
  }

  SUIMaker.button = function (x, y, width, height, style)
  {

    var button = new SUIButton(this.scene, x, y, width, height);
    if (typeof sprite == "string")
    {
      sprite = defaultSprite(sprite, style, width, height);
    }
    button.children.add(sprite);
    if (container)
      container.add(button);
    return button;
  }
}
