function craftItem(item) {
  let canCraft = true;
  for (let i in item.ingredients) {
    i = item.ingredients[i];
    if (i[0].item < i[1]) {
      canCraft = false;
    }
  }
  if (!canCraft) return;

  item.item++;
  for (let i in item.ingredients) {
    i = item.ingredients[i];
    i[0].item -= i[1];
  }

  openInventory();
}

function useItem(item) {
  if (item.item < 1) return;

  let playerX = state.playerCoords[0];
  let playerY = state.playerCoords[1];

  ui.inventory.style.display = "none";

  if (item.useAction == 'drop') {
    let dropX = playerX - 1;

    if (grid[playerY][dropX]) {
      if (grid[playerY][dropX].blocked) {
        dropX = playerX + 1;
      }
    }
    if (grid[playerY][dropX]) if (grid[playerY][dropX].blocked) return;

    item.item--;

    drop(grid[playerY][dropX], item);
  } else if (item.useAction == 'build') {
    buildMode(item, false);
  }
}

function drop(tile, resource) {
  const drop = document.createElement('img');
  drop.src = resource.img;
  drop.id = resource.file;
  drop.classList.add('resource');

  tile.resourceEl = drop;
  tile.kind = "resource";
  tile.resource = resource;
  tile.tile.appendChild(drop);
}


function buildMode(item, build) {
  clearTile();

  state.building = item;

  if (item.item < 1) { 
    leaveBuildMode(); 
    return; 
  }

  let playerX = state.playerCoords[0];
  let playerY = state.playerCoords[1];

  let buildX = playerX;
  let buildY = playerY;
  
  let tile;
  if (state.buildingDirection == "right") { 
    tile = grid[playerY][playerX + 1]; 
    buildX += 1;
  } else if (state.buildingDirection == "down") { 
    tile = grid[playerY + 1][playerX]; 
    buildY += 1;
  } else if (state.buildingDirection == "left") { 
    tile = grid[playerY][playerX - 1];
    buildX -= 1;
  } else if (state.buildingDirection == "up") { 
    tile = grid[playerY - 1][playerX]; 
    buildY -= 1;
  }

  if (tile) {
    if (tile.blocked) return;

    if (build) {
      createSource(item, Object.values(item.sources)[0], buildX, buildY, tile.tile, item.walkable);
      item.item--;
    } else {
      tile.ground.classList.add("selected");
    }
  }
}
function toggleBuildingDirection() {
  if (state.buildingDirection == "right") {
    state.buildingDirection = "down";
  } else if (state.buildingDirection == "down") {
    state.buildingDirection = "left";
  } else if (state.buildingDirection == "left") {
    state.buildingDirection = "up";
  } else if (state.buildingDirection == "up") {
    state.buildingDirection = "right";
  }
  buildMode(state.building, false);
}

function leaveBuildMode() {
  clearTile();
  state.building = false;
}
function clearTile() {
  let tile;
  let playerX = state.playerCoords[0];
  let playerY = state.playerCoords[1];
  // oh god theres TWO OF THEM
  if (state.buildingDirection == "right") { 
    grid[playerY][playerX + 1].ground.classList.remove("selected");
  } else if (state.buildingDirection == "down") { 
    grid[playerY + 1][playerX].ground.classList.remove("selected");
  } else if (state.buildingDirection == "left") { 
    grid[playerY][playerX - 1].ground.classList.remove("selected");
  }  else if (state.buildingDirection == "up") { 
    grid[playerY - 1][playerX].ground.classList.remove("selected");
  }
}