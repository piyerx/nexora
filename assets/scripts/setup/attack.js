import { player, enemies } from '../game/init.js';

function setupAttack() {
  document.addEventListener('click', () => {
    enemies.forEach((enemy) => {
      const inXRange = enemy.x >= player.x && enemy.x <= player.x + player.attackRange;
      const inYRange = enemy.y + enemy.height >= player.y && enemy.y <= player.y + player.height;
      if (inXRange && inYRange) {
        enemy.hp -= player.attackDamage;
        console.log('Enemy hit! HP left:', enemy.hp);
      }
    });
  });
}

export { setupAttack };
