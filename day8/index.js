const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf-8');

const numbers = input.split(/\s+/).map(x => +x);

class TreeNode {
  constructor() {
    this.children = [];
    this.metadata = [];
  }

  appendChild(child) {
    this.children.push(child);
  }

  appendMetadata(...metadata) {
    this.metadata.push(...metadata);
  }
}

const buildNode = (arr, index = 0) => {
  const node = new TreeNode();
  const childNum = arr[index];
  const metadataNum = arr[index + 1];
  let foundChildNum = 0;
  let cursor = index + 2;
  while (foundChildNum < childNum) {
    const { endIndex, treeNode } = buildNode(arr, cursor);
    foundChildNum++;
    cursor = endIndex + 1;
    node.appendChild(treeNode);
  }
  for (i = 0; i < metadataNum; i++) {
    node.appendMetadata(arr[cursor + i]);
  }
  return {
    treeNode: node,
    endIndex: cursor + metadataNum - 1
  };
}

const buildTree = (arr) => {
  const {treeNode: root} = buildNode(arr);
  return root;
}

const tree = buildTree(numbers);

/**
 * 
 * @param {TreeNode} tree 
 */
const computeMetadata = (tree) => {
  if (!tree) return 0;
  const queue = [];
  queue.push(tree);
  let sum = 0;
  while (queue.length > 0) {
    const node = queue.shift();
    node.children.forEach(c => queue.push(c));
    sum += node.metadata.reduce((v, n) => v + n);
  }
  return sum;
}

const computeValue = (node) => {
  if (!node) return 0;
  if (node.children.length === 0) return node.metadata.reduce((v, n) => v + n);
  return node.metadata.reduce((value, nodeIdx) => {
    if (nodeIdx === 0 || nodeIdx > node.children.length) return value;
    const child = node.children[nodeIdx - 1];
    return value + computeValue(child);
  }, 0);
}

console.log(computeMetadata(tree));

console.log(computeValue(tree));

