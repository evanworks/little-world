let doAnim = false;

let zoomScaleMobile = 2

const noise = new Noise(Math.random());
const noise2 = new Noise(Math.random());


let playerIndex = 0;
let width = Math.floor(window.innerWidth / 25) + 2;
let height = Math.floor(window.innerHeight / 25) + 3;

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

  // first pass

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (doAnim) { await new Promise(resolve => setTimeout(resolve, 0)) }

      tiles = Array.from(containerEl.children);


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
        maybeSpawn(x, y, cell, wood, undefined, wood.plainsSpawnChance);

        if (x > 0 && y > 0 && x < width - 3 && y < height - 3) {
          plainsIndices.push(y * width + x);
        }
      } else if (elevation < 1) {
        img.src = 'res/img/world/grass.png';
        maybeSpawn(x, y, cell, wood, undefined, wood.forestSpawnChance);
      }
      

      cell.appendChild(img)
      containerEl.appendChild(cell)
    } 
  }

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
    const poiimg = document.createElement('img');
    poiimg.classList.add('source');
    poiimg.classList.add(source.sourceClass);
    poiimg.src = source.sourceImg;
    poiimg.id = resource.file;

    cell.classList.add("blocked");

    cell.appendChild(poiimg);
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "t") {
    placeMultiTile(player.x, player.y, playerIndex, wood.sources.oak);
  }
});


function placeMultiTile(x, y, index, resource) {
  const anchorTile = tiles[index];
  const img = document.createElement("img");
  img.src = resource.sourceImg;
  img.classList.add("tile");
  img.style.width = `${25 * resource.width}px`;
  img.style.height = `${25 * resource.height}px`;
  img.style.position = "absolute";
  img.style.zIndex = 5;
  img.style.pointerEvents = "none";

  if (anchorTile)
    anchorTile.appendChild(img);

  for (let dy = 0; dy < resource.height; dy++) {
    console.log(dy + "dy")
    for (let dx = 0; dx < resource.width; dx++) {
      console.log(dx + "dx")
      const i = (y + dy) * width + (x + 1 + dx);
      if (tiles[i].classList.contains("blocked")) {
        // slightly old-fashioned
        tiles[i].innerHTML = `<img class="tile" src="res/img/world/grass.png">`;
      }
      
      tiles[i].classList.add("blocked");
      tiles[i].classList.add("branch");
    }
  }

  anchorTile.classList.add("anchor");
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

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) doStuffMobile();

  doListeners();
}

start();

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}