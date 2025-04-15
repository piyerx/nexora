import Player from '../player.js';
import Enemy from '../enemy.js';
import Coin from '../coin.js';
import { groundLevel } from '../setup/constants.js';

const game = {};
let player;
let enemies = [];
let coins = [];
let endZone;

function initGameObjects() {
  game.canvas = document.getElementById('gameCanvas');
  game.ctx = game.canvas.getContext('2d');
  game.groundLevel = groundLevel;

  player = new Player(game);

  enemies = [
    new Enemy(game, 400, groundLevel - 60),
    new Enemy(game, 700, groundLevel - 60),
    new Enemy(game, 1000, groundLevel - 60)
  ];

  coins = [
    new Coin(150, groundLevel - 70),
    new Coin(300, groundLevel - 120),
    new Coin(550, groundLevel - 70)
  ];

  endZone = {
    x: 1150,
    y: groundLevel - 60,
    width: 40,
    height: 60
  };
}

export { initGameObjects, player, enemies, coins, endZone };
