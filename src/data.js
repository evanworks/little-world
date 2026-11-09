const wood = {
  id: 'wood',
  get item() { return inventory.wood; },
  set item(value) { inventory.wood = value; },
  type: 'resource',
  useAction: 'drop',

  assets: {
    pickup: 'res/img/resource/wood/wood.png',
    inventory: 'res/img/resource/wood/woodInv.png',
  },

  spawn: {
    plains: {chance: 0.1, source: "tree"},
    forest: {chance: 0.7, source: "tree"},
    dead: {chance: 0.03, source: "dead"},
  },

  sources: {
    tree: {
      id: 'tree',
      hits: 4,
      blocked: true,
      assets: {
        idle: 'res/img/resource/wood/tree.png',
        hit: 'res/img/resource/wood/treeHit.png',
      }
    },
    dead: {
      id: 'deadTree',
      hits: 3,
      blocked: true,
      assets: {
        idle: 'res/img/resource/wood/deadTree.png',
        hit: 'res/img/resource/wood/deadTreeHit.png',
      }
    }
  }
  
}

const stone = {
  id: 'stone',
  get item() { return inventory.stone; },
  set item(value) { inventory.stone = value; },
  type: 'resource',
  useAction: 'drop',

  assets: {
    pickup: 'res/img/resource/stone/stone.png',
    inventory: 'res/img/resource/stone/stoneInv.png',
  },

  spawn: {
    plains: { chance: 0.05, source: "rock"}
  },

  sources: {
    rock: {
      id: 'rock',
      hits: 7,
      blocked: true,
      assets: {
        idle: 'res/img/resource/stone/rock.png',
        hit: 'res/img/resource/stone/rockHit.png',
      }
    }
  }
}

const coral = {
  id: 'coral',
  get item() { return inventory.coral; },
  set item(value) { inventory.coral = value; },
  type: 'resource',
  useAction: 'drop',

  assets: {
    pickup: 'res/img/resource/coral/coral.png',
    inventory: 'res/img/resource/coral/coralInv.png',
  },

  spawn: {
    beach: { chance: 0.1, source: "coral" }
  },

  sources: {
    coral: {
      id: 'coral',
      hits: 2,
      blocked: true,
      assets: {
        idle: 'res/img/resource/coral/buriedCoral.png',
        hit: 'res/img/resource/coral/buriedCoralHit.png',
      }
    }
  }
}
// a yellow daisy
const flower = {
  id: 'flower',
  get item() { return inventory.flower; },
  set item(value) { inventory.flower = value; },
  type: 'resource',
  useAction: 'drop',

  assets: {
    pickup: 'res/img/resource/flower/flower.png',
    inventory: 'res/img/resource/flower/flowerInv.png',
  },

  spawn: {
    plains: {chance: 0.02, source: "flower" },
  },

  sources: {
    flower: {
      id: 'flower',
      hits: 2,
      blocked: false,
      assets: {
        idle: 'res/img/resource/flower/flowers.png',
        hit: 'res/img/resource/flower/flowersHit.png',
      }
    }
  }
}

const plank = {
  id: 'plank',
  get item() {return inventory.plank;},
  set item(val) {inventory.plank = val;},

  assets: {
    inventory: 'res/img/structure/plank/plankInv.png',
  },

  type: 'structure',
  useAction: 'build',

  ingredients: [[wood, 2]],
  drop: wood,

  sources: {
    block: { // idk what to call this?!?
      assets: {
        idle: 'res/img/structure/plank/block.png',
        hit: 'res/img/structure/plank/blockHit.png',
      },
      hits: 7,
      blocked: true,
    }
  }
}
const masonry = {
  id: 'masonry',
  get item() {return inventory.masonry;},
  set item(val) {inventory.masonry = val;},

  assets: {
    inventory: 'res/img/structure/masonry/masonryInv.png',
  },

  type: 'structure',
  useAction: 'build',

  ingredients: [[stone, 1]],
  drop: stone,

  sources: {
    block: {
      assets: {
        idle: 'res/img/structure/masonry/masonry.png',
        hit: 'res/img/structure/masonry/masonryHit.png',
      },
      hits: 11,
      blocked: false,
    }
  }
}
const flowerpot = {
  id: 'flowerpot',
  get item() {return inventory.flowerpot;},
  set item(val) {inventory.flowerpot = val;},

  assets: {
    inventory: 'res/img/structure/flowerpot/flowerpotInv.png',
  },

  type: 'structure',
  useAction: 'build',

  ingredients: [[flower, 1], [wood, 3]],
  drop: wood,

  sources: {
    block: {
      assets: {
        idle: 'res/img/structure/flowerpot/flowerpot.png',
        hit: 'res/img/structure/flowerpot/flowerpotHit.png',
      },
      hits: 8,
      blocked: true,
    }
  }
}

const bench = {
  id: 'bench',
  type: 'structure',
  useAction: 'build',

  ingredients: [[wood, 5]],
  drop: wood,

  assets: {
    inventory: 'res/img/structure/bench/benchInv.png',
  },

  sources: {
    bench: {
      blocked: true,
      hits: 8,
      assets: {
        idle: 'res/img/structure/bench/bench.png',
        hit: 'res/img/structure/bench/benchHit.png',
      }
    }
  }
}
/*
const stonePick = {
  file: 'stonePick',
  img: 'res/img/inventory/stonePick.png',

  type: 'tool',

  ingredients: [[wood, 5], [stone, 10]]
}
*/

const grass = {
  id: 'grass',
  img: 'res/img/world/grass.png',

  sound: 'res/sound/footstep/grass.wav',
  
  blocked: false,
}
const sand = {
  id: 'sand',
  img: 'res/img/world/sand.png',

  sound: 'res/sound/footstep/snow.wav',

  blocked: false,
}
const water = {
  id: 'water',
  img: 'res/img/world/water.png',
  feesh: 'res/img/world/feesh.png',

  sound: 'res/sound/footstep/grass.wav',

  blocked: true,
}



const inventory = {
  wood: 0,
  stone: 0,
  coral: 0,
  flower: 0,
  plank: 0,
  masonry: 0,
  flowerpot: 0,
  bench: 0,
}
function addItem(item, amount) {
  inventory[item.id] += amount;
}

const itemMap = {
  wood,
  stone,
  coral,
  flower,
  plank,
  masonry,
  flowerpot,
  bench,
};