class Player {
  constructor(game) {
    this.game = game;
    this.x = 50;
    this.y = 0;
    this.width = 30;
    this.height = 60;
    this.color = 'blue';

    this.velX = 0;
    this.velY = 0;
    this.speed = 3;
    this.jumpStrength = 12;
    this.gravity = 0.5;
    this.grounded = false;

    this.hp = 100;
    this.attackRange = 50;
    this.attackDamage = 10;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(keys) {
    if (keys["ArrowLeft"] || keys["KeyA"]) this.velX = -this.speed;
    else if (keys["ArrowRight"] || keys["KeyD"]) this.velX = this.speed;
    else this.velX = 0;

    if ((keys["Space"] || keys["ArrowUp"] || keys["KeyW"]) && this.grounded) {
      this.velY = -this.jumpStrength;
      this.grounded = false;
    }

    this.velY += this.gravity;
    this.x += this.velX;
    this.y += this.velY;

    if (this.y + this.height > this.game.groundLevel) {
      this.y = this.game.groundLevel - this.height;
      this.velY = 0;
      this.grounded = true;
    }
  }
}

export default Player;
