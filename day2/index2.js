// https://gist.github.com/tpae/72e1c54471e88b689f85ad2b3940a8f0
class TrieNode {
  constructor(key) {
    this.key = key;
    this.children = new Map();
    this.parent = null;
    this.end = false;
  }

  getWord() {
    let node = this;
    let word = '';
    while (node != null) {
      word = node.key + word;
      node = node.parent;
    }
    return word;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode(null);
  }

  /**
   * insert a word to the trie
   * @param {String} word
   */
  insert(word) {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      let newNode;
      if (!node.children.has(char)) {
        newNode = new TrieNode(char);
        node.children.set(char, newNode);
        newNode.parent = node;
      } else {
        newNode = node.children.get(char);
      }
      node = newNode;
      if (i === word.length - 1) {
        node.end = true;
      }
    }
  }

  /**
   * check the tree if contains the word
   * @param {String} word
   */
  contains(word) {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!node.children.has(char)) return false;
      node = node.children.get(char);
    }
    return node.end;
  }

  /**
   *
   * @param {String} word
   */
  compares(word, maxReplace = 1) {
    const arr = [];
    const result = this._compares(this.root, word, 0, maxReplace, arr);
    if (!result) return null;
    return arr;
  }

  /**
   *
   * @param {TrieNode} node
   * @param {String} word
   * @param {Number} index
   * @param {Number} maxReplace
   * @param {Array} editArr
   */
  _compares(node, word, index = 0, maxReplace = 1, editArr = []) {
    if (index >= word.length) return true;
    if (!node) return false;
    const char = word[index];
    if (node.children.has(char)) {
      return this._compares(
        node.children.get(char),
        word,
        index + 1,
        maxReplace,
        editArr
      );
    }
    if (editArr.length >= maxReplace) return false;
    const keys = node.children.keys();
    for (let key of keys) {
      editArr.push({
        key,
        index
      });
      const result = this._compares(
        node.children.get(key),
        word,
        index + 1,
        maxReplace,
        editArr
      );
      if (result) return true;
      editArr.pop();
    }
    return false;
  }
}

const root = new Trie(null);

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  crlfDelay: Infinity
});

rl.on('line', line => {
  const result = root.compares(line);
  if (!result || result.length === 0) root.insert(line);
  else {
    console.log(result);
    const common = line.split('');
    common.splice(result[0].index, 1);
    console.log(common.join(''));
    rl.close();
  }
}).on('close', () => {});
