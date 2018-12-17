const { parseRecords } = require('./common');

const getMaximumMinutes = () => {

}

parseRecords().then(timeTable => {
  let guardId = 0;
  let maxTimes = 0;
  let maxMinute = 0;
  for (let [id, timesheet] of timeTable) {
    const map = new Map();
    timesheet.forEach((period) => {
      const [ start, end ] = period;
      for (let i=start; i<end; i++) {
        map.set(i, (map.get(i) || 0) + 1);
      }
    });
    let max = -1;
    let minute = -1;
    map.forEach((value, key) => {
      if (value > max) {
        max = value;
        minute = key;
      }
    });
    if (max > maxTimes) {
      guardId = +id;
      maxMinute = minute;
      maxTimes = max;
    }
  }
  console.log(guardId, maxMinute, guardId * maxMinute);
});