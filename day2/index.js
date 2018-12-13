const fs = require('fs');
const readline = require('readline');

let twoCount = 0;
let threeCount = 0;

const countChars = (line) => {
  const map = {};
  for (let c of line) {
    map[c] = (map[c] || 0) + 1; 
  }
  let foundTwo = false;
  let foundThree = false;
  for (let v of Object.values(map)) {
    if (v === 2 && !foundTwo) { foundTwo = true; }
    if (v === 3 && !foundThree) foundThree = true;
    if (foundTwo && foundThree) break;
  }
  if (foundTwo) twoCount++;
  if (foundThree) threeCount++;
}

const rl = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  countChars(line);
}).on('close', () => {
  console.log(twoCount, threeCount, twoCount * threeCount);
});