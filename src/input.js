function playerMovement(key) {
  let x = playerCoords[0];
  let y = playerCoords[1];


  if (key === 'ArrowRight' && x < width - 1) x++;
  else if (key === 'ArrowLeft' && x > 0) x--;
  else if (key === 'ArrowDown' && y < height - 1) y++;
  else if (key === 'ArrowUp' && y > 0) y--;

  if (!grid[y][x].blocked) {
    if (grid[y][x].kind == "resource") {
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

  const el = tile.resourceEl;
  el.remove();

  if (tile.resource) tile.resource.item++;
  tile.kind = "";
  tile.resource = undefined;
}

let chopInterval;

function doListeners() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'z') {
      if (!chopInterval) {
        chop();
        chopInterval = setInterval(chop, 500);
      }
      checkForBench();
      inventoryEl.style.display = "none";
    } else if (e.key === 'c') {
      openInventory();
    } else if (e.key === 'x') {
      crafting.style.display = "none"; 
    } else {
      if (crafting.style.display == "none") playerMovement(e.key);
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'z') {
      stopChopping();
      clearInterval(chopInterval);
      chopInterval = null;
    }
  });
}

function chop() {
  let flip = harvestAdjacent();
  if (flip) {
    player.style.marginLeft = "-20px";
    player.src = 'res/img/player/chopRight.gif';
  } else {
    player.style.marginLeft = "-30px";
    player.src = 'res/img/player/chopLeft.gif';
  }
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
    
    if (tile && tile.kind == "bench") {
      player.src = 'res/img/player/player.png';
      player.style.marginLeft = "-25px";
      openCrafting();
      break;
    }
  }
}

function harvestAdjacent() {
  let flip = false;

  const adjacentOffsets = [[0,1],[0,-1],[1,0],[-1,0]];

  adjacentOffsets.forEach(offset => {
    const index = [playerCoords[0]-offset[0],playerCoords[1]-offset[1]];
    const tile = grid[index[1]][index[0]];
    if (!tile) return;

    if (tile.kind == "source") {
      let resource = tile.resource;
      if (!resource) return;

      if (tile.hits > 1) {
        if (offset[0]==0&&offset[1]==1) { // top
          tile.resourceEl.style.marginTop = "-8px";
          setTimeout(() => { tile.resourceEl.style.marginTop = "-6px"; }, 200)
        }
        if (offset[0]==0&&offset[1]==-1) { // bottom 
          tile.resourceEl.style.marginTop = "-4px";
          setTimeout(() => { tile.resourceEl.style.marginTop = "-6px"; }, 200)
        }
        if (offset[0]==1&&offset[1]==0) { // left 
          tile.resourceEl.style.marginLeft = "-2px";
          setTimeout(() => { tile.resourceEl.style.marginLeft = "0px"; }, 200)
        }
        if (offset[0]==-1&&offset[1]==0) { // right 
          tile.resourceEl.style.marginLeft = "2px";
          setTimeout(() => { tile.resourceEl.style.marginLeft = "0px"; }, 200)
        }
        tile.resourceEl.src = tile.chosenSource.hitImg;
        setTimeout(() => { tile.resourceEl.src = tile.chosenSource.sourceImg}, 200)
        tile.hits--;
      } else {
        // destruction
        tile.tile.classList.remove('blocked');
        tile.blocked = false;
        const el = tile.resourceEl;
        el.remove();
        tile.kind = "resource";

        const drop = document.createElement('img');
        drop.src = resource.img;
        drop.id = resource.file;
        drop.classList.add('resource');
        tile.resourceEl = drop;

        tile.tile.appendChild(drop);
        tile.hits = undefined;
      }
    } else if (tile.kind !== "source" && offset[0]==1 && offset[1]==0) {
      flip = true;
    }
  });

  return flip;
}