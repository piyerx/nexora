const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function setupCanvas() {
  canvas.width = 1200;
  canvas.height = 600;
}

export { canvas, ctx, setupCanvas };
