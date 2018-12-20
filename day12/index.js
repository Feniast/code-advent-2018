const { readFile } = require('../util');

const regexp = /^initial state: ([.#]+)$/;
const ruleRegexp = /^([.#]{5})\s+=>\s+([.#])$/;

let lineNo = 1;
let initialState;
const rules = new Map();

class Node {
  constructor(obj) {
    this.value = obj;
    this.prev = null;
    this.next = null;
  }

  safePrev(steps) {
    let curr = this;
    let i = 0;
    while (i < steps && curr) {
      curr = this.prev;
      i++;
    }
    return curr;
  }

  safeNext(steps) {
    let curr = this;
    let i = 0;
    while (i < steps && curr) {
      curr = this.next;
      i++;
    }
    return curr;
  }
}

class List {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  append(value) {
    const node = new Node(value);
    if (this.size === 0) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    this.size++;
  }

  prepend(value) {
    const node = new Node(value);
    if (this.size === 0) {
      this.head = node;
      this.tail = node;
    } else {
      this.head.prev = node;
      node.next = this.head;
      this.head = node;
    }
    this.size++;
  }

  toArray() {
    const arr = [];
    let curr = this.head;
    while (curr) {
      arr.push(curr.value);
      curr = curr.next;
    }
    return arr;
  }

  head() {
    if (this.head) return this.head.value;
    return null;
  }

  tail() {
    if (this.tail) return this.tail.value;
    return null;
  }

  *[Symbol.iterator](){
    let curr = this.head;
    while (curr) {
      yield curr;
      curr = curr.next;
    }
  }
}

const iterateGeneration = (initialState, num) => {
  if (num <= 0) return initialState;
  const map = new Map();
  const list = new List();
  let state = initialState;
  for (let i=0; i<state.length; i++) {
    list.append({ index: i, value: state[i]});
    map.set(i, state[i]);
  }
  let start = 0;
  let end = state.length - 1;
  let string = '';
  for (let i=1; i<=num; i++) {
    for (let j=start-2; j<=end+2; j++) {
      if (!string) {
        for (let k=j-2; k<=j+2; k++) {
          string += map.get(k) || '.';
        }
      } else {
        string = string.slice(1) + (map.get(j+2) || '.');
      }
      const newGen = rules.get(string) || '.';
      map.set(j, newGen);
    }
    start = start - 2;
    end = end + 2;
    while(map.get(start) === '.') start++;
    while(map.get(end) === '.') end--;
  }
  let sum = 0;
  for (let [k, v] of map) {
    sum += v === '.' ? 0 : k;
  }
  return sum;
}

const hugeIteration = (state, num) => {
  let stableCount = 0;
  let stableDiff = 0;
  let result = iterateGeneration(state, 0);
  let i = 0;
  while(stableCount <= 100) {
    i++;
    const newResult = iterateGeneration(state, i);
    const newDiff = newResult - result;
    if (newDiff === stableDiff) {
      stableCount++;
    } else {
      stableDiff = newDiff;
      stableCount = 0;
    }
    result = newResult;
  }
  return (num - i) * stableDiff + result;
}

readFile('./input.txt', (line) => {
  if (lineNo === 1) {
    const matches = line.match(regexp);
    initialState = matches[1];
  } else if (line) {
    const matches = line.match(ruleRegexp);
    if (matches) {
      rules.set(matches[1], matches[2]);
    }
  }
  lineNo++;
}).then(() => {
  console.log(iterateGeneration(initialState, 20));
  console.log(hugeIteration(initialState, 50000000000));
});
