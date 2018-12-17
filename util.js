const readline = require('readline');
const fs = require('fs');

exports.readFile = (filename, readLine) => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(filename),
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      readLine(line, rl);
    });

    rl.on('close', () => {
      resolve();
    });
  });
};

exports.find = (arr, value) => {
  const len = arr.length;
  let start = 0;
  let end = len - 1;
  while (start <= end) {
    let mid = Math.floor(start + (end - start) / 2);
    if (arr[mid] > value) end = mid - 1;
    else if (arr[mid] < value) start = mid + 1;
    else return mid;
  }
  return -1;
}