const plainsIndices = [];

function mapSeed() {
  function mulberry32(a) {
    return function() {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
  }

  globals.random = mulberry32(globals.seed);
  globals.noise1 = new Noise(globals.random());
  globals.noise2 = new Noise(globals.random());
}

async function createGrid(width, height) {
  ui.container.style.display = 'grid';
  ui.container.style.gridTemplateColumns = `repeat(${width}, ${globals.tileSize}px)`;
  ui.container.style.width = `${width * globals.tileSize}px`;

  const scale = 0.1;
  let count = 0;

  for (let y = 0; y < height; y++) {
    grid.push([]);
    for (let x = 0; x < width; x++) {

      grid[y].push({
        ground: null,
        cell: null,
        groundEl: null,
        blocked: false,

        occupant: null
      });

      const elevation = globals.noise1.perlin2(x * scale, y * scale);
      const elevation2 = globals.noise2.perlin2(x * scale, y * scale);
      const cell = document.createElement('div');

      const tile = getTile(x, y);
      tile.cell = cell;

      let ground;

      if (elevation < -0.3) {
        //if (globals.random() > 0.97) img.src = water.feesh;
        ground = createGround(tile, water);
      } else if (elevation < -0.2) {
        ground = createGround(tile, sand);
        maybeSpawn(tile, coral, "beach", elevation2);
      } else if (elevation < 0.2) {
        ground = createGround(tile, grass);
        maybeSpawn(tile, stone, "plains", elevation2);
        maybeSpawn(tile, wood, "plains", elevation2);
        maybeSpawn(tile, flower, "plains", elevation2);
        if (x > 0 && y > 0 && x < width - 3 && y < height - 3) { 
          plainsIndices.push([y,x]);
        }
      } else if (elevation < 1) {
        ground = createGround(tile, grass);
        maybeSpawn(tile, wood, "dead", elevation2);
        maybeSpawn(tile, wood, "forest", elevation2);
      }

      tile.groundEl = ground;
      cell.appendChild(ground);
      ui.container.appendChild(cell);

      count++;
      const progress = count / (width * height);
      ui.loader.children[0].children[0].style.width = `${progress * 100}%`;
      ui.loader.children[1].innerHTML = `${(progress * 100).toFixed(0)}%`;
    } 
  }
}
function createGround(tile, ground) {
  tile.ground = ground;
  tile.blocked = ground.blocked;
  const img = document.createElement('img');
  img.classList.add('tile');

  img.src = ground.img;
  if (ground.id === "water" && globals.random() > 0.97) {
    img.src = ground.feesh;
  }
  return img;
}

function maybeSpawn(tile, resource, spawn, elevation) {
  const rule = resource.spawn?.[spawn];
  if (!rule) return;
  const source = resource.sources[rule.source];
  if (elevation < rule.chance && globals.random() < rule.chance && !tile.blocked && !tile.occupant) {
    createSource(resource, source, tile);
  }
}

function createSource(resource, source, tile) {
  const img = document.createElement('img');
  img.src = source.assets.idle;
  img.classList.add('source');
  tile.cell.insertBefore(img, tile.cell.lastChild);

  tile.occupant = {
    type: "source",
    resource,
    source,
    el: img,
    hits: source.hits,
  }
  tile.blocked = source.blocked;
}

function createResource(resource, tile) {
  const img = document.createElement('img');
  img.src = resource.assets.pickup;
  img.classList.add('resource');
  tile.cell.insertBefore(img, tile.cell.lastChild);

  tile.occupant = {
    type: "resource",
    resource,
    el: img,
  }
  tile.blocked = false;
}

function probablySpawnPlayerAndBench() {
  if (plainsIndices.length > 0) {
    // player
    let spawn = plainsIndices[Math.floor(globals.random() * plainsIndices.length)];

    let spawnX = spawn[1];
    let spawnY = spawn[0];

    state.player = createPlayer(spawnX, spawnY);

    for (let direction of DIRECTION_ORDER) {
      let tile = getAdjacentTile(direction)
      if (tile && !tile.blocked && !tile.occupant) {
        createSource(bench, bench.sources.bench, getAdjacentTile(direction));
        return;
      }
    }
  } else {
    alert("what")
  }
}