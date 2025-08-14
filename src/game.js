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
  building = item;

  if (item.item < 1) leaveBuildMode();

  let playerX = playerCoords[0];
  let playerY = playerCoords[1];

  let tile = grid[playerY][playerX + 1];

  if (tile) {
    if (tile.blocked) return;

    if (build) {
      console.log(tile.tile);
      clearTile();
      createSource(item, Object.values(item.sources)[0], playerX + 1, playerY, tile.tile);
      item.item--;
    } else {
      tile.ground.classList.add("selected");
    }
  }
}
function leaveBuildMode() {
  clearTile();
  building = false;
}
function clearTile() {
  let tile = grid[playerCoords[1]][playerCoords[0] + 1];
  tile.ground.classList.remove("selected");
}