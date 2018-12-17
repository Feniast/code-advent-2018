const { parse } = require('./rect.js');
const { readFile, find } = require('../util');

const rects = [];
let x = [];
let y = [];

const area = (x1, y1, x2, y2) => (x2 - x1) * (y2 - y1);

const computeArea = (rects, xArr, yArr) => {
  xArr = [...new Set(x)];
  yArr = [...new Set(y)];
  xArr.sort((a, b) => a - b);
  yArr.sort((a, b) => a - b);

  let result = 0;
  const overlayMap = new Map();

  for (let rect of rects) {
    const l = find(xArr, rect.left);
    const r = find(xArr, rect.left + rect.width);
    const t = find(yArr, rect.top);
    const b = find(yArr, rect.top + rect.height);

    for (let i=l; i<r; i++) {
      for (let j=t; j<b; j++) {
        const key = i + '-' + j;
        if (!overlayMap.has(key)) {
          overlayMap.set(key, 1);
        } else {
          const count = overlayMap.get(key);
          if (count === 1) {
            overlayMap.set(key, count + 1);
            result += area(xArr[i], yArr[j], xArr[i+1], yArr[j+1]);
          }
        }
      }
    }
  }

  return result;
};

readFile('input.txt', (line) => {
  const rect = parse(line);
  if (rect) {
    rects.push(rect);
    x.push(rect.left, rect.left + rect.width);
    y.push(rect.top, rect.top + rect.height);
  }
}).then(() => {
  const area = computeArea(rects, x, y);
  console.log(area);
});