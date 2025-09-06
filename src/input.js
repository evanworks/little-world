function playerMovement(key) {
  let x = state.playerCoords[0];
  let y = state.playerCoords[1];


  if (key === 'ArrowRight' && x < globals.width - 1) x++;
  else if (key === 'ArrowLeft' && x > 0) x--;
  else if (key === 'ArrowDown' && y < globals.height - 1) y++;
  else if (key === 'ArrowUp' && y > 0) y--;

  if (!grid[y][x].blocked) {
    if (grid[y][x].kind == "resource") {
      collectResource([x, y]);
      playSound("res/sound/collect3.wav");
    } else {
      playSound(grid[y][x].ground.sound);
    }

    clearTile();

    grid[y][x].tile.appendChild(state.player);
    state.playerCoords = [x, y];
    

    if (state.building) {
      buildMode(state.building, false);
    }
  }

  updateCamera();
}

function collectResource(coords) {
  let tile = grid[coords[1]][coords[0]];

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
      if (state.building) {
        buildMode(state.building, true)
      } else {
        if (!chopInterval) {
          chop();
          chopInterval = setInterval(chop, 500);
        }
        checkForBench();
        ui.inventory.style.display = "none";
      }
    } else if (e.key === 'c') {
      if (state.building) {
        clearTile();
        toggleBuildingDirection();
      } else {
        openInventory();
      }
    } else if (e.key === 'x') {
      ui.crafting.style.display = "none"; 
      ui.inventory.style.display = "none"; 
      leaveBuildMode();
    } else if (e.key == "ArrowUp" || e.key == "ArrowDown" || e.key == "ArrowRight" || e.key == "ArrowLeft") {
      if (ui.crafting.style.display == "none") playerMovement(e.key);
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'z') {
      stopChopping();
    }
  });
}

function chop() {
  let flip = harvestAdjacent();
  if (flip) {
    state.player.style.marginLeft = "-20px";
    state.player.src = 'res/img/player/chopRight.gif';
  } else {
    state.player.style.marginLeft = "-30px";
    state.player.src = 'res/img/player/chopLeft.gif';
  }
}

function stopChopping() {
  state.player.style.marginLeft = `-${globals.tileSize}px`;
  state.player.src = 'res/img/player/player.png';

  clearInterval(chopInterval);
  chopInterval = null;
}


function checkForBench() {
  const adjacentOffsets = [[0,1],[0,-1],[1,0],[-1,0]];
  
  for (let offset of adjacentOffsets) {
    const index = [state.playerCoords[0]-offset[0],state.playerCoords[1]-offset[1]];
    const tile = grid[index[1]][index[0]];
    
    if (tile && tile.kind == "bench") {
      state.player.src = 'res/img/player/player.png';
      state.player.style.marginLeft = `-${globals.tileSize}px`;
      openCrafting();
      break;
    }
  }
}

function harvestAdjacent() {
  let flip = false;
  let playDestruction = false;

  const adjacentOffsets = [[0,1],[0,-1],[1,0],[-1,0]];

  adjacentOffsets.forEach(offset => {
    const [px, py] = state.playerCoords;
    const [ox, oy] = offset;
    const tx = px - ox;
    const ty = py - oy;

    let tile;

    if (ty >= 0 && ty < grid.length && tx >= 0 && tx < grid[ty].length) {
      tile = grid[ty][tx];
    } else {
      return;
    }

    if (!tile) return;

    if (tile.kind == "source") {
      let resource = tile.resource;
      if (tile.resource.drop) resource = tile.resource.drop;
      
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
        playDestruction = true;

        // destruction
        tile.blocked = false;
        const el = tile.resourceEl;
        el.remove();
        drop(tile, resource);
        tile.hits = undefined;
      }
    } else if (tile.kind !== "source" && offset[0]==1 && offset[1]==0) {
      flip = true;
    }

    if (playDestruction) playSound("res/sound/break2.wav");
    else playSound("res/sound/hit2.wav");
  });

  return flip;
}