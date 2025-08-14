let doAnim = false;

let dev = "very true";

let zoomScaleMobile = 2

const noise = new Noise(Math.random());
const noise2 = new Noise(Math.random());


let playerIndex = 0;
let playerCoords;
let building = false; 

let width = Math.floor(window.innerWidth / 25) + 2;
let height = Math.floor(window.innerHeight / 25) + 3;

let player;
let bench;
let grid = [];

const plainsIndices = [];

let isChopping = false;

let startingResources = [wood, stone];

let craftableItems = [plank];

const containerEl = document.getElementById("game");
const inventoryEl = document.getElementById("inventory");
const crafting = document.getElementById("crafting");
const spotlight = document.getElementById("spotlight");


async function createGrid(width, height, imgUrl) {
  containerEl.style.display = 'grid';
  containerEl.style.gridTemplateColumns = `repeat(${width}, 25px)`;
  containerEl.style.width = `${width * 25}px`;

  const scale = 0.1;

  for (let y = 0; y < height; y++) {
    grid.push([])
    for (let x = 0; x < width; x++) {
      grid[y].push({
        blocked: false,
        ground: undefined,
        tile: undefined,
        resource: undefined,
        chosenSource: undefined,
        resourceEl: undefined,
        hits: undefined,
        kind: "",
      });
      if (doAnim) { await new Promise(resolve => setTimeout(resolve, 0)) }

      const elevation = noise.perlin2(x * scale, y * scale);

      const cell = document.createElement('div');
      const img = document.createElement('img');
      img.classList.add('tile');
      img.src = imgUrl;

      grid[y][x].blocked = false;

      if (elevation < -0.3) {
        img.src = 'res/img/world/water.png';
        grid[y][x].ground = img;
        grid[y][x].blocked = true;

        cell.classList.add("blocked");
      } else if (elevation < -0.2) {
        img.src = 'res/img/world/sand.png';
        grid[y][x].ground = img;
        maybeSpawn(x, y, cell, coral);
        
      } else if (elevation < 0.2) {
        img.src = 'res/img/world/grass.png';
        grid[y][x].ground = img;
        maybeSpawn(x, y, cell, stone);
        maybeSpawn(x, y, cell, wood, undefined, wood.plainsSpawnChance);

        if (x > 0 && y > 0 && x < width - 3 && y < height - 3) { 
          plainsIndices.push([y,x]);
        }
      } else if (elevation < 1) {
        img.src = 'res/img/world/grass.png';
        grid[y][x].ground = img;
        maybeSpawn(x, y, cell, wood, wood.sources.dead, wood.deadSpawnChance);
        maybeSpawn(x, y, cell, wood, undefined, wood.forestSpawnChance);
      }
      grid[y][x].tile = cell;

      cell.appendChild(img)
      containerEl.appendChild(cell)
    } 
  }
  // failed attempt at large trees :(
  /*for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (Math.random() > 0.9) placeMultiTile(x, y, x*width+y, wood.sources.oak);
    }
  }*/
}

// source/chance here is so messed up
function maybeSpawn(x, y, cell, resource, source = Object.entries(resource.sources)[0][1], chance = resource.spawnChance) {
  const scale = 0.1;
  const elevation = noise2.perlin2(x * scale, y * scale);

  if (elevation < chance && Math.random() < chance && !cell.classList.contains("blocked")) {
    createSource(resource, source, x, y, cell);
  }
}
function createSource(resource, source, x, y, cell) {
  const poiimg = document.createElement('img');
  poiimg.classList.add('source');
  poiimg.classList.add(source.sourceClass);
  poiimg.src = source.sourceImg;
  poiimg.id = resource.file;

  cell.classList.add("blocked");

  cell.insertBefore(poiimg, cell.firstChild);

  grid[y][x].resource = resource;
  grid[y][x].resourceEl = poiimg;
  grid[y][x].kind = "source";
  grid[y][x].blocked = true;
  grid[y][x].hits = source.hits;
  grid[y][x].chosenSource = source;
}

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
  playerCoords = [x, y];

  return player;
}
function createBench(x, y) {
  const bench = document.createElement('img');
  bench.classList.add('bench');
  bench.src = 'res/img/world/bench.png';

  const tile = grid[y][x].tile;
  tile.classList.add("blocked");
  tile.appendChild(bench);

  grid[y][x].blocked = true;
  grid[y][x].kind = "bench";

  return bench;
}

async function start() {
  await createGrid(width, height, 'res/img/world/grass.png');

  if (dev == "very true") document.getElementById("debug").style.display = "block";
}
function begin() {
  if (plainsIndices.length > 0) {
    let spawn = plainsIndices[Math.floor(Math.random() * plainsIndices.length)];

    let spawnX = spawn[1];
    let spawnY = spawn[0];
    
    player = createPlayer(spawnX, spawnY);

    let benchX = spawnX + 1;
    if (grid[spawnY][benchX]) {
      if (grid[spawnY][benchX].blocked) {
        benchX = spawnX - 1;
      }
      bench = createBench(benchX, spawnY);
    } else {
      location.reload();
    } 
  } else {
    console.warn("uh ohhhhhh");
    let [spawnX, spawnY] = plainsIndices[Math.floor(Math.random() * grid.length)];
    player = createPlayer(spawnX, spawnY);
    bench = createBench(spawnX + 1, spawnY);
  }

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) doStuffMobile();

  doListeners();

  document.getElementById("title-bg").style.display = "none";
}

start();

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
      if (dev) document.getElementById("debug").style.display = "block";
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