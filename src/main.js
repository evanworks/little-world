let doAnim = false;

const noise = new Noise(Math.random());
const noise2 = new Noise(Math.random());

let playerIndex = 0;
let width = Math.floor(window.innerWidth / 25) + 2;
let height = Math.floor(window.innerHeight / 25) + 2;

let player;
let bench;
let tiles;

const plainsIndices = [];

let isChopping = false;

let startingResources = [wood, stone];

let craftableItems = [woodPick, stonePick];

const containerEl = document.getElementById("game");
const inventoryEl = document.getElementById("inventory");
const crafting = document.getElementById("crafting");

async function createGrid(width, height, imgUrl) {
  containerEl.style.display = 'grid';
  containerEl.style.gridTemplateColumns = `repeat(${width}, 25px)`;
  containerEl.style.width = `${width * 25}px`;

  const scale = 0.1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (doAnim) { await new Promise(resolve => setTimeout(resolve, 0)) }

      const elevation = noise.perlin2(x * scale, y * scale);
      
      const cell = document.createElement('div');
      const img = document.createElement('img');
      img.classList.add('tile');
      img.src = imgUrl;

      if (elevation < -0.3) {
        img.src = 'res/img/world/water.png';
        cell.classList.add("blocked");
      } else if (elevation < -0.2) {
        img.src = 'res/img/world/sand.png';
        maybeSpawn(x, y, cell, coral);
      } else if (elevation < 0.2) {
        img.src = 'res/img/world/grass.png';
        maybeSpawn(x, y, cell, stone);
        maybeSpawn(x, y, cell, wood, wood.plainsSpawnChance);

        if (x > 0 && y > 0 && x < width - 3 && y < height - 3) {
          plainsIndices.push(y * width + x);
        }
      } else if (elevation < 1) {
        img.src = 'res/img/world/grass.png';
        maybeSpawn(x, y, cell, wood, wood.forestSpawnChance);
      }

      cell.appendChild(img)
      containerEl.appendChild(cell)
    } 
  }
}
function maybeSpawn(x, y, cell, resource, chance = resource.spawnChance) {
  const scale = 0.1;
  const elevation = noise2.perlin2(x * scale, y * scale);

  if (elevation < chance && Math.random() < chance) {
    const poiimg = document.createElement('img');
    poiimg.classList.add('source');
    poiimg.classList.add(resource.sourceClass);
    poiimg.src = resource.sourceImg;
    poiimg.id = resource.file;

    cell.classList.add("blocked");
    cell.appendChild(poiimg)
  }
}

function spawnStartingSources(cell) {
  for (j in startingResources) {
    let resource = startingResources[j];
    if (noise2 < resource.spawnChance) {
      if (!cell.classList.contains("blocked")) {
        const poiimg = document.createElement('img');
        poiimg.classList.add('source');
        poiimg.classList.add(resource.sourceClass);
        poiimg.src = resource.sourceImg;
        poiimg.id = resource.file;
  
        cell.classList.add("blocked");
        cell.appendChild(poiimg)
      }
    }
  }
}
 
function createPlayer(tile) {
  const player = document.createElement('img');
  player.classList.add('player');
  player.src = 'res/img/player/player.png';

  tile.appendChild(player)
  return player;
}
function createBench(tile) {
  const bench = document.createElement('img');
  bench.classList.add('bench');
  bench.src = 'res/img/world/bench.png';
  tile.classList.add("blocked");

  tile.appendChild(bench);
  return bench;
}

async function start() {
  await createGrid(width, height, 'res/img/world/grass.png');

  tiles = Array.from(containerEl.children);

  if (plainsIndices.length > 0) {
    playerIndex = plainsIndices[Math.floor(Math.random() * plainsIndices.length)];
    player = createPlayer(tiles[playerIndex]);

    const benchIndex = tiles[playerIndex + 1] && !tiles[playerIndex + 1].classList.contains("blocked")
      ? playerIndex + 1
      : playerIndex - 1;
    bench = createBench(tiles[benchIndex]);
  } else {
    console.warn("No safe plains tile found. Spawning randomly.");
    playerIndex = Math.floor(Math.random() * tiles.length);
    player = createPlayer(tiles[playerIndex]);
    bench = createBench(tiles[playerIndex + 1] || tiles[playerIndex - 1]);
  }

  doListeners();
}

start();