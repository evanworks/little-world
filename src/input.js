function playerMovement(e, tiles, player) {
  console.log(playerIndex)
  let x = playerIndex % width;
  let y = Math.floor(playerIndex / width);

  if (e.key === 'ArrowRight' && x < width - 1) x++;
  else if (e.key === 'ArrowLeft' && x > 0) x--;
  else if (e.key === 'ArrowDown' && y < height - 1) y++;
  else if (e.key === 'ArrowUp' && y > 0) y--;

  let newIndex = y * width + x;

  if (!tiles[newIndex].classList.contains('blocked')) {
    const resourceQuestionMark = tiles[newIndex].querySelector('.resource');
    if (resourceQuestionMark) {
      collectResource(tiles, newIndex, player);
    }

    tiles[newIndex].appendChild(player);
    playerIndex = newIndex;
  }
}

function collectResource(tiles, newIndex, player) {
  let resource = itemMap[tiles[newIndex].children[1].id];

  player.src = 'res/img/player/collect.png';
  setTimeout(() => {
    player.src = 'res/img/player/player.png';
  }, 200)

  tiles[newIndex].children[1].remove();
  if (resource) resource.item++;
}

function doListeners() {
  document.addEventListener('keydown', (e) => {
    if (e.repeat) return;

    if (e.key === 'z') {
      if (isChopping) return;
      isChopping = true;

      player.src = 'res/img/player/chop.gif';
      inventoryEl.style.display = "none";
      player.style.marginLeft = "-30px";

      harvestAdjacent(tiles);

      checkForBench();

    } else if (e.key === 'c') {
      openInventory();
    } else {
      playerMovement(e, tiles, player);
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'z') {
      isChopping = false;
      player.style.marginLeft = "-25px";
      player.src = 'res/img/player/player.png';
    }
  });
}

function checkForBench() {
  const adjacentOffsets = [-1, 1, -width, width];

  for (let offset of adjacentOffsets) {
    const index = playerIndex + offset;
    const tile = tiles[index];
    if (tile && tile.querySelector('.bench')) {
      player.src = 'res/img/player/player.png';
      player.style.marginLeft = "-25px";
      openCrafting();
      break;
    }
  }
}

function harvestAdjacent(tiles) {
  const adjacentOffsets = [-1, 1, -width, width];
  let harvested = false;

  adjacentOffsets.forEach(offset => {
    const index = playerIndex + offset;
    const tile = tiles[index];
    if (!tile) return;

    const source = tile.querySelector('.source');
    if (source) {
      const id = source.id;
      const resource = itemMap[id];
      if (!resource) return;

      // Update tile visuals
      tile.classList.remove('blocked');
      source.remove();

      // Add dropped item
      const drop = document.createElement('img');
      drop.src = resource.img;
      drop.id = resource.file;
      drop.classList.add('resource');
      tile.appendChild(drop);

      harvested = true;
    }
  });

  return harvested;
}