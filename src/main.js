const globals = {
  dev: true,
  zoomScale: 1,

  seed: Math.random() * 1e16,
  random: null,
  noise1: 0.5,
  noise2: 0.5,
  tileSize: 25,

  volume: 1,
}
globals.width =  (Math.floor(window.innerWidth / globals.tileSize) + 2) * 2;
globals.height = (Math.floor(window.innerHeight / globals.tileSize) + 3) * 2;

const state = {
  building: false,
  buildingDirection: "right",
  grid: [],
  unlockedRecipes: [plank, masonry, flowerpot, bench],

  playerCoords: null,
  player: null
}

const ui = {
  container: document.getElementById("game"),
  inventory: document.getElementById("inventory"),
  crafting: document.getElementById("crafting"),
  loader: document.getElementById("loader-wrapper"),
  audio: new window.AudioContext(),
  gain: null,
}

let grid = state.grid;

// helper directions
const DIRECTIONS = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
}
const DIRECTION_ORDER = ["right", "down", "left", "up"];

function createPlayer(x, y) {
  const tile = getTile(x, y);
  if (!tile) return null;

  const player = document.createElement('img');
  player.classList.add('player');
  player.src = 'res/img/player/player.png';

  if (tile.occupant) {
    tile.occupant.el.remove();
    tile.occupant = null;
    tile.blocked = tile.ground.blocked;
  }

  tile.cell.appendChild(player);
  state.playerCoords = [x, y];

  return player;
}

async function begin() {
  mapSeed();

  document.getElementById("title").style.display = "none";
  ui.loader.style.display = "block";
  await createGrid(globals.width, globals.height);

  if (globals.dev === "very true") document.getElementById("debug").style.display = "block";

  probablySpawnPlayerAndBench()

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) doStuffMobile();

  doListeners();
  
  document.getElementById("title-bg").style.display = "none";

  updateCamera();
}

document.addEventListener("DOMContentLoaded", () => {
  initializeKeyBindings();
  toggleScanlines();
  initializeGain();
  setMasterVolume(globals.volume);
});

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const konamiCode = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

let position = 0;

document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === konamiCode[position].toLowerCase()) {
    position++;
    if (position === konamiCode.length) {
      if (globals.dev) document.getElementById("debug").style.display = "block";
      position = 0;
    }
  } else {
    position = 0;
  }
});

function debug(are) {
  if (are === "more") {
    let resource = prompt("please enter resource name");
    if (itemMap[resource]) {
      let amount = prompt("are?");
      itemMap[resource].item += parseInt(amount);
      alert("you're welcome");
    }
  } else if (are === "build") {
    buildMode(plank, false);
  }
}