export const contractAddress = "0x970DE270d6f26710B0E3c5422b5bE441664838d0";
export const contractABI = [
  {
    // Make sure this function exists in your ABI
    "inputs": [{"type": "address", "name": "player"}],
    "name": "getPlayerAchievements",
    "outputs": [{"type": "string[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "string", "name": "achievementId"}],
    "name": "unlockAchievement",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];