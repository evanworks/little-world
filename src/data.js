const inventory = {
  wood: 0,
  stone: 0
}

const wood = {
  get item() {return inventory.wood;},
  set item(val) {inventory.wood = val;},

  file: 'wood',
  img: 'res/img/resource/wood.png',

  type: 'resource',

  spawnChance: 0.1,
  sourceImg: 'res/img/world/tree.png',
  sourceClass: 'tree'
}

const stone = {
  get item() {return inventory.stone;},
  set item(val) {inventory.stone = val;},

  file: 'stone',
  img: 'res/img/resource/stone.png',

  type: 'resource',

  spawnChance: 0.01,
  sourceImg: 'res/img/world/rock.png',
  sourceClass: 'rock'
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

const itemMap = {
  wood,
  stone,
  woodPick,
  stonePick
};