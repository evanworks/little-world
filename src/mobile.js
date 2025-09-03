function doStuffMobile() {

  const gameEl = document.getElementById('game');
  gameEl.style.transformOrigin = 'top left';
  gameEl.style.transform = `scale(${globals.zoomScale})`;
  gameEl.style.cursor = "auto";

  ui.inventory.style.transform = `scale(${globals.zoomScale})`;
  ui.inventory.style.width = `calc(${100/globals.zoomScale}% + 163px)`;
  ui.inventory.children[0].style.marginLeft = `10%`;
  ui.inventory.children[0].style.marginTop = `30%`;

  ui.crafting.style.transform = `scale(${globals.zoomScale})`;
  ui.crafting.style.width = `calc(${100/globals.zoomScale}% + 163px)`;
  ui.crafting.children[0].style.marginLeft = `10%`;
  ui.crafting.children[0].style.marginTop = `30%`;

  document.getElementById("game-container").style.overflow = "auto";

  gameEl.addEventListener("touchstart", (event) => { event.preventDefault(); });
  document.getElementById("mobile-arrows").addEventListener("touchstart", (event) => { event.preventDefault(); });
  document.getElementById("mobile-buttons").addEventListener("touchstart", (event) => { event.preventDefault(); });

  arrowButtonsMobile();
  functionButtonsMobile();

  updateCamera();
}


function updateCamera() {
  const container = document.getElementById('game-container');
  const playerX = state.player.offsetLeft;
  const playerY = state.player.offsetTop;

  container.scrollLeft = playerX * globals.zoomScale - container.clientWidth / 2;
  container.scrollTop = playerY * globals.zoomScale - container.clientHeight / 2;
}

function arrowButtonsMobile() {
  document.getElementById("mobile-arrows").style.display = "block";

  // still not the best way to do this
  for (let i of ["up", "left", "down", "right"]) {
    const button = document.getElementById(i);

    button.addEventListener("touchstart", (event) => {
      event.preventDefault();
      button.src = `res/img/buttons/arrow${capitalizeFirst(i)}Press.png`;
  
      playerMovement(`Arrow${capitalizeFirst(i)}`);
    });

    button.addEventListener("touchend", () => { 
      button.src = `res/img/buttons/arrow${capitalizeFirst(i)}.png`; 
    });
  }
}

function functionButtonsMobile() {
  document.getElementById("mobile-buttons").style.display = "block";

  const z = document.getElementById("z");
  const x = document.getElementById("x");
  const c = document.getElementById("c");

  z.addEventListener("touchstart", (event) => {
    event.preventDefault();
    z.src = `res/img/buttons/zPress.png`;

    if (state.building) {
      buildMode(state.building, true)
    } else {
      if (!chopInterval) {
        chop();
        chopInterval = setInterval(chop, 500);
      }
      checkForBench();
      ui.inventory.style.display = "none";
    }
  });

  z.addEventListener("touchend", () => { 
    z.src = `res/img/buttons/z.png`; 
    stopChopping();
  });

  x.addEventListener("touchstart", (event) => {
    event.preventDefault();
    x.src = `res/img/buttons/xPress.png`;

    ui.crafting.style.display = "none"; 
    ui.inventory.style.display = "none"; 
    leaveBuildMode();
  });

  x.addEventListener("touchend", () => { 
    x.src = `res/img/buttons/x.png`; 
  });

  c.addEventListener("touchstart", (event) => {
    event.preventDefault();
    c.src = `res/img/buttons/cPress.png`;

    openInventory();
  });

  c.addEventListener("touchend", () => { 
    c.src = `res/img/buttons/c.png`; 
  });
}