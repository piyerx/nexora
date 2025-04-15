const menuMusic = new Audio('./assets/sfx/Nex_main_menu.mp3');
const levelMusic = new Audio('./assets/sfx/Nex_level_theme.mp3');

function setupAudio() {
  menuMusic.loop = true;
  menuMusic.volume = 0.6;
  levelMusic.loop = true;
  levelMusic.volume = 0.6;

  const playMenuMusic = () => {
    menuMusic.play().catch(console.error);
    document.removeEventListener('click', playMenuMusic);
    document.removeEventListener('keydown', playMenuMusic);
  };

  document.addEventListener('click', playMenuMusic);
  document.addEventListener('keydown', playMenuMusic);
}

export { menuMusic, levelMusic, setupAudio };
