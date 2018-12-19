const fs = require('fs');
const input = 2568;

const getPower = (serial, x, y) => {
  const rackId = x + 10;
  const m = (y * rackId + serial) * rackId;
  const power = Math.floor(m % 1000 / 100) - 5;
  return power;
}

const getPowerGrid = (serial, cols, rows) => {
  const grid = [];
  for (let y=1; y<=rows; y++) {
    const line = [];
    for (let x=1; x<=cols; x++) {
      line.push(getPower(serial, x, y));
    }
    grid.push(line);
  }
  return grid;
}

const grid = getPowerGrid(input, 300, 300)

const computeHighestPowerArea = (grid, rows, cols) => {
  let max = -Infinity;
  let point = { x: 0, y: 0 };
  for (let y = 0; y < grid.length - 2; y++) {
    for (let x = 0; x < grid.length - 2; x++) {
      let power = 0;
      for (let i = x; i < x + cols; i++) {
        for (let j = y; j < y + rows; j++) {
          power += grid[j][i];
        }
      }
      if (power > max) {
        max = power;
        point = {x: x + 1, y: y + 1};
      } 
    }
  }
  return point;
}

console.log(computeHighestPowerArea(grid, 3, 3));