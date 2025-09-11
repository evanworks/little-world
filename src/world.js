const plainsIndices = [];

function seed() {console.log(globals.seed);}
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

async function createGrid(width, height, imgUrl) {
  ui.container.style.display = 'grid';
  ui.container.style.gridTemplateColumns = `repeat(${width}, ${globals.tileSize}px)`;
  ui.container.style.width = `${width * globals.tileSize}px`;

  const scale = 0.1;
  let count = 0;

  for (let y = 0; y < height; y++) {
    grid.push([]);
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
      if (globals.doAnim) { await new Promise(resolve => setTimeout(resolve, 0)) }

      const elevation = globals.noise1.perlin2(x * scale, y * scale);

      const cell = document.createElement('div');
      const img = document.createElement('img');
      img.classList.add('tile');
      img.src = imgUrl;

      grid[y][x].blocked = false;

      if (elevation < -0.3) {
        img.src = water.img;
        if (globals.random() > 0.97) img.src = water.feesh;
        grid[y][x].ground = water;
        grid[y][x].blocked = true;
      } else if (elevation < -0.2) {
        img.src = sand.img;
        grid[y][x].ground = sand;
        maybeSpawn(x, y, cell, coral);
      } else if (elevation < 0.2) {
        img.src = grass.img;
        grid[y][x].ground = grass;
        maybeSpawn(x, y, cell, stone);
        maybeSpawn(x, y, cell, wood, undefined, wood.plainsSpawnChance);
        maybeSpawn(x, y, cell, flower, undefined, flower.plainsSpawnChance);

        if (x > 0 && y > 0 && x < width - 3 && y < height - 3) { 
          plainsIndices.push([y,x]);
        }
      } else if (elevation < 1) {
        img.src = grass.img;
        grid[y][x].ground = grass;
        maybeSpawn(x, y, cell, wood, wood.sources.dead, wood.deadSpawnChance);
        maybeSpawn(x, y, cell, wood, undefined, wood.forestSpawnChance);
      }

      grid[y][x].groundEl = img;
      grid[y][x].tile = cell;

      cell.appendChild(img)
      ui.container.appendChild(cell)

      count++;
      ui.loader.children[0].children[0].style.width = (count / globals.width * globals.height) / 100 + "px";
      ui.loader.children[1].innerHTML = ((count / globals.width * globals.height) / 100).toFixed(2) + "%";
    } 
  }
}

function maybeSpawn(x, y, cell, resource, source = Object.entries(resource.sources)[0][1], chance = resource.spawnChance) {
  const scale = 0.1;
  const elevation = globals.noise2.perlin2(x * scale, y * scale);

  if (elevation < chance && globals.random() < chance && !grid[y][x].blocked) {
    createSource(resource, source, x, y, cell, resource.walkable);
  }
}

function createSource(resource, source, x, y, cell, walkable) {
  const poiimg = document.createElement('img');
  poiimg.classList.add('source');
  poiimg.src = source.sourceImg;
  poiimg.id = resource.file;

  cell.insertBefore(poiimg, cell.lastChild);

  grid[y][x].resource = resource;
  grid[y][x].resourceEl = poiimg;
  grid[y][x].kind = "source";
  if (!walkable) grid[y][x].blocked = true;
  grid[y][x].hits = source.hits;
  grid[y][x].chosenSource = source;
}

function probablySpawnPlayerAndBench() {
  if (plainsIndices.length > 0) {
    // player
    let spawn = plainsIndices[Math.floor(globals.random() * plainsIndices.length)];

    let spawnX = spawn[1];
    let spawnY = spawn[0];
    
    state.player = createPlayer(spawnX, spawnY);

    // bench
    let benchX = spawnX + 1;
    if (grid[spawnY][benchX]) {
      if (grid[spawnY][benchX].blocked) {
        benchX = spawnX - 1;
      }
      createSource(bench, bench.sources.bench, benchX, spawnY, grid[spawnY][benchX].tile, false);
    } else {
      location.reload();
    } 
  } else {
    // fail "safe"
    console.warn("uh ohhhhhh");
    let [spawnX, spawnY] = plainsIndices[Math.floor(globals.random() * grid.length)];
    state.player = createPlayer(spawnX, spawnY);
    createBench(spawnX + 1, spawnY);
  }
}