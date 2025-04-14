import Player from './player.js';
import Enemy from './enemy.js';
import Coin from './coin.js';

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

// === Globals ===
let coinCount = 0;
let walletConnected = false;
let gameWon = false;
let gameState = "menu"; // 'menu' or 'playing'

const startBtn = document.getElementById("startGame");
const connectBtn = document.getElementById("connectWallet");

// === Game Elements ===
const enemies = [
  new Enemy(game, 400, groundLevel - 60),
  new Enemy(game, 700, groundLevel - 60),
  new Enemy(game, 1000, groundLevel - 60)
];

const coins = [
  new Coin(150, groundLevel - 70),
  new Coin(300, groundLevel - 120),
  new Coin(550, groundLevel - 70),
  new Coin(800, groundLevel - 100),
  new Coin(950, groundLevel - 70),
  new Coin(1100, groundLevel - 120)
];

const endZone = { 
  x: 1150,
  y: groundLevel - 60,
  width: 40,
  height: 60
};



// ===================== Menu Music ==============================

const menuMusic = new Audio('./assets/sfx/Nex_main_menu.mp3');
menuMusic.loop = true;  // Enable looping
menuMusic.volume = 0.6; // Optional: Set volume
// ===================== Level Music ==============================

const levelMusic = new Audio('./assets/sfx/Nex_level_theme.mp3');
levelMusic.loop = true;
levelMusic.volume = 0.6; 


// Function to play music upon user interaction
function playMenuMusic() {
  menuMusic.play().catch(error => {
    console.error("Error playing audio:", error);
  });
  // Remove the event listener after the music has been played once.
  document.removeEventListener('click', playMenuMusic);
  document.removeEventListener('keydown', playMenuMusic);
}

// Add event listeners for user interaction
document.addEventListener('click', playMenuMusic);
document.addEventListener('keydown', playMenuMusic);


// ===================== Music ==============================



// === Utility Functions ===
function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}


function updateBackground() {
  if (gameState === "menu") {
    document.body.style.backgroundImage = "url('./assets/images/misc/nex-menu-bg.gif')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center center";
  } else if (gameState === "playing") {
    document.body.style.backgroundImage = "none";
    document.body.style.background = "#4a90e2";
  }
}


function fadeToBlack(callback) {
  const overlay = document.getElementById('fade-overlay');
  overlay.style.opacity = 1;
  setTimeout(() => {
    callback();
    overlay.style.opacity = 0;
  }, 800);
}

// === Main Game Loop ===
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#222';
  ctx.fillRect(0, groundLevel, canvas.width, 50);

  player.update(keys, enemies);
  player.draw(ctx);

  enemies.forEach((enemy) => {
    if (enemy.hp > 0) {
      enemy.update(player);
      enemy.draw(ctx);
    }
  });

  coins.forEach((coin) => {
    if (!coin.collected) {
      if (coin.update(player)) {
        coinCount++;
      }
      coin.draw(ctx);
    }
  });

  ctx.fillStyle = 'yellow';
  ctx.font = '18px Arial';
  ctx.fillText(`Coins: ${coinCount}`, 10, 30);

  ctx.fillStyle = 'green';
  ctx.fillRect(endZone.x, endZone.y, endZone.width, endZone.height);

  const playerRight = player.x + player.width;
  const playerBottom = player.y + player.height;
  if (
    playerRight > endZone.x &&
    player.x < endZone.x + endZone.width &&
    playerBottom > endZone.y
  ) {
    gameWon = true;
  }

  if (gameWon) {
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('Level Complete!', canvas.width / 2 - 100, 100);
    return;
  }

  requestAnimationFrame(gameLoop);
}

// === Button Logic ===
connectBtn.addEventListener("click", () => {
  if (!walletConnected) {
    walletConnected = true;
    startBtn.disabled = false;
    startBtn.style.opacity = 1;
    startBtn.style.cursor = "pointer";
    showToast("🦊 Wallet connected!");
  }
});

startBtn.addEventListener("click", () => {
  if (!walletConnected) {
    showToast("Please connect your wallet first.");
    return;
  }

  fadeToBlack(() => {
    gameState = "playing";
    updateBackground();
    menuMusic.pause();
    menuMusic.currentTime = 0;
    levelMusic.play().catch(err => {
      console.error("Level music failed to play:", err);
      });
    document.getElementById("menu").style.display = "none";
    document.getElementById("gameCanvas").style.display = "block";
    requestAnimationFrame(gameLoop);
  });
});

// === Initial Setup ===
updateBackground(); // Set menu background on first load
