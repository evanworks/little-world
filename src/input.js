function playerMovement(key) {
  let x = playerCoords[0];
  let y = playerCoords[1];


  if (key === 'ArrowRight' && x < width - 1) x++;
  else if (key === 'ArrowLeft' && x > 0) x--;
  else if (key === 'ArrowDown' && y < height - 1) y++;
  else if (key === 'ArrowUp' && y > 0) y--;

  if (!grid[y][x].blocked) {
    if (grid[y][x].isResource) {
      collectResource([x, y]);
    }

    grid[y][x].tile.appendChild(player);
    playerCoords = [x, y];
  }

  updateCameraMobile()
}

function collectResource(coords) {
  let tile = grid[coords[1]][coords[0]];

  player.src = 'res/img/player/collect.png';
  setTimeout(() => {
    player.src = 'res/img/player/player.png';
  }, 300)

  const el = tile.source;
  el.remove();
  if (tile.resource) tile.resource.item++;
}

function doListeners() {
  document.addEventListener('keydown', (e) => {
    if (e.repeat) return;

    if (e.key === 'z') {
      chop();
      checkForBench();
    } else if (e.key === 'c') {
      openInventory();
    } else if (e.key === 'x') {
      checkForBench();
    } else {
      playerMovement(e.key);
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'z') stopChopping();
  });
}

function chop() {
  if (isChopping) return;
  isChopping = true;

  player.src = 'res/img/player/chop.gif';
  inventoryEl.style.display = "none";
  player.style.marginLeft = "-30px";

  harvestAdjacent();
}

function stopChopping() {
  isChopping = false;
  player.style.marginLeft = "-25px";
  player.src = 'res/img/player/player.png';
}


function checkForBench() {
  const adjacentOffsets = [[0,1],[0,-1],[1,0],[-1,0]];

  for (let offset of adjacentOffsets) {
    const index = [playerCoords[0]-offset[0],playerCoords[1]-offset[1]];
    const tile = grid[index[1]][index[0]];

    if (tile && tile.bench) {
      player.src = 'res/img/player/player.png';
      player.style.marginLeft = "-25px";
      openCrafting();
      break;
    }
  }
}

function harvestAdjacent() {
  const adjacentOffsets = [[0,1],[0,-1],[1,0],[-1,0]];
  let harvested = false;

  adjacentOffsets.forEach(offset => {
    const index = [playerCoords[0]-offset[0],playerCoords[1]-offset[1]];
    const tile = grid[index[1]][index[0]];
    if (!tile) return;

    if (tile.isSource) {
      let resource = tile.resource;
      if (!resource) return;

      // Update tile visuals
      tile.tile.classList.remove('blocked');
      tile.blocked = false;
      const el = tile.source;
      el.remove();
      tile.isSource = false;
      tile.isResource = true;

      // Add dropped item
      const drop = document.createElement('img');
      drop.src = resource.img;
      drop.id = resource.file;
      drop.classList.add('resource');
      tile.source = drop;

      tile.tile.appendChild(drop);

      harvested = true;
    }
  });

  return harvested;
}