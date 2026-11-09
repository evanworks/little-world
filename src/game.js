function craftItem(item) {
  if (!item?.ingredients) return;

  const canCraft = item.ingredients.every(([ingredient, amount]) => ingredient.item >= amount);
  if (!canCraft) return;

  for (const [ingredient, amount] of item.ingredients) {
    ingredient.item -= amount;
  }
  item.item++;

  openCrafting(false);
}

function useItem(item) {
  if (item.item < 1) return;

  ui.inventory.style.display = "none";

  if (item.useAction === 'drop') {
    for (const direction of DIRECTION_ORDER) {
      const tile = getAdjacentTile(direction);
      if (tile && !tile.blocked && !tile.occupant) {
        drop(tile, item);
        item.item--;
        break;
      }
    }
  } else if (item.useAction === 'build') {
    buildMode(item, false);
  }
}

function drop(tile, resource) {
  createResource(resource, tile);
}


function buildMode(item, build) {
  clearBuildTile();

  state.building = item;
  if (item.item < 1) {
    leaveBuildMode();
    return;
  }

  const tile = getAdjacentTile(state.buildingDirection);
  if (!tile || tile.blocked || tile.occupant) return;

  if (build) {
    createSource(item, Object.values(item.sources)[0], tile);
    item.item--;
    leaveBuildMode();
  } else {
    tile.groundEl.classList.add("selected");
  }
}

function clearBuildTile() {
  const tile = getAdjacentTile(state.buildingDirection);
  if (tile?.groundEl) tile.groundEl.classList.remove("selected");
}

function toggleBuildingDirection() {
  if (!state.building) return;
  let index = DIRECTION_ORDER.indexOf(state.buildingDirection);
  state.buildingDirection = DIRECTION_ORDER[(index + 1) % DIRECTION_ORDER.length];
  buildMode(state.building, false);
}

function leaveBuildMode() {
  clearBuildTile()
  state.building = false;
}

// x can be [x,y]
function getTile(x, y) {
  if (Array.isArray(x)) {
    y = x[1]
    x = x[0]
  }
  if (!grid[y] || grid[y][x] === undefined) return null;
  return grid[y][x];
}
function getAdjacentTile(direction) {
  if (!DIRECTIONS[direction] || !state.playerCoords) return null;
  const [dx, dy] = DIRECTIONS[direction];
  const [x, y] = state.playerCoords;

  return getTile(x + dx, y + dy);
}
function addCoords(a, b) {
  const [ax, ay] = a
  const [bx, by] = b
  return [ax + bx, ay + by];
}