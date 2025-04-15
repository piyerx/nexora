const groundLevel = 600 - 50;
let coinCount = 0;
let walletConnected = false;
let gameWon = false;
let gameState = "menu";

const keys = {};
window.addEventListener("keydown", (e) => (keys[e.code] = true));
window.addEventListener("keyup", (e) => (keys[e.code] = false));

const startBtn = document.getElementById("startGame");
const connectBtn = document.getElementById("connectWallet");

export {
  groundLevel,
  coinCount,
  walletConnected,
  gameWon,
  gameState,
  keys,
  startBtn,
  connectBtn
};
