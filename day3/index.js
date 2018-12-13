const readline = require('readline');
const fs = require('fs');
const { parse } = require('./rect.js');

const rects = [];
const x = [];
const y = [];
const unitRects = [];

const readFile = (readLine) => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream('input.txt'),
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      readLine(line);
    });

    rl.on('close', () => {
      resolve();
    });
  });
};

readFile((line) => {
  const rect = parse(line);
  if (rect) {
    rects.push(rect);
  }
}).then(() => {
  console.log(rects);
});