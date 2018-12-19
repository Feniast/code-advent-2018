const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf-8');

const regexp = /^(\d+) players; last marble is worth (\d+) points$/;

const matches = input.match(regexp);
if (!matches) return;

const playerNum = +matches[1];
const maxPoint = +matches[2];

class Node {
  constructor(v, prev = null, next = null) {
    this.value = v;
    this.prev = prev;
    this.next = next;
  }
}

class List {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
    this.cursor = null;
  }

  append(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode; 
    }
    this.size++;
    return this;
  }

  prepend(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.head.prev = newNode;
      newNode.next = this.head;
      this.head = newNode;
    }
    this.size++;
    return this;
  }

  clear() {
    this.head = null;
    this.tail = null;
    this.size = 0;
    this.cursor = null;
  }

  delete(value) {
    if (!this.head) return null;
    let deletedNode = null;
    while (this.head && this.head.value === value) {
      deletedNode = this.head;
      this.head = this.head.next;
      this.head.prev = null;
      this.size--;
    }

    let currNode = this.head;
    if (currNode != null) {
      while(currNode.next) {
        if (currNode.next.value === value) {
          deletedNode = currNode.next;
          currNode.next = deletedNode.next;
          if (currNode.next) {
            currNode.next.prev = currNode;
          }
          this.size--;
        } else {
          currNode = currNode.next;
        }
      }
    }

    if (this.tail.value === value) {
      this.tail = currNode;
    }
    if (this.cursor.value === value) {
      this.cursor = this.head; // reset the cursor
    }
    return deletedNode;
  }

  find(value) {
    let curr = this.head;
    while(curr) {
      if (curr.value === value) return curr;
      curr = curr.next;
    }
    return null;
  }

  get(index) {
    if (this.head == null || index < -this.size || index >= this.size ) return null;
    let currNode = this.head;
    const targetIndex = Math.abs(index);
    let i = 0;
    while (i < targetIndex) {
      i++;
      currNode = currNode.next;
    }
    return currNode;
  }

  setCursor(idx) {
    this.cursor = this.head;
    this.moveCursor(idx);
    return this.cursor;
  }

  insertAfter(value) {
    if (this.head == null) {
      this.append(value);
      return;
    }
    if (this.cursor == null) {
      this.cursor = this.head;
    }
    const next = this.cursor.next;
    const node = new Node(value);
    if (next != null) next.prev = node;
    node.next = next;
    node.prev = this.cursor;
    this.cursor.next = node;
    if (this.cursor === this.tail) {
      this.tail = this.cursor.next;
    }
    this.size++;
  }

  moveCursor(steps = 1) {
    if (steps === 0) return;
    if (this.cursor == null) this.cursor = this.head;
    if (this.cursor == null) return;
    let moved = 0;
    let currNode = this.cursor;
    if (steps > 0) {
      while(moved < steps) {
        moved++;
        currNode = currNode.next == null ? this.head : currNode.next;
      }
    } else {
      while(moved > steps) {
        moved--;
        currNode = currNode.prev == null ? this.tail : currNode.prev;
      }
    }
    this.cursor = currNode;
  }

  removeCursor() {
    if (this.head == null || this.cursor == null) {
      return null;
    }
    const removed = this.cursor;
    const prev = removed.prev;
    const next = removed.next;
    if (prev != null) {
      prev.next = next;
    }
    if (next != null) {
      next.prev = prev;
    }
    if (this.head === removed) {
      this.head = next;
    }
    if (this.tail === removed) {
      this.tail = prev;
    }
    this.moveCursor(1);
    this.size--;
    return removed;
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
}

const playGame = (playerNum, maxPoint) => {
  const list = new List();
  const scoreMap = new Map();
  let currPlayer = 0;
  let currMarble = 0;
  while (currMarble <= maxPoint) {
    if (currMarble > 0 && currMarble % 23 === 0) {
      let score = currMarble;
      list.moveCursor(-7);
      const node = list.removeCursor();
      score += node.value;
      scoreMap.set(currPlayer, (scoreMap.get(currPlayer) || 0) + score);
    } else {
      list.moveCursor();
      list.insertAfter(currMarble);
      list.moveCursor();
    }
    if (++currPlayer > playerNum) {
      currPlayer = 1;
    }
    currMarble++;
  }
  console.log(Math.max(...scoreMap.values()));
}

console.time();
playGame(playerNum, maxPoint);
console.timeEnd();

console.time();
playGame(playerNum, maxPoint * 100);
console.timeEnd();
