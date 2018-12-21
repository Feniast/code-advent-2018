const input = 293801;

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
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
      this.tail = this.head;
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    this.size++;
  }

  toArray() {
    const arr = [];
    let curr = this.head;
    while (curr) { arr.push(curr.value); curr = curr.next; }
    return arr;
  }
}

const list = new List();
list.append(3);
list.append(7);

const makeReceipe = (num1, num2) => {
  const sum = num1 + num2;
  if (sum === 0) return [0];
  let x = sum;
  let arr = [];
  while (x > 0) {
    arr.unshift(x % 10);
    x = ~~(x / 10);
  }
  return arr;
};

const findScore = (list, num, offset) => {
  const minSize = num + offset;
  let first = list.head;
  let second = first.next;
  const move = (node, steps) => {
    if (steps === 0) return node;
    if (!node) node = list.head;
    if (!node) return null;
    let i = 0;
    while (i < steps) {
      node = node.next;
      if (node == null) { node = list.head; }
      i++;
    }
    return node;
  };

  while (list.size < minSize) {
    const newReceipe = makeReceipe(first.value, second.value);
    for (let item of newReceipe) {
      list.append(item);
    }
    first = move(first, first.value + 1);
    second = move(second, second.value + 1);
  }

  let third = list.tail;
  for (let i=(num + list.size - minSize); i > 1; i--) {
    third = third.prev;
  }
  let result = [];
  for (let i=0; i<num; i++) {
    result.push(third.value);
    third = third.next;
  }
  return result;
};

console.log(findScore(list, 10, input).join(''));

const list2 = new List();
list2.append(3);
list2.append(7);

const findScore2 = (list, score) => {
  let first = list.head;
  let second = first.next;


  const move = (node, steps) => {
    if (steps === 0) return node;
    if (!node) node = list.head;
    if (!node) return null;
    let i = 0;
    while (i < steps) {
      node = node.next;
      if (node == null) { node = list.head; }
      i++;
    }
    return node;
  };

  while (true) {

  }
}