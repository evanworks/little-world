function craftItem(item) {
  canCraft = true;
  for (i in item.ingredients) {
    i = item.ingredients[i];
    if (i[0].item < i[1]) {
      canCraft = false;
    }
  }
  if (!canCraft) return;

  item.item++;
  for (i in item.ingredients) {
    i = item.ingredients[i];
    i[0].item -= i[1];
  }

  openInventory();
}

function useItem(item) {
  if (item.item < 1) return;

  let playerX = playerCoords[0];
  let playerY = playerCoords[1];

  inventoryEl.style.display = "none";

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

  building = item;

  if (item.item < 1) { 
    leaveBuildMode(); 
    return; 
  }

  let playerX = playerCoords[0];
  let playerY = playerCoords[1];

  let buildX = playerX;
  let buildY = playerY;
  
  let tile;
  if (buildingDirection == "right") { 
    tile = grid[playerY][playerX + 1]; 
    buildX += 1;
  } else if ( buildingDirection == "down") { 
    tile = grid[playerY + 1][playerX]; 
    buildY += 1;
  } else if (buildingDirection == "left") { 
    tile = grid[playerY][playerX - 1];
    buildX -= 1;
  } else if (buildingDirection == "up") { 
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
  if (buildingDirection == "right") {
    buildingDirection = "down";
  } else if (buildingDirection == "down") {
    buildingDirection = "left";
  } else if (buildingDirection == "left") {
    buildingDirection = "up";
  } else if (buildingDirection == "up") {
    buildingDirection = "right";
  }
  buildMode(building, false);
}

function leaveBuildMode() {
  clearTile();
  building = false;
}
function clearTile() {
  let tile;
  let playerX = playerCoords[0];
  let playerY = playerCoords[1];
  // oh god theres TWO OF THEM
  if (buildingDirection == "right") { 
    grid[playerY][playerX + 1].ground.classList.remove("selected");
  } else if ( buildingDirection == "down") { 
    grid[playerY + 1][playerX].ground.classList.remove("selected");
  } else if (buildingDirection == "left") { 
    grid[playerY][playerX - 1].ground.classList.remove("selected");
  }  else if (buildingDirection == "up") { 
    grid[playerY - 1][playerX].ground.classList.remove("selected");
  }
}