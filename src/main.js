let doAnim = false;

let playerIndex = 0;
let width = Math.floor(window.innerWidth / 25) + 2;
let height = Math.floor(window.innerHeight / 25) + 2;

let player;
let bench;
let tiles;

let isChopping = false;

let startingResources = [wood, stone];

let craftableItems = [woodPick, stonePick];

const containerEl = document.getElementById("game");
const inventoryEl = document.getElementById("inventory");
const crafting = document.getElementById("crafting");

async function createGrid(width, height, imgUrl) {
  containerEl.style.display = 'grid'
  containerEl.style.gridTemplateColumns = `repeat(${width}, 25px)`
  containerEl.style.width = `${width * 25}px`

  for (let i = 0; i < width * height; i++) {
      if (doAnim) { await new Promise(resolve => setTimeout(resolve, 0)) }
      const cell = document.createElement('div')
      const img = document.createElement('img')
      img.classList.add('tile')
      img.src = imgUrl

      spawnStartingSources(cell)

      cell.appendChild(img)
      containerEl.appendChild(cell)
  }
}
function spawnStartingSources(cell) {
  for (j in startingResources) {
    let resource = startingResources[j];
    if (Math.random() < resource.spawnChance) {
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
  await createGrid(width, height, 'res/img/world/grass.png')

  tiles = Array.from(containerEl.children)

  playerIndex = Math.floor(Math.random() * tiles.length);
  player = createPlayer(tiles[playerIndex]);
  bench = createBench(tiles[playerIndex + 1]);

  doListeners();
}

start();