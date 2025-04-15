import { initGameObjects } from './game/init.js';
import { setupCanvas, ctx } from './setup/canvas.js';
import { setupAudio } from './setup/audio.js';
import { setupEvents } from './setup/events.js';
import { setupAttack } from './setup/attack.js';


setupCanvas();
setupAudio();
setupEvents();
setupAttack();

initGameObjects(); // sets up player, enemies, etc.
