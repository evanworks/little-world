function doStuffMobile() {
  const gameEl = document.getElementById('game');
  gameEl.style.transformOrigin = 'top left';
  gameEl.style.transform = `scale(${zoomScaleMobile})`;
  gameEl.style.cursor = "auto";

  inventoryEl.style.transform = `scale(${zoomScaleMobile})`;
  inventoryEl.style.width = `calc(${100/zoomScaleMobile}% + 163px)`;
  inventoryEl.children[0].style.marginLeft = `10%`;
  inventoryEl.children[0].style.marginTop = `30%`;

  crafting.style.transform = `scale(${zoomScaleMobile})`;
  crafting.style.width = `calc(${100/zoomScaleMobile}% + 163px)`;
  crafting.children[0].style.marginLeft = `10%`;
  crafting.children[0].style.marginTop = `30%`;

  document.getElementById("game-container").style.overflow = "auto";

  gameEl.addEventListener("touchstart", (event) => { event.preventDefault(); });
  document.getElementById("mobile-arrows").addEventListener("touchstart", (event) => { event.preventDefault(); });
  document.getElementById("mobile-buttons").addEventListener("touchstart", (event) => { event.preventDefault(); });

  arrowButtonsMobile();
  functionButtonsMobile();

  updateCameraMobile();
}


function updateCameraMobile() {
  const container = document.getElementById('game-container');
  const playerX = player.offsetLeft;
  const playerY = player.offsetTop;

  container.scrollLeft = playerX * zoomScaleMobile - container.clientWidth / 2;
  container.scrollTop = playerY * zoomScaleMobile - container.clientHeight / 2;
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
  const c = document.getElementById("c");

  z.addEventListener("touchstart", (event) => {
    event.preventDefault();
    z.src = `res/img/buttons/zPress.png`;

    if (!chopInterval) {
      chop();
      chopInterval = setInterval(chop, 500);
    }

    checkForBench();
    inventoryEl.style.display = "none";
  });

  z.addEventListener("touchend", () => { 
    z.src = `res/img/buttons/z.png`; 
    stopChopping();
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