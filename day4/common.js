const { readFile } = require('../util');
const fs = require('fs');

const recordRegexp = /^\[(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})\]\s+(.*)$/;

const shiftRegexp = /^Guard #(\d+)/;

const sleepStr = 'falls asleep';

const wakeUpStr = 'wakes up';

const extractInfo = (record) => {
  const matches = record.match(recordRegexp);
  if (!matches) return null;
  const [, dateStr, info] = matches;
  const date = new Date(dateStr);
  let type;
  let shiftMatches;
  let id;
  if ((shiftMatches = info.match(shiftRegexp))) {
    id = shiftMatches[1];
    type = 'shift';
  } else if (sleepStr === info) {
    type = 'sleep';
  } else if (wakeUpStr === info) {
    type = 'wake';
  }
  if (!type) return null;
  return {
    id,
    type,
    date,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes()
  };
};

const parseRecords = (records) => {
  const guardTimeTable = new Map();
  let currGuardTimeSheet = [];
  let currId;
  let lastType;
  let startMinute;

  const addTimeSheet = (id, timesheet) => {
    if (!guardTimeTable.has(id)) {
      guardTimeTable.set(id, []);
    }
    const guardTimeSheet = guardTimeTable.get(id);
    guardTimeSheet.push(...timesheet);
  }

  for (let record of records) {
    const info = extractInfo(record);
    if (info.type === 'shift') {
      if (currId != null) {
        if (lastType === 'sleep') {
          currGuardTimeSheet.push([startMinute, 59]);
        }
        addTimeSheet(currId, currGuardTimeSheet);
      }
      currGuardTimeSheet = [];
      currId = info.id;
    } else if (info.type === 'sleep') {
      lastType = 'sleep';
    } else if (info.type === 'wake') {
      if (lastType === 'sleep') {
        currGuardTimeSheet.push([startMinute, info.minute]);
      }
    } else continue;
    lastType = info.type;
    startMinute = info.type === 'shift' ? 0 : info.minute;
  }
  
  // finish last record
  if (lastType === 'sleep') {
    currGuardTimeSheet.push([startMinute, 60]);
  }
  addTimeSheet(currId, currGuardTimeSheet);

  return guardTimeTable;
};

exports.parseRecords = () => {
  const records = [];
  return readFile('./input.txt', (line) => {
    records.push(line);
  })
  .then(() => {
    records.sort();
    fs.writeFileSync('./output.txt', records.join('\n'));
    const timeTable = parseRecords(records);
    return timeTable;
  });
}
