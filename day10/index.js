const { readFile } = require('../util');
const fs = require('fs');

const regexp = /^position=<\s*(-?\d+),\s*(-?\d+)> velocity=<\s*(-?\d+),\s*(-?\d+)>$/

const records = [];

/**
 * 
 * @param {Array} points 
 */
const getMessage = (points) => {
  let minDist = Infinity;
  let t = 0;
  let minT = 0;
  let minBoundary = null;
  while (true) {
    let newPoints = points.map(p => ({
      x: p.x + p.vx * t,
      y: p.y + p.vy * t
    }));
    const boundary = newPoints.reduce((b, p) => {
      const left = Math.min(b.left, p.x);
      const right = Math.max(b.right, p.x);
      const top = Math.min(b.top, p.y);
      const bottom = Math.max(b.bottom, p.y);
      return {
        left, right, top, bottom
      }
    }, { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity});
    const dist = Math.sqrt(Math.pow(boundary.right - boundary.left, 2) + Math.pow(boundary.bottom - boundary.top, 2));
    if (dist > minDist) { break; }
    minDist = dist;
    minT = t;
    minBoundary = boundary;
    t++;
  }
  const pointMap = new Map();
  const newPoints = points.map(p => ({
    x: p.x + p.vx * minT,
    y: p.y + p.vy * minT
  }));
  newPoints.forEach((p) => {
    pointMap.set(p.x + '-' + p.y, true);
  });
  const {left, right, top, bottom} = minBoundary;
  const messageLines = [];
  for (let y = top; y <= bottom; y++) {
    const line = [];
    for (let x = left; x <= right; x++) {
      if (pointMap.has(x + '-' + y)) line.push('#');
      else line.push('.');
    }
    messageLines.push(line.join(''));
  }
  console.log(minT);
  fs.writeFileSync('./output.txt', messageLines.join('\n'));
}

readFile('./input.txt', (line) => {
  const matches = line.match(regexp);
  if (!matches) return;
  const [, x, y, vx, vy] = matches;
  records.push({
    x: +x, y: +y, vx: +vx, vy: +vy
  });
}).then(() => {
  getMessage(records);
});