const { readFile } = require('../util');
const Heap = require('../heap');

const regexp = /^Step (\w+) must be finished before step (\w+) can begin.$/;

const parseInput = (txt) => {
  const matches = txt.match(regexp);
  if (!matches) return null;
  return [matches[1], matches[2]];
}

class Node {
  constructor(key) {
    this.key = key;
    this.before = [];
    this.after = [];
  }

  appendBefore(node) {
    this.before.push(node);
  }

  appendAfter(node) {
    this.after.push(node);
  }

  setWorkTime(time) {
    this.workTime = time;
  }

  setFinishTime(time) {
    this.finishTime = time;
  }

  toString() {
    return `Node: ${this.key}, before: ${this.before.map(b => b.key)}, after: ${this.after.map(a => a.key)}`;
  }
}

/**
 * 
 * @param {Array<Node>} routes 
 */
const parseRoutes = (routes) => {
  const map = new Map();
  routes.forEach(route => {
    const [start, end] = route;
    let startNode = map.get(start), 
      endNode = map.get(end);
    if (!startNode) {
      startNode = new Node(start);
      map.set(start, startNode);
    } 
    if (!endNode) {
      endNode = new Node(end);
      map.set(end, endNode);
    }
    startNode.appendAfter(endNode);
    endNode.appendBefore(startNode);
  });
  return map;
}

/**
 * 
 * @param {Map<String, Node>} map 
 */
const computeRoadMap = (map) => {
  const roadMap = [];
  const readyMap = new Map();
  const heap = new Heap((a, b) => {
    return a.key <= b.key;
  });
  for (let node of map.values()) {
    if (node.before.length === 0) {
      heap.add(node);
    }
  }
  while (!heap.isEmpty()) {
    const node = heap.poll();
    const after = node.after;
    readyMap.set(node.key, true);
    roadMap.push(node.key);
    after.forEach((a) => {
      if (a.before.every(b => readyMap.has(b.key))) {
        heap.add(a);
      }
    });
  }
  return roadMap;
}

const base = 'A'.charCodeAt();

/**
 * 
 * @param {String} key 
 */
const getWorkTime = (key) => {
  return (key.charCodeAt() - base + 1) + 60;
}

/**
 * 
 * @param {Map<String, Node>} map 
 * @param {Number} workersNum
 */
const computeTime = (map, workersNum) => {
  const roadMap = [];
  const readyMap = new Map();
  const workerHeap = new Heap((a, b) => a.finishTime <= b.finishTime);
  const taskHeap = new Heap((a, b) => a <= b);
  let time = 0;
  const heap = new Heap((a, b) => a.key <= b.key);
  for (let node of map.values()) {
    node.setWorkTime(getWorkTime(node.key));
    if (node.before.length === 0) {
      heap.add(node);
    }
  }
  while (true) {
    const afterNodes = new Set();
    while (!workerHeap.isEmpty() && workerHeap.peek().finishTime <= time) {
      const node = workerHeap.poll();
      console.log('finish', node.key, ', time', time);
      readyMap.set(node.key, true);
      roadMap.push(node.key);
      node.after.forEach((n) => afterNodes.add(n));
    }
    for (let node of afterNodes) {
      if (node.before.every(b => readyMap.has(b.key))) {
        heap.add(node);
      }
    }
    while (!heap.isEmpty()) {
      if (workerHeap.size() < workersNum) {
        const node = heap.poll();
        const workTime = getWorkTime(node.key);
        node.setWorkTime(workTime);
        node.setFinishTime(time + workTime);
        workerHeap.add(node);
        console.log('execute', node.key, ', time', time);
      } else {
        break;
      }
    }
    if (workerHeap.isEmpty()) break;
    time = workerHeap.peek().finishTime;
  }
}

const routes = [];

readFile('./input.txt', (line) => {
  const route = parseInput(line);
  routes.push(route);
}).then(() => {
  const map = parseRoutes(routes);
  const roadMap = computeRoadMap(map);
  console.log(roadMap.join(''));
  computeTime(map, 5);
});