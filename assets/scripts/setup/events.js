import { showToast, updateBackground, fadeToBlack } from './ui.js';
import { menuMusic, levelMusic } from './audio.js';
import { startGame } from '../game/loop.js';
import { connectBtn, startBtn } from './constants.js';

let walletConnected = false;

function setupEvents() {
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
      updateBackground("playing");
      menuMusic.pause();
      menuMusic.currentTime = 0;
      levelMusic.play().catch(console.error);
      document.getElementById("menu").style.display = "none";
      document.getElementById("gameCanvas").style.display = "block";
      startGame();
    });
  });
}

export { setupEvents };
