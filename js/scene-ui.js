/**
*/

export default class SceneUI
{

  constructor(scene, bounds)
  {
    this.scene = scene;
    this.bounds = bounds;

    // uiPlugin.add(this.panel = new SlickUI.Element.Panel(bounds.x,bounds.y, bounds.width, bounds.height));
    // this.panel.add(button = new SlickUI.Element.Button(0,bounds.height / 2, 140, 80))
    //   .events.onInputUp.add(function () {
    //     console.log('Clicked save game');
    //   });
    this.scene.load.image("spike", "./assets/images/0x72-industrial-spike.png");
  }

  destroy()
  {
    // this.panel.destroy();
  }
}
