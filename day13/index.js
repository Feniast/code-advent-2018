const Heap = require('../heap');
const { readFile } = require('../util');

const uid = (function() {
  let id = 0;
  return () => {
    return id++;
  }
})();

class Cart {
  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.turn = 0;
    this.id = uid();
  }

  get key() {
    return this.x + '-' + this.y;
  }

  clone() {
    const newCart = new Cart(this.x, this.y, this.dir);
    newCart.id = this.id;
    newCart.turn = this.turn;
    return newCart;
  }
}

/**
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {String} symbol 
 */
const parseSymbol = (x, y, symbol) => {
  let cart = null;
  let track = null; 
  if (symbol === 'v' || symbol === '^' || symbol === '>' || symbol === '<') {
    cart = new Cart(x, y, symbol);
    track = (symbol === 'v' || symbol === '^') ? '|' : '-';
  } else {
    track = symbol;
  }
  return {
    cart,
    track
  };
}

const createCartHeap = () => {
  return new Heap((a, b) => {
    if (a.y != b.y) {
      return a.y < b.y;
    }
    return a.x <= b.x;
  });
}

let cartHeap = createCartHeap();
const cartHeap2 = createCartHeap();
let i = 0;
const roadMap = [];
const cartPosMap = new Map();
const cartPosMap2 = new Map();

const dirVectorMap = {
  'v': [0, 1],
  '^': [0, -1],
  '>': [1, 0],
  '<': [-1, 0]
};

const slashMap = {
  '^': '>',
  '<': 'v',
  'v': '<',
  '>': '^'
};

const backSlashMap = {
  '^': '<',
  '>': 'v',
  '<': '^',
  'v': '>'
};

const turnLeftMap = {
  '>': '^',
  'v': '>',
  '^': '<',
  '<': 'v'
};

const turnRightMap = {
  '^': '>',
  '>': 'v',
  'v': '<',
  '<': '^'
};

const decideDir = (oldDir, roadSymbol, turnStatus) => {
  let newDir = oldDir;
  let turn = turnStatus;
  if (roadSymbol === '/') {
    newDir = slashMap[oldDir];
  }
  if (roadSymbol === '\\') {
    newDir = backSlashMap[oldDir];
  }
  if (roadSymbol === '+') {
    if (turnStatus === 0) newDir = turnLeftMap[oldDir];
    if (turnStatus === 2) newDir = turnRightMap[oldDir];
    turn = (turnStatus + 1) % 3;
  }
  return {
    dir: newDir,
    turn
  };
}

const moveCart = (cart, roadMap) => {
  let { x, y, dir, turn } = cart;
  const vector = dirVectorMap[dir];
  if (!vector) return cart;
  x += vector[0];
  y += vector[1];
  const roadSymbol = roadMap[y][x];
  cart.x = x;
  cart.y = y;
  ({ dir, turn } = decideDir(dir, roadSymbol, turn));
  cart.dir = dir;
  cart.turn = turn;
  return cart;
};

/**
 * 
 * @param {Array<Array>} roadMap 
 * @param {Map<String, Number>} cartPosMap
 * @param {Heap} initState 
 */
const letCartsCrash = (roadMap, cartPosMap, initState) => {
  let oldCartStatus = initState;
  let newCartStatus;
  let i = 0;
  while (true) {
    newCartStatus = createCartHeap();
    while (!oldCartStatus.isEmpty()) {
      const cart = oldCartStatus.poll();
      const oldKey = cart.key;
      moveCart(cart, roadMap);
      const newKey = cart.key;
      if (cartPosMap.get(newKey)) {
        return [cart.x, cart.y];
      }
      cartPosMap.delete(oldKey);
      cartPosMap.set(newKey, 1);
      newCartStatus.add(cart);
    }
    oldCartStatus = newCartStatus;
    i++;
  }
}

const getLastCar = (roadMap, posMap, initState) => {
  let oldCartStatus = initState;
  let newCartStatus;
  let i = 0;
  const crashedMap = new Map();
  while (oldCartStatus.size() != 0) {
    newCartStatus = createCartHeap();
    const cartArr = [];
    const newCartArr = [];
    while (!oldCartStatus.isEmpty()) {
      cartArr.push(oldCartStatus.poll());
    }
    for (let cart of cartArr) {
      if (crashedMap.has(cart.id)) {
        continue;
      }
      const lastPosKey = cart.key;
      const cartId = cart.id;
      moveCart(cart, roadMap);
      const newPosKey = cart.key;
      if (posMap.has(newPosKey)) {
        const collidedId = posMap.get(newPosKey);
        crashedMap.set(collidedId, true);
        crashedMap.set(cartId, true);
        posMap.delete(lastPosKey);
        posMap.delete(newPosKey);
      } else {
        posMap.delete(lastPosKey);
        posMap.set(newPosKey, cartId);
        newCartArr.push(cart);
      }
    }
    for (let cart of newCartArr) {
      if (!crashedMap.has(cart.id)) {
        newCartStatus.add(cart);
      }
    }
    oldCartStatus = newCartStatus;
    if (newCartStatus.size() === 1) {
      return newCartStatus.peek();
    }
  }
}

readFile('./input.txt', (line) => {
  let row = [];
  for (let j=0; j<line.length; j++) {
    const symbol = line[j];
    const { cart, track } = parseSymbol(j, i, symbol);
    if (cart) {
      cartHeap.add(cart);
      cartHeap2.add(cart.clone());
      cartPosMap.set(cart.key, 1);
      cartPosMap2.set(cart.key, cart.id);
    }
    row.push(track);
  }
  roadMap.push(row);
  i++;
}).then(() => {
  require('fs').writeFileSync('./output.txt', roadMap.map((r) => r.join('')).join('\n'));
  const [x, y] = letCartsCrash(roadMap, cartPosMap, cartHeap);
  console.log(x, y);

  console.log(getLastCar(roadMap, cartPosMap2, cartHeap2));

});
