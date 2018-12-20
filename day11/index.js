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

fs.writeFileSync('./output.txt', grid.join('\n'));

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

const maxArraySum = (arr, size) => {
  if (!arr || arr.length === 0) return 0;
  if (size <= 0) return 0;
  if (size > arr.length) size = arr.length;
  let sum = 0;
  for (let i=0; i<size; i++) {
    sum += arr[i];
  }
  let max = sum;
  let start = 0;
  for (let i=1; i<arr.length-size+1; i++) {
    sum = sum - arr[i-1] + arr[i+size-1];
    if (sum > max) {
      start = i;
      max = sum;
    }
  }
  return { max, start };
}

const getHighestPowerArea = (grid) => {
  if (!grid || grid.length === 0) return null;
  const rows = grid.length;
  const cols = grid[0].length;
  if (cols === 0) return null;
  const colSums = [];
  for (let i=0; i<=rows; i++) {
    colSums.push(new Array(cols).fill(0));
  }
  for (let i=1; i<=rows; i++) {
    for (let j=0; j<cols; j++) {
      colSums[i][j] = colSums[i-1][j] + grid[i-1][j];
    }
  }

  fs.writeFileSync('./output2.txt', colSums.join('\n'));

  let maxPower = -Infinity;
  let px, py, dim;
  for (let i=1; i<=rows; i++) {
    for (let j=i; j<=rows; j++) {
      const dimension = j - i + 1;
      const array = [];
      for (let k=0; k<cols; k++) {
        array.push(colSums[j][k] - colSums[i-1][k]);
      }
      const { max, start: colStart } = maxArraySum(array, dimension);
      if (max > maxPower) {
        maxPower = max;
        py = i;
        px = colStart + 1;
        dim = dimension;
      }
    }
  }
  return {
    px,py,dim
  };
}

console.log(computeHighestPowerArea(grid, 3, 3));
console.time();
const {px, py, dim} = getHighestPowerArea(grid);
console.log([px, py, dim].join(','));
console.timeEnd();