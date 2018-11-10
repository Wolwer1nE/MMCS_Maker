/**
 * A class that wraps up our 2D platforming player logic. It creates, animates and moves a sprite in
 * response to WASD/arrow keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
 */

export default class Player extends Phaser.Events.EventEmitter
{
  static get Events()
  {
      return {
        "win":"win",
        "death":"death"
      }
  }

  constructor(scene, x, y)
  {
    super();

    this.scene = scene;

    // Create the animations we need from the player spritesheet
    let anims = scene.anims;
    if (!anims.get("player-idle"))
      anims.create({
        key: "player-idle",
        frames: anims.generateFrameNumbers("player", { start: 0, end: 2 }),
        frameRate: 3,
        repeat: -1
      });
    if (!anims.get("player-run"))
      anims.create({
        key: "player-run",
        frames: anims.generateFrameNumbers("player", { start: 8, end: 15 }),
        frameRate: 12,
        repeat: -1
      });

    // Create the physics-based sprite that we will move around and animate
    this.sprite = scene.physics.add
      .sprite(x, y, "player", 0)
      .setDrag(1000, 0)
      .setMaxVelocity(300, 400)
      .setSize(18, 24)
      .setOffset(7, 9);

    this.sprite.anims.play("player-idle", true);
  }

  freeze() {
    this.sprite.body.moves = false;
  }

  reset(position)
  {
    this.sprite.setPosition(position.x, position.y);
    this.sprite.setAccelerationX(0);
    this.sprite.setVelocityX(0);
    this.sprite.setAccelerationY(0);
    this.sprite.setVelocityY(0);
 
    this.sprite.anims.play("player-idle", true);
  }

  update(keys)
  {
    let sprite = this.sprite;
    let onGround = sprite.body.blocked.down;
    let acceleration = onGround ? 600 : 200;

    if (keys)
    {
      if (keys.left.isDown) {
        sprite.setAccelerationX(-acceleration);
        sprite.setFlipX(true);
      } else if (keys.right.isDown) {
        sprite.setAccelerationX(acceleration);
        sprite.setFlipX(false);
      } else {
        sprite.setAccelerationX(0);
      }

      // Only allow the player to jump if they are on the ground
      if (onGround && keys.up.isDown) {
        this.sprite.setVelocityY(-500);
      }
    }

    // Update the animation/texture based on the state of the player
    if (onGround) {
      if (sprite.body.velocity.x !== 0) sprite.anims.play("player-run", true);
      else sprite.anims.play("player-idle", true);
    } else {
      sprite.anims.stop();
      sprite.setTexture("player", 10);
    }
  }

  destroy()
  {
    this.removeAllListeners();
    this.sprite.destroy();
  }
}
