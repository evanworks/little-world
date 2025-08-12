const wood = {
  get item() {return inventory.wood;},
  set item(val) {inventory.wood = val;},

  file: 'wood',
  img: 'res/img/resource/wood/wood.png',
  inventory: 'res/img/resource/wood/woodInv.png',

  type: 'resource',
  useAction: 'drop',

  plainsSpawnChance: 0.1,
  forestSpawnChance: 0.7,
  oakSpawnChance: 0.1,
  deadSpawnChance: 0.03,

  sources: {
    tree: {
      sourceImg: 'res/img/resource/wood/tree.png',
      hitImg: 'res/img/resource/wood/treeHit.png',
      sourceClass: 'tree',
      hits: 4
    },
    /*oak: {
      sourceImg: 'res/img/world/oak.png',
      sourceClass: 'oak',
      width: 2, height: 2,
    },*/
    dead: {
      sourceImg: 'res/img/resource/wood/deadTree.png',
      hitImg: 'res/img/resource/wood/deadTreeHit.png',
      sourceClass: 'deadTree',
      hits: 3
    }
  }
  
}

const stone = {
  get item() {return inventory.stone;},
  set item(val) {inventory.stone = val;},

  file: 'stone',
  img: 'res/img/resource/stone/stone.png',
  inventory: 'res/img/resource/stone/stoneInv.png',

  type: 'resource',
  useAction: 'drop',

  spawnChance: 0.05,
  sources: {
    rock: {
      sourceImg: 'res/img/resource/stone/rock.png',
      hitImg: 'res/img/resource/stone/rockHit.png',
      sourceClass: 'rock',
      hits: 7
    }
  }
}

const coral = {
  get item() {return inventory.coral;},
  set item(val) {inventory.coral = val;},

  file: 'coral',
  img: 'res/img/resource/coral/coral.png',
  inventory: 'res/img/resource/coral/coralInv.png',

  type: 'resource',
  useAction: 'drop',

  spawnChance: 0.1,
  sources: {
    coral: {
      sourceImg: 'res/img/resource/coral/buriedCoral.png',
      hitImg: 'res/img/resource/coral/buriedCoralHit.png',
      sourceClass: 'coral',
      hits: 2
    }
  }
}
const plank = {
  get item() {return inventory.plank;},
  set item(val) {inventory.plank = val;},
  
  file: 'plank',
  inventory: 'res/img/structure/plank/plankInv.png',
  useAction: 'place',

  type: 'structure',

  ingredients: [[wood, 5]]
}

const woodPick = {
  file: 'woodPick',
  img: 'res/img/inventory/woodPick.png',

  type: 'tool',

  ingredients: [[wood, 10]]
}
const stonePick = {
  file: 'stonePick',
  img: 'res/img/inventory/stonePick.png',

  type: 'tool',

  ingredients: [[wood, 5], [stone, 10]]
}
const crystalPick = {
  file: 'crystalPick',
  img: 'res/img/inventory/crystalPick.png',

  type: 'tool',

  ingredients: [[wood, 5], [/*crystal*/wood, 10]]
}

const inventory = {
  wood: 0,
  stone: 0,
  coral: 0,
  plank: 0
}

const itemMap = {
  wood,
  stone,
  coral,
  plank
};