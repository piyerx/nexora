import Player from './player.js';
import Enemy from './enemy.js';
import Coin from './coin.js'; // NEW

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1200;
canvas.height = 600;

const groundLevel = canvas.height - 50;

const keys = {};
window.addEventListener('keydown', (e) => (keys[e.code] = true));
window.addEventListener('keyup', (e) => (keys[e.code] = false));

const game = {
  canvas,
  ctx,
  groundLevel
};

const player = new Player(game);

// Create enemies spaced across the level
const enemies = [
  new Enemy(game, 400, groundLevel - 60),
  new Enemy(game, 700, groundLevel - 60),
  new Enemy(game, 1000, groundLevel - 60)
];

// Create coins (spread throughout the level)
const coins = [
  new Coin(150, groundLevel - 70),
  new Coin(300, groundLevel - 120),
  new Coin(550, groundLevel - 70),
  new Coin(800, groundLevel - 100),
  new Coin(950, groundLevel - 70),
  new Coin(1100, groundLevel - 120)
];

let coinCount = 0;

// Define end zone
const endZone = {
  x: 1150,
  y: groundLevel - 60,
  width: 40,
  height: 60
};

let gameWon = false;

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ground
  ctx.fillStyle = '#222';
  ctx.fillRect(0, groundLevel, canvas.width, 50);

  // Update and draw player
  player.update(keys, enemies);
  player.draw(ctx);

  // Update and draw enemies
  enemies.forEach((enemy) => {
    if (enemy.hp > 0) {
      enemy.update(player);
      enemy.draw(ctx);
    }
  });

  // Draw and update coins
  coins.forEach((coin) => {
    if (!coin.collected) {
      if (coin.update(player)) {
        coinCount++;
      }
      coin.draw(ctx);
    }
  });

  // Draw coin count
  ctx.fillStyle = 'yellow';
  ctx.font = '18px Arial';
  ctx.fillText(`Coins: ${coinCount}`, 10, 30);

  // Draw end zone
  ctx.fillStyle = 'green';
  ctx.fillRect(endZone.x, endZone.y, endZone.width, endZone.height);

  // Check level complete
  const playerRight = player.x + player.width;
  const playerBottom = player.y + player.height;
  if (
    playerRight > endZone.x &&
    player.x < endZone.x + endZone.width &&
    playerBottom > endZone.y
  ) {
    gameWon = true;
  }

  // Game won message
  if (gameWon) {
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('Level Complete!', canvas.width / 2 - 100, 100);
    return;
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
