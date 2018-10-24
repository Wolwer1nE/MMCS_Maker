/**
  Smallest UI
  */

export default class SUI extends Phaser.Events.EventEmitter
{
  constructor(scene)
  {
    super();
    this.scene = scene
    this.make = SUIMaker(this, style);
  }
}
