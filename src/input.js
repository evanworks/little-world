function playerMovement(direction) {
  clearBuildTile()

  if (!DIRECTIONS[direction] || !state.playerCoords) return;
  let moveCoords = addCoords(state.playerCoords, DIRECTIONS[direction]);
  let moveTile = getTile(moveCoords)
  if (!moveTile || moveTile.blocked) return;

  if (moveTile.occupant && moveTile.occupant.type === "resource") {
    collectResource(moveTile);
  }
  moveTile.cell.appendChild(state.player);
  state.playerCoords = moveCoords;
  if (state.building) {
    buildMode(state.building, false);
  }
  updateCamera();
}
function updateCamera() {
  const container = document.getElementById('game-container');
  if (!state.player) return;
  const playerX = state.player.offsetLeft;
  const playerY = state.player.offsetTop;

  container.scrollLeft = playerX * globals.zoomScale - container.clientWidth / 2;
  container.scrollTop = playerY * globals.zoomScale - container.clientHeight / 2;
}

function collectResource(tile) {
  const el = tile.occupant.el;
  el.remove();
  if (tile.occupant.resource) addItem(tile.occupant.resource, 1);
  tile.occupant = null;
}

let chopInterval;

const DEFAULT_KEY_BINDINGS = {
  primary: "z",
  secondary: "x",
  tertiary: "c",
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
};

const keyBindings = loadKeyBindings();

function loadKeyBindings() {
  try {
    const saved = JSON.parse(localStorage.getItem("little-world-key-bindings"));
    return { ...DEFAULT_KEY_BINDINGS, ...(saved || {}) };
  } catch {
    return { ...DEFAULT_KEY_BINDINGS };
  }
}

function saveKeyBindings() {
  try {
    localStorage.setItem("little-world-key-bindings", JSON.stringify(keyBindings));
  } catch {
    // Bindings still apply for the current session when storage is unavailable.
  }
}

function formatKey(key) {
  return key.startsWith("Arrow") ? key.slice(5) : key === " " ? "Space" : key.length === 1 ? key.toUpperCase() : key;
}

function initializeKeyBindings() {
  for (const action of Object.keys(keyBindings)) {
    const button = document.getElementById(`bind-${action}`);
    if (!button) continue;

    button.textContent = formatKey(keyBindings[action]);
    button.addEventListener("click", () => {
      button.textContent = "Press a key…";
      button.classList.add("waiting");

      const rebind = (event) => {
        event.preventDefault();
        event.stopPropagation();
        document.removeEventListener("keydown", rebind, true);
        button.classList.remove("waiting");

        if (event.key === "Escape") {
          button.textContent = formatKey(keyBindings[action]);
          return;
        }

        const duplicate = Object.entries(keyBindings).find(([name, key]) => name !== action && key === event.key);
        if (duplicate) {
          button.textContent = `${formatKey(duplicate[1])} in use`;
          setTimeout(() => { button.textContent = formatKey(keyBindings[action]); }, 1000);
          return;
        }

        keyBindings[action] = event.key;
        saveKeyBindings();
        button.textContent = formatKey(event.key);
      };

      document.addEventListener("keydown", rebind, true);
    });
  }
}

function doListeners() {
  document.addEventListener('keydown', (e) => {
    if (e.repeat && (e.key === keyBindings.primary || e.key === keyBindings.secondary || e.key === keyBindings.tertiary)) return;
    if (e.key === keyBindings.primary) {
      primaryButtonPress();
    } else if (e.key === keyBindings.secondary) {
      secondaryButtonPress();
    } else if (e.key === keyBindings.tertiary) {
      tertiaryButtonPress();
    }
    if (ui.crafting.style.display === "none") {
      for (const direction of ["up", "down", "left", "right"]) {
        if (e.key === keyBindings[direction]) playerMovement(direction);
      }
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === keyBindings.primary) stopChopping();
  });
}

function primaryButtonPress() {
  if (state.building) {
    buildMode(state.building, true)
  } else {
    if (!chopInterval) {
      chop();
      chopInterval = setInterval(chop, 500);
    }
    ui.inventory.style.display = "none";
  }
}
function secondaryButtonPress() {
  ui.crafting.style.display = "none";
  ui.inventory.style.display = "none";
  leaveBuildMode();
}
function tertiaryButtonPress() {
  if (state.building) {
    clearBuildTile();
    toggleBuildingDirection();
  } else {
    checkForBench();
    if (ui.crafting.style.display === "none") {
      openInventory();
    }
  }
}

function chop() {
  let flip = harvestAdjacent();
  if (flip) {
    state.player.style.marginLeft = "-20px";
    state.player.src = 'res/img/player/chopRight.gif';
  } else {
    state.player.style.marginLeft = "-30px";
    state.player.src = 'res/img/player/chopLeft.gif';
  }
}

function stopChopping() {
  state.player.style.marginLeft = `-${globals.tileSize}px`;
  state.player.src = 'res/img/player/player.png';

  clearInterval(chopInterval);
  chopInterval = null;
}


function checkForBench() {
  for (const direction of DIRECTION_ORDER) {
    let tile = getAdjacentTile(direction);
    
    if (tile?.occupant?.resource === bench) {
      state.player.src = 'res/img/player/player.png';
      state.player.style.marginLeft = `-${globals.tileSize}px`;
      openCrafting();
      break;
    }
  }
}

function harvestAdjacent() {
  let flip = false;

  for (const direction of DIRECTION_ORDER) {
    let tile = getAdjacentTile(direction);
    if (!tile) continue;

    if (!tile.occupant && direction === "left") {
      flip = true;
    }
    if (!tile.occupant) continue;

    if (tile.occupant.type === "source") {
      let resource = tile.occupant.resource;
      if (resource.drop) resource = resource.drop;
      if (!resource) continue;

      if (tile.occupant.hits > 1) {
        animateHit(tile.occupant.el, direction)
        tile.occupant.el.src = tile.occupant.source.assets.hit;
        setTimeout(() => { tile.occupant.el.src = tile.occupant.source.assets.idle}, 200)
        tile.occupant.hits--;
      } else {
        // destruction
        // you could even say decimation
        const el = tile.occupant.el;
        el.remove();
        tile.occupant = null;
        createResource(resource, tile);
      }
    }
  }

  return flip;
}
const HIT_ANIMATION = {
  up:    { axis: "marginTop",  hit: "-8px", reset: "-6px" },
  down:  { axis: "marginTop",  hit: "-4px", reset: "-6px" },
  left:  { axis: "marginLeft", hit: "-2px", reset: "0px"  },
  right: { axis: "marginLeft", hit: "2px",  reset: "0px"  },
};
function animateHit(element, direction) {
  const config = HIT_ANIMATION[direction];
  if (!config) return;

  element.style[config.axis] = config.hit;
  setTimeout(() => {
    element.style[config.axis] = config.reset;
  }, 200)
}