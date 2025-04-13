class Enemy {
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 60;
    this.color = 'red';

    this.direction = 1; // 1 = right, -1 = left
    this.speed = 1.5; // Movement speed

    this.hp = 30;
    this.playerHitZoneActive = false;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(player) {
    // Patrol movement
    this.x += this.speed * this.direction;

    // Reverse direction when hitting edge of map (hardcoded for demo)
    if (this.x <= 0 || this.x + this.width >= this.game.canvas.width) {
      this.direction *= -1;
    }

    // Check if enemy is in player's hit zone
    const inXRange =
      this.x + this.width > player.x && this.x < player.x + player.width;
    const inYRange =
      this.y + this.height > player.y && this.y < player.y + player.height;

    const currentlyInside = inXRange && inYRange;

    if (currentlyInside && !this.playerHitZoneActive) {
      // Enemy just entered the player's hit zone
      player.hp -= 10;
      console.log("Player hit! HP left:", player.hp);
      this.playerHitZoneActive = true;
    } else if (!currentlyInside && this.playerHitZoneActive) {
      // Enemy left the hit zone
      this.playerHitZoneActive = false;
    }
  }
}

export default Enemy;
