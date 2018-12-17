const { parse } = require('./rect.js');
const { readFile, find } = require('../util');

const rects = [];
let x = [];
let y = [];

const getIsolatedClaim = (rects, xArr, yArr) => {
  xArr = [...new Set(x)];
  yArr = [...new Set(y)];
  xArr.sort((a, b) => a - b);
  yArr.sort((a, b) => a - b);

  let result;
  const overlayMap = new Map();
  const rectStatusMap = new Map();

  for (let rect of rects) {
    const rectId = rect.id;
    const l = find(xArr, rect.left);
    const r = find(xArr, rect.left + rect.width);
    const t = find(yArr, rect.top);
    const b = find(yArr, rect.top + rect.height);
    let isolated = true;
    const toCancel = [];
    const overlayToSet = [];

    for (let i=l; i<r; i++) {
      for (let j=t; j<b; j++) {
        const key = i + '-' + j;
        if (overlayMap.has(key)) {
          isolated = false;
          const flag = overlayMap.get(key);
          if (flag !== 'X') {
            toCancel.push(flag);
            overlayToSet.push(key);
          }
        } else {
          overlayToSet.push(key);
        }
      }
    }
    if (isolated) rectStatusMap.set(rectId, true);
    for (let id of toCancel) {
      rectStatusMap.set(id, false);
    }
    const flag = isolated ? rectId : 'X';
    for (let key of overlayToSet) {
      overlayMap.set(key, flag);
    }
  }

  for (let [key, value] of rectStatusMap.entries()) {
    if (value) {
      result = key;
      break;
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
  const index = getIsolatedClaim(rects, x, y);
  console.log(index);
});