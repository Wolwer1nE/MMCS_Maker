/**
 * A class that wraps up our 2D platforming player logic. It creates, animates and moves a sprite in
 * response to WASD/arrow keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
 */
export default class Player 
{
  constructor(scene, x, y) 
  {
    this.scene = scene;

    // Create the animations we need from the player spritesheet
    const anims = scene.anims;
    anims.create({
      key: "player-idle",
      frames: anims.generateFrameNumbers("player", { start: 0, end: 2 }),
      frameRate: 3,
      repeat: -1
    });
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

    // Track the arrow keys & WASD
    const { LEFT, RIGHT, UP, W, A, D } = Phaser.Input.Keyboard.KeyCodes;
    const key = scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      w: W,
      a: A,
      d: D
    });
    
    this.keys = {
      left: [key.left, key.a],
      right: [key.right, key.d],
      up: [key.up, key.w]
    };
  }

  freeze() {
    this.sprite.body.moves = false;
  }

  update(keys) {
    const sprite = this.sprite;
    const onGround = sprite.body.blocked.down;
    const acceleration = onGround ? 600 : 200;
   
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

    // Update the animation/texture based on the state of the player
    if (onGround) {
      if (sprite.body.velocity.x !== 0) sprite.anims.play("player-run", true);
      else sprite.anims.play("player-idle", true);
    } else {
      sprite.anims.stop();
      sprite.setTexture("player", 10);
    }
  }

  destroy() {
    this.sprite.destroy();
  }
}
