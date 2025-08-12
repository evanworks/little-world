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
  let playerX = playerCoords[0];
  let playerY = playerCoords[1];
  if (item.useAction == 'drop') {
    let dropX = playerX - 1;

    if (grid[playerY][dropX]) {
      if (grid[playerY][dropX].blocked) {
        dropX = playerX + 1;
      }
    }
    if (grid[playerY][dropX]) if (grid[playerY][dropX].blocked) return;

    drop(grid[playerY][dropX], item);
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