import { ctx, canvas } from '../setup/canvas.js';
import { player, enemies, coins, endZone } from './init.js';
import { keys, groundLevel } from '../setup/constants.js';


function startGame() {
  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#222';
    ctx.fillRect(0, groundLevel, canvas.width, 50);

    player.update(keys, enemies);
    player.draw(ctx);

    enemies.forEach(enemy => {
      if (enemy.hp > 0) {
        enemy.update(player);
        enemy.draw(ctx);
      }
    });

    coins.forEach(coin => {
      if (!coin.collected) {
        coin.update(player);
        coin.draw(ctx);
      }
    });

    ctx.fillStyle = 'yellow';
    ctx.font = '18px Arial';
    ctx.fillText(`Coins: ${coins.filter(c => c.collected).length}`, 10, 30);

    ctx.fillStyle = 'green';
    ctx.fillRect(endZone.x, endZone.y, endZone.width, endZone.height);

    const playerRight = player.x + player.width;
    const playerBottom = player.y + player.height;
    if (
      playerRight > endZone.x &&
      player.x < endZone.x + endZone.width &&
      playerBottom > endZone.y
    ) {
      ctx.fillStyle = 'white';
      ctx.font = '30px Arial';
      ctx.fillText('Level Complete!', canvas.width / 2 - 100, 100);
      return;
    }

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
}

export { startGame };
