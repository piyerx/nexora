function showToast(message, duration = 3000) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), duration);
  }
  
  function updateBackground(state) {
    if (state === "menu") {
      document.body.style.backgroundImage = "url('./assets/images/misc/nex-menu-bg.gif')";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundPosition = "center center";
    } else if (state === "playing") {
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
  
  export { showToast, updateBackground, fadeToBlack };
  