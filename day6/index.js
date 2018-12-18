const { readFile } = require('../util');

const parseInput = (str) => {
  const [x, y] = str.split(/,\s*/);
  return [+x, +y];
}

const distance = (x1, y1, x2, y2) => Math.abs(x2 - x1) + Math.abs(y2 - y1);

const extractMaxMin = (points) => {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  points.forEach((point) => {
    const [x, y] = point;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  });
  return [minX, minY, maxX, maxY];
}

const problem1 = (points) => {
  const [ left, top, right, bottom ] = extractMaxMin(points);
  const areas = new Map();
  for (let x=left; x<=right; x++) {
    for (let y=top; y<=bottom; y++) {
      const [minIdx] = points.reduce((v, n, i) => {
        const [, min] = v; 
        const dist = distance(x, y, n[0], n[1]);
        if (dist < min) {
          return [i, dist];
        } else if (dist === min) {
          return [-1, dist];
        } else {
          return v;
        }
      }, [-1, Infinity]);
      if (minIdx >= 0) {
        if (x === left || x === right || y === top || y === bottom) {
          areas.set(minIdx, -Infinity);
        } else if (areas.get(minIdx) !== -Infinity) {
          areas.set(minIdx, (areas.get(minIdx) || 0) + 1);
        }
      }
    }
  }
  return Math.max(...areas.values());
}

const problem2 = (points) => {
  const [ left, top, right, bottom ] = extractMaxMin(points);
  let area = 0;
  for (let x=left; x<=right; x++) {
    for (let y=top; y<=bottom; y++) {
      let sum = 0;
      for (let i=0; i<points.length; i++) {
        sum += distance(x, y, points[i][0], points[i][1]);
        if (sum > 10000) break;
      }
      if (sum < 10000) area++;
    }
  }
  return area;
}

const points = [];
readFile('input.txt', (line) => {
  points.push(parseInput(line));
})
.then(() => {
  console.log(problem1(points));
  console.log(problem2(points));
});