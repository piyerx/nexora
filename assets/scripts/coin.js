class Coin {
    constructor(x, y, radius = 15) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.collected = false;
    }

    draw(ctx) {
        if (this.collected) return;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'gold';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();
    }

    update(player) {
        if (this.collected) return;

        const dx = player.x + player.width / 2 - this.x;
        const dy = player.y + player.height / 2 - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + player.width * 0.4) {
            this.collected = true;
            return true; // Coin was collected
        }

        return false; // Not collected yet
    }
}

export default Coin;
