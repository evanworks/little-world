const globals = {
  doAnim: false,
  dev: true,
  zoomScale: 2,

  seed: Math.random() * 1e16,
  random: null,
  noise1: 0.5,
  noise2: 0.5,

  width: (Math.floor(window.innerWidth / 25) + 2) * 1,
  height: (Math.floor(window.innerHeight / 25) + 3) * 1,
}

const state = {
  building: false,
  buildingDirection: "right",
  grid: [],
  unlockedRecipes: [plank, masonry, flowerpot],

  playerCoords: null,
  player: null
}

const ui = {
  container: document.getElementById("game"),
  inventory: document.getElementById("inventory"),
  crafting: document.getElementById("crafting"),
  loader: document.getElementById("loader-wrapper")
}

let grid = state.grid;

function createPlayer(x, y) {
  const player = document.createElement('img');
  player.classList.add('player');
  player.src = 'res/img/player/player.png';

  if (grid[y][x].resourceEl) {
    grid[y][x].resourceEl.remove();
    grid[y][x].blocked = false;
  }

  const tile = grid[y][x].tile;
  tile.appendChild(player);
  state.playerCoords = [x, y];

  return player;
}
function createBench(x, y) {
  const bench = document.createElement('img');
  bench.classList.add('bench');
  bench.src = 'res/img/world/bench.png';

  const tile = grid[y][x].tile;
  tile.appendChild(bench);

  if (grid[y][x].resourceEl) {
    grid[y][x].resourceEl.remove();
    grid[y][x].blocked = false;
  }

  grid[y][x].blocked = true;
  grid[y][x].kind = "bench";

  return bench;
}

async function begin() {
  mapSeed();

  document.getElementById("title").style.display = "none";
  ui.loader.style.display = "block";
  console.log("hey")
  
  await createGrid(globals.width, globals.height, 'res/img/world/grass.png');

  if (globals.dev == "very true") document.getElementById("debug").style.display = "block";

  probablySpawnPlayerAndBench()

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) doStuffMobile();

  doListeners();
  
  document.getElementById("title-bg").style.display = "none";
}

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
  if (are == "more") {
    let resource = prompt("please enter resource name");
    if (itemMap[resource]) {
      let amount = prompt("are?");
      itemMap[resource].item += parseInt(amount);
      alert("you're welcome");
    }
  } else if (are == "build") {
    buildMode(plank, false);
  }
}