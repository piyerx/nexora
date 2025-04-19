import { contractAddress, contractABI } from './contract/config.js';
import { queueAchievement, getQueuedAchievements, clearQueue } from './js/achievementQueue.js'

document.body.style.margin = '0'
document.body.style.overflow = 'hidden'
document.documentElement.style.overflow = 'hidden'
document.body.style.height = '100vh'
document.body.style.width = '100vw'

let endScreenShown = false;
let completionTime = null
let userWallet = null;
let contract = null;
let verifiedAchievements = {};

// =======================
// 🎵 MUSIC SECTION
// =======================
const levelMusic = new Audio('./music/Nex_level_theme.mp3')
const menuMusic = new Audio('./music/Nex_main_menu.mp3')
const buttonClickSound = new Audio('./music/nex-button-click.mp3')
const coinSound = new Audio('./music/nex-coin.mp3')
const levelOver = new Audio('./music/nex-level-complete.mp3')
const achMusic = new Audio('./music/nex-achievement.mp3')

levelMusic.loop = true
menuMusic.loop = true
levelMusic.volume = 0.5
menuMusic.volume = 0.4
buttonClickSound.volume = 0.4
coinSound.volume = 0.2
achMusic.volume = 0.4

menuMusic.play()

const startMusic = () => {
  levelMusic.play()
  window.removeEventListener('click', startMusic)
  window.removeEventListener('keydown', handleKeyStart)
}

const handleKeyStart = (event) => {
  if (['w', 'a', 'd'].includes(event.key.toLowerCase())) {
    startMusic()
  }
}
window.addEventListener('click', startMusic)
// =======================
// ⌨️ INPUT HANDLERS
// =======================
window.addEventListener('keydown', handleKeyStart)

// =======================
// 🧱 CANVAS SETUP
// =======================

const canvas = document.querySelector('canvas')
canvas.style.display = 'block'
canvas.style.width = '100vw'
canvas.style.height = '100vh'

const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const scaledCanvas = {
  width: canvas.width / 4,
  height: canvas.height / 4,
}

const floorCollisions2D = []
for (let i = 0; i < floorCollisions.length; i += 36) {
  floorCollisions2D.push(floorCollisions.slice(i, i + 36))
}

const collisionBlocks = []
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
        })
      )
    }
  })
})

const platformCollisions2D = []
for (let i = 0; i < platformCollisions.length; i += 36) {
  platformCollisions2D.push(platformCollisions.slice(i, i + 36))
}

const platformCollisionBlocks = []
platformCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      platformCollisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
          height: 4,
        })
      )
    }
  })
})

const gravity = 0.1

// ================================
// 🧍 CHARACTER & BACKGROUND SETUP
// ================================
const player = new Player({
  position: {
    x: 100,
    y: 300,
  },
  collisionBlocks,
  platformCollisionBlocks,
  imageSrc: './img/warrior/Idle.png',
  frameRate: 8,
  animations: {
    Idle: {
      imageSrc: './img/warrior/Idle.png',
      frameRate: 8,
      frameBuffer: 3,
    },
    Run: {
      imageSrc: './img/warrior/Run.png',
      frameRate: 8,
      frameBuffer: 5,
    },
    Jump: {
      imageSrc: './img/warrior/Jump.png',
      frameRate: 2,
      frameBuffer: 3,
    },
    Fall: {
      imageSrc: './img/warrior/Fall.png',
      frameRate: 2,
      frameBuffer: 3,
    },
    FallLeft: {
      imageSrc: './img/warrior/FallLeft.png',
      frameRate: 2,
      frameBuffer: 3,
    },
    RunLeft: {
      imageSrc: './img/warrior/RunLeft.png',
      frameRate: 8,
      frameBuffer: 5,
    },
    IdleLeft: {
      imageSrc: './img/warrior/IdleLeft.png',
      frameRate: 8,
      frameBuffer: 3,
    },
    JumpLeft: {
      imageSrc: './img/warrior/JumpLeft.png',
      frameRate: 2,
      frameBuffer: 3,
    },
  },
})

const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
}

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/background.png',
})

const backgroundImageHeight = 432

const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
}

const coins = []
platformCollisions2D.forEach((row, y) => {
  let platformStart = -1
  let platformLength = 0
  
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      if (platformStart === -1) platformStart = x
      platformLength++
    } else if (platformStart !== -1) {
      const middleX = platformStart + Math.floor(platformLength / 2)
      coins.push(new Coin(middleX * 16 + 5, y * 16 - 15))
      platformStart = -1
      platformLength = 0
    }
  })
  
  if (platformStart !== -1) {
    const middleX = platformStart + Math.floor(platformLength / 2)
    coins.push(new Coin(middleX * 16, y * 16 - 20))
  }
})
coins.push(new Coin(550, 350))

// ==================
// 🎮 GAME STATE
// ==================
let coinCount = 0
let gameTimer = 0
let startTime = null
let gameStarted = false

// ===========================
// 🎮 MENU UI OVERLAY + LOGIC
// ===========================
const menuOverlay = document.createElement('div')
menuOverlay.id = 'menu-overlay'
menuOverlay.innerHTML = `
  <div id="menu-title">NEXORA</div>
  <div id="menu-subtitle">Built on MONAD</div>
  <button id="achievements-btn" class="menu-btn" style="display:none;position:absolute;top:32px;right:48px;width:auto;padding:10px 32px;font-size:20px;z-index:1100;">My Achievements</button>
  <button id="start-game-btn" class="menu-btn">Start Game</button>
  <button id="connect-wallet-btn" class="menu-btn">Connect Wallet</button>
  <div class="credits-container">
    <p class="credits">Built with ❤️ for HackHazards 2025</p>
    <p class="subCredits">Bandana | Neha | Piyush | Priyanshu</p>
  </div>
`;
document.body.appendChild(menuOverlay);

// Achievement Overlay Logic
let achievementsOverlay = null;
function createAchievementsOverlay() {
  if (achievementsOverlay) return achievementsOverlay;
  achievementsOverlay = document.createElement('div');
  achievementsOverlay.id = 'achievements-overlay';
  achievementsOverlay.style.display = 'none';
  achievementsOverlay.style.position = 'fixed';
  achievementsOverlay.style.top = '0';
  achievementsOverlay.style.left = '0';
  achievementsOverlay.style.width = '100vw';
  achievementsOverlay.style.height = '100vh';
  achievementsOverlay.style.background = 'rgba(0,0,0,0.7)';
  achievementsOverlay.style.backdropFilter = 'blur(14px)';
  achievementsOverlay.style.zIndex = '2000';
  achievementsOverlay.style.display = 'flex';
  achievementsOverlay.style.alignItems = 'center';
  achievementsOverlay.style.justifyContent = 'center';
  achievementsOverlay.innerHTML = `
    <div id="achievements-modal" style="background:rgba(0,0,0,0.85);border-radius:24px;padding:36px 48px;box-shadow:0 4px 32px #00ffe7;max-width:600px;width:90vw;max-height:80vh;overflow-y:auto;display:flex;flex-direction:column;align-items:center;">
      <div class="achievement-section-title" style="margin-bottom:18px;">Your Achievements</div>
      <div id="achievements-list-modal" style="display:flex;flex-wrap:wrap;gap:24px 32px;justify-content:center;"></div>
    </div>
  `;
  document.body.appendChild(achievementsOverlay);
  achievementsOverlay.addEventListener('click', (e) => {
    if (e.target === achievementsOverlay) {
      achievementsOverlay.style.display = 'none';
    }
  });
  return achievementsOverlay;
}
function openAchievementsOverlay() {
  createAchievementsOverlay();
  // Populate achievements
  const list = achievementsOverlay.querySelector('#achievements-list-modal');
  list.innerHTML = '';
  Object.entries(achievements).forEach(([id, data]) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'achievement-item';
    const img = document.createElement('img');
    img.src = data.image;
    img.alt = id;
    if (!(verifiedAchievements[id] > 0)) {
      img.style.filter = 'grayscale(1) opacity(0.5)';
      img.style.opacity = '0.5';
    }
    wrapper.appendChild(img);
    if (verifiedAchievements[id] > 0) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = verifiedAchievements[id];
      wrapper.appendChild(badge);
    }
    const label = document.createElement('div');
    label.className = 'ach-label';
    label.textContent = id;
    wrapper.appendChild(label);
    list.appendChild(wrapper);
  });
  achievementsOverlay.style.display = 'flex';
}

const achievementsOverlayBtn = document.getElementById('achievements-btn');
if (achievementsOverlayBtn) {
  achievementsOverlayBtn.addEventListener('click', (e) => {
    buttonClickSound.play();
    openAchievementsOverlay();
  });
}

document.getElementById('achievements-btn').addEventListener('click', (e) => {
  buttonClickSound.play();
  openAchievementsOverlay();
});
// Remove the global achievementsOverlay.addEventListener('click', ...) since it's now inside the creation function
const startGameBtn = document.getElementById('start-game-btn')
const connectWalletBtn = document.getElementById('connect-wallet-btn')

startGameBtn.addEventListener('click', () => {
  buttonClickSound.play()
  menuOverlay.style.display = 'none'
  gameStarted = true
  startTime = Date.now()
  menuMusic.pause() 
  menuMusic.currentTime = 0
  levelMusic.play()  
})

window.removeEventListener('click', startMusic)
window.removeEventListener('keydown', handleKeyStart)

// Replace the placeholder wallet connection logic
connectWalletBtn.addEventListener('click', async () => {
  buttonClickSound.play();
  try {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask or another Ethereum wallet extension and refresh the page.');
      return;
    }

    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    userWallet = accounts[0];
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    connectWalletBtn.textContent = 'Connected!';
    connectWalletBtn.style.background = 'linear-gradient(90deg, #00ff95 0%, #00ffe7 100%)';
    document.getElementById('achievements-btn').style.display = 'block';
    await verifyAchievements();
  } catch (error) {
    console.error('Error connecting wallet:', error);
    let message = 'Failed to connect wallet. Please try again.';
    if (error && error.message && error.message.includes('Internal JSON-RPC error')) {
      message = 'Wallet connection failed due to a network or contract configuration issue. Please ensure you are connected to the correct network and the contract is deployed.';
    }
    alert(message);
  }
});

async function verifyAchievements() {
  if (!contract || !userWallet) return;
  try {
    const achArr = await contract.getPlayerAchievements(userWallet);
    // Count occurrences of each achievement
    verifiedAchievements = {};
    achArr.forEach(id => {
      if (!verifiedAchievements[id]) verifiedAchievements[id] = 0;
      verifiedAchievements[id]++;
    });
    updateAchievementsUI();
  } catch (e) {
    console.error('Error fetching achievements from Monad:', e);
  }
}

function updateAchievementsUI() {
  const section = document.getElementById('achievements-section');
  const list = document.getElementById('achievements-list');
  if (!section || !list) return;
  if (!userWallet || Object.keys(verifiedAchievements).length === 0) {
    section.style.display = 'none';
    return;
  }
  section.style.display = 'block';
  list.innerHTML = '';
  Object.entries(achievements).forEach(([id, data]) => {
    const count = verifiedAchievements[id] || 0;
    const wrapper = document.createElement('div');
    wrapper.className = 'achievement-item';
    wrapper.innerHTML = `<img src="${data.image}" style="filter:${count>0?'none':'grayscale(1)'};opacity:${count>0?1:0.4};"><span class="badge"${count>0?'':' hidden'}>x${count}</span><span class="ach-label">${data.label||id}</span>`;
    list.appendChild(wrapper);
  });
}

// Add achievements section to menu overlay if not present
function ensureAchievementsSection() {
  let section = document.getElementById('achievements-section');
  if (!section) {
    section = document.createElement('div');
    section.id = 'achievements-section';
    section.className = 'achievement-section';
    section.innerHTML = `<div class="achievement-section-title">Achievements</div><div id="achievements-list"></div>`;
    const menuOverlay = document.getElementById('menu-overlay');
    if (menuOverlay) {
      menuOverlay.insertBefore(section, menuOverlay.children[2] || null);
    }
  }
}

// After wallet connection and achievements are fetched:
async function fetchAndDisplayAchievements() {
  // Fetch verifiedAchievements from Monad contract (pseudo-code, replace with actual logic)
  // verifiedAchievements = await fetchVerifiedAchievements(userWallet);
  ensureAchievementsSection();
  updateAchievementsUI();
}
// Example: Call fetchAndDisplayAchievements after wallet is connected and achievements are loaded
// fetchAndDisplayAchievements();
// =======================
// 🎖️ GAME ACHIEVEMENTS
// =======================
const achievements = {
  coinCollector: { earned: false, image: './img/achievements/ach_coin_collector.png' },
  speedDemon: { earned: false, image: './img/achievements/ach_speed_demon.png' },
  chillPacer: { earned: false, image: './img/achievements/ach_chill_pacer.png' },
  nexoFlash: { earned: false, image: './img/achievements/ach_nexo_flash.png' },
  levelComplete: { earned: false, image: './img/achievements/ach_stage_complete.png' }
};

// Achievement pop-up queue logic
const achievementPopupQueue = [];
let achievementPopupActive = false;

function showAchievement(achievementId) {
  if (achievements[achievementId].earned) return;
  achievements[achievementId].earned = true;
  queueAchievement(achievementId); // Queue for blockchain processing
  achievementPopupQueue.push(achievementId);
  processAchievementPopupQueue();
}

function processAchievementPopupQueue() {
  if (achievementPopupActive || achievementPopupQueue.length === 0) return;
  achievementPopupActive = true;
  const achievementId = achievementPopupQueue.shift();
  achMusic.currentTime = 0;
  achMusic.play();
  const notification = document.createElement('div');
  notification.className = 'achievement-notification';
  notification.innerHTML = `<img src="${achievements[achievementId].image}">`;
  document.body.appendChild(notification);
  setTimeout(() => notification.style.bottom = '20px', 100);
  setTimeout(() => {
    notification.style.bottom = '-80px';
    setTimeout(() => {
      notification.remove();
      achievementPopupActive = false;
      processAchievementPopupQueue();
    }, 500);
  }, 4000);
}

function resetAchievements() {
  Object.keys(achievements).forEach(key => {
    achievements[key].earned = false;
  });
}


// =======================
// 🔁 ANIMATE LOOP
// =======================
function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'white'
  c.fillRect(0, 0, canvas.width, canvas.height)

  if (!gameStarted) {
    return
  }

  c.save()
  c.scale(4, 4)
  c.translate(camera.position.x, camera.position.y)
  background.update(c)
  
  
  player.checkForHorizontalCanvasCollision()
  player.update(c)

  player.velocity.x = 0
  if (keys.d.pressed) {
    player.switchSprite('Run')
    player.velocity.x = 1
    player.lastDirection = 'right'
    player.shouldPanCameraToTheLeft({ canvas, camera })
  } else if (keys.a.pressed) {
    player.switchSprite('RunLeft')
    player.velocity.x = -1
    player.lastDirection = 'left'
    player.shouldPanCameraToTheRight({ canvas, camera })
  } else if (player.velocity.y === 0) {
    if (player.lastDirection === 'right') player.switchSprite('Idle')
    else player.switchSprite('IdleLeft')
  }

  if (player.velocity.y < 0) {
    player.shouldPanCameraDown({ camera, canvas })
    if (player.lastDirection === 'right') player.switchSprite('Jump')
    else player.switchSprite('JumpLeft')
  } else if (player.velocity.y > 0) {
    player.shouldPanCameraUp({ camera, canvas })
    if (player.lastDirection === 'right') player.switchSprite('Fall')
    else player.switchSprite('FallLeft')
  }

  // In your animate function, after the coin collection logic:
  coins.forEach(coin => {
    if (!coin.collected) {
      coin.draw(c)
      if (player.hitbox.position.x < coin.position.x + coin.width &&
          player.hitbox.position.x + player.hitbox.width > coin.position.x &&
          player.hitbox.position.y < coin.position.y + coin.height &&
          player.hitbox.position.y + player.hitbox.height > coin.position.y) {
        coin.collected = true
        coinCount++
        coinSound.play()
        
        // Achievement: Every 5 coins
        if (coinCount % 5 === 0) {
          showAchievement('coinCollector');
        }
        
        // Check time-based achievements
        const timeInSeconds = Math.floor((Date.now() - startTime) / 1000);
        
        // Achievement: Chill Pacer (10 or fewer coins in 60 seconds)
        if (timeInSeconds >= 60 && coinCount <= 10) {
          showAchievement('chillPacer');
        }
        
        // Achievement: Speed Demon (All 20 coins under 30 seconds)
        if (coinCount === 20 && timeInSeconds <= 30) {
          showAchievement('speedDemon');
        }
        
        // Achievement: Nexo Flash (All 20 coins under 15 seconds)
        if (coinCount === 20 && timeInSeconds <= 15) {
          showAchievement('nexoFlash');
        }
      }
    }
  })

  // Level Complete achievement (already in your end screen logic)
  if (coinCount === 20 && !endScreenShown) {
    showAchievement('levelComplete');
    endScreenShown = true;
    gameStarted = false;
    levelMusic.pause();
    completionTime = (() => {
      const timeInSeconds = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    })();
    setTimeout(showEndScreen, 400);
    levelOver.play();
  }
  c.restore()
  
  // HUD
  c.save()
  c.fillStyle = 'white'
  c.font = '40px Quantico'
  // Timer on left
  const timeInSeconds = Math.floor((Date.now() - startTime) / 1000)
  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = timeInSeconds % 60
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`
  c.fillText(`Time: ${formattedTime}`, 30, 50)
  
  // Coin counter on right
  c.textAlign = 'right'
  c.fillText(`Coins: ${coinCount}/20`, canvas.width - 40, 50)
  c.font = '20px Quantico'
  c.textAlign = 'center'
  c.fillText(`Use W | A | D for movement`, canvas.width / 2, canvas.height - 50)
  // c.textAlign = 'left'
  // c.fillText(`X: ${Math.round(player.position.x / 4)}, Y: ${Math.round(player.position.y / 4)}`, 30, 90)

  c.restore()


}

animate()

// =======================
// ⌨️ INPUT HANDLERS
// =======================
window.addEventListener('keydown', (event) => {
  if (!gameStarted) return 

  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      break
    case 'a':
      keys.a.pressed = true
      break
    case 'w':
      if (player.isGrounded) {
        player.velocity.y = -3.5
      }
      break
  }
})

startGameBtn.addEventListener('click', () => {
  menuOverlay.style.display = 'none'
  gameStarted = true
  startTime = Date.now()
  levelMusic.play()
})

window.removeEventListener('click', startMusic)
window.removeEventListener('keydown', handleKeyStart)

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }
})

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  scaledCanvas.width = canvas.width / 4
  scaledCanvas.height = canvas.height / 4
})

// =======================
// 🎮 HOW TO PLAY POPUP
// =======================
const howToPlayOverlay = document.createElement('div')
howToPlayOverlay.style.cssText = `
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`
const howToPlayImage = document.createElement('img')
howToPlayImage.src = './img/How_to_play_Nexora.png'
howToPlayImage.style.cssText = `
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
  transform: scale(1.2);
`
howToPlayOverlay.appendChild(howToPlayImage)
document.body.appendChild(howToPlayOverlay)

document.getElementById('how-to-play').addEventListener('click', (e) => {
  e.stopPropagation()
  buttonClickSound.play()
  howToPlayOverlay.style.display = 'flex'
})

howToPlayOverlay.addEventListener('click', () => {
  buttonClickSound.play()
  howToPlayOverlay.style.display = 'none'
})

// =======================
// 🏁 END SCREEN LOGIC
// =======================
function showEndScreen() {
  if (document.getElementById('end-screen-overlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'end-screen-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgb(0, 0, 0);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    opacity: 0;
    transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1);
  `;
  overlay.innerHTML = `
    <div style=\"font-family: 'Quantico', sans-serif; color:rgb(255, 255, 255); font-size: 80px; font-weight: bold; margin-bottom: 16px; opacity:0; transition:opacity 0.5s 0.3s;\">Stage Complete</div>
    <div style=\"font-family: 'Quantico', sans-serif; color: #fff; font-size: 32px; margin-bottom: 36px; opacity:0; transition:opacity 0.5s 0.5s;\">Can you do this faster than <span id='completion-time'>${completionTime}</span>?</div>
    <div id=\"retry-btn\" style=\"font-family: 'Quantico', sans-serif; color: #00ffe7; font-size: 36px; cursor: pointer; margin-top: 24px; opacity:0; transition:opacity 0.5s 0.7s;\">Retry</div>
  `;
  document.body.appendChild(overlay);
  setTimeout(() => {
    overlay.style.opacity = '1';
    const children = overlay.children;
    for (let i = 0; i < children.length; i++) {
      setTimeout(() => { children[i].style.opacity = '1'; }, 200 + i * 120);
    }
  }, 30);
  document.getElementById('retry-btn').onclick = () => {
    overlay.remove();
    resetGame();
  };
  // Process queued achievements at end screen
  processQueuedAchievements();
}

function resetGame() {
  // Reset all coins
  coins.forEach(coin => coin.collected = false);
  coinCount = 0;
  // Reset player position
  player.position.x = 100;
  player.position.y = 300;
  player.velocity.x = 0;
  player.velocity.y = 0;
  player.lastDirection = 'right';
  // Reset camera
  camera.position.x = 0;
  camera.position.y = -backgroundImageHeight + scaledCanvas.height;
  // Reset timer
  startTime = Date.now();
  gameStarted = true;
  endScreenShown = false;
  completionTime = null;
  levelMusic.currentTime = 0;
  levelMusic.play();
  resetAchievements();
}

async function processQueuedAchievements() {
  if (!contract || !userWallet) return;
  const queued = getQueuedAchievements();
  for (const achievementId of queued) {
    try {
      let tx;
      const timeInSeconds = Math.floor((Date.now() - startTime) / 1000);
      switch(achievementId) {
        case 'coinCollector':
          tx = await contract.requestSmallReward(5);
          break;
        case 'speedDemon':
          tx = await contract.requestTimeBasedSmallReward(timeInSeconds, 0);
          break;
        case 'chillPacer':
          tx = await contract.requestTimeBasedSmallReward(0, timeInSeconds);
          break;
        case 'nexoFlash':
        case 'levelComplete':
          tx = await contract.requestBigReward(20, timeInSeconds);
          break;
      }
      if (tx) await tx.wait();
    } catch (error) {
      console.error('Error processing queued achievement:', achievementId, error);
    }
  }
  clearQueue();
}
