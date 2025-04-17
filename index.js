document.body.style.margin = '0'
document.body.style.overflow = 'hidden'
document.documentElement.style.overflow = 'hidden'
document.body.style.height = '100vh'
document.body.style.width = '100vw'

// ============MUSIC===========
const levelMusic = new Audio('./music/Nex_level_theme.mp3')
const menuMusic = new Audio('./music/Nex_main_menu.mp3')
const buttonClickSound = new Audio('./music/nex-button-click.mp3')
const coinSound = new Audio('./music/nex-coin.mp3')
const levelOver = new Audio('./music/nex-level-complete.mp3')

levelMusic.loop = true
menuMusic.loop = true
levelMusic.volume = 0.5
menuMusic.volume = 0.4
buttonClickSound.volume = 0.4
coinSound.volume = 0.2

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
window.addEventListener('keydown', handleKeyStart)
// ============MUSIC===========

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
let coinCount = 0
let gameTimer = 0
let startTime = null
let gameStarted = false

// ===== MENU OVERLAY CREATION =====
const menuOverlay = document.createElement('div')
menuOverlay.id = 'menu-overlay'
menuOverlay.innerHTML = `
  <div id="menu-title">NEXORA</div>
  <div id="menu-subtitle">Built on MONAD</div>
  <button id="start-game-btn" class="menu-btn">Start Game</button>
  <div id="how-to-play" style="font-family: 'Quantico', sans-serif; color: white; font-size: 24px; cursor: pointer;">How To Play?</div>
  <button id="connect-wallet-btn" class="menu-btn">Connect Wallet</button>
  <div class="credits-container">
    <p class="credits">Built with ❤️ for HackHazards 2025</p>
    <p class="subCredits">Bandana | Neha | Piyush | Priyanshu</p>
  </div>
`
document.body.appendChild(menuOverlay)

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

connectWalletBtn.addEventListener('click', () => {
  buttonClickSound.play()
  // Placeholder for wallet connection logic
  alert('Wallet connection coming soon!')
})
// ===== END MENU OVERLAY CREATION =====

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
  background.update()
  
  
  player.checkForHorizontalCanvasCollision()
  player.update()

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
        console.log('Coins collected:', coinCount)
      }
    }
  })

  // Show end screen if all coins collected
  if (coinCount === 20 && !endScreenShown) {
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
  c,textAlign = 'right'
  c.fillText(`Coins: ${coinCount}/20`, canvas.width - 250, 50)
  c.font = '20px Quantico'
  c.textAlign = 'center'
  c.fillText(`Use W | A | D for movement`, canvas.width / 2, canvas.height - 50)
  // c.textAlign = 'left'
  // c.fillText(`X: ${Math.round(player.position.x / 4)}, Y: ${Math.round(player.position.y / 4)}`, 30, 90)

  c.restore()


}

animate()

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

//HOW TO PLAY Section
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
howToPlayImage.src = './img/background.png'
howToPlayImage.style.cssText = `
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
  transform: scale(1.5);
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


let endScreenShown = false
let completionTime = null

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
}
