const fs = require('fs');

const input = fs.readFileSync('./input.txt', 'utf-8');

const canReact = (char1, char2) => {
  // no check for whether the char is a letter
  return Math.abs(char1.charCodeAt() - char2.charCodeAt()) === 32;
}

const reactString = (string) => {
  let i = 0;
  let chars = [];
  while(i < string.length - 1) {
    const char1 = string[i];
    const char2 = string[i + 1];
    if (canReact(char1, char2)) {
      i += 2;
      while(chars.length && i <= string.length - 1) {
        if (canReact(chars[chars.length - 1], string[i])) {
          chars.pop();
          i++;
        } else {
          break;
        }
      }
    } else {
      chars.push(char1);
      i++;
    }
  }
  if (i === string.length - 1) chars.push(string[i]);
  return chars.join('');
}

// part 1
const result = reactString(input);
console.log(result.length);


const reactString2 = (string) => {
  const start = 'a'.charCodeAt();
  let min = Infinity;
  for (let k=0; k<26; k++) {
    const ignoreChar = String.fromCharCode(start + k);
    const ignoreCharUpper = ignoreChar.toUpperCase();
    let i = 0;
    let chars = [];
    const canIgnore = (char) => char === ignoreChar || char === ignoreCharUpper;
    while(i < string.length - 1) {
      let char1, char2;
      while (i < string.length - 1) {
        if (canIgnore(string[i])) i++;
        else {
          char1 = string[i];
          break;
        }
      }
      if (!char1) break;
      i++;
      while (i <= string.length - 1) {
        if (canIgnore(string[i])) i++;
        else {
          char2 = string[i];
          break;
        }
      }
      if (!char2) break;
      if (canReact(char1, char2)) {
        i++;
        while(chars.length && i <= string.length - 1) {
          if (canIgnore(string[i])) {
            i++;
            continue;
          }
          if (canReact(chars[chars.length - 1], string[i])) {
            chars.pop();
            i++;
          } else {
            break;
          }
        }
      } else {
        chars.push(char1);
      }
    }
    if (i === string.length - 1) chars.push(string[i]);
    min = Math.min(chars.length, min);
  }
 
  return min;
}

console.log(reactString2(input));