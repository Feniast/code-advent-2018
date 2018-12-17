const { parseRecords } = require('./common');

const computeMaxSleepGuard = (timeTable) => {
  let max = 0;
  let guardId = null;
  for (let [id, timesheet] of timeTable) {
    const sleepTime = timesheet.reduce((v, n) => {
      return v + n[1] - n[0];
    }, 0);
    if (sleepTime > max) {
      guardId = id;
      max = sleepTime;
    }
  }

  return {
    id: guardId,
    time: max
  };
}

const getMaximumSleepMinute = (timesheet) => {
  const map = new Map();
  timesheet.forEach((period) => {
    const [start, end] = period;
    for (let i=start; i<end; i++) {
      map.set(i, (map.get(i) || 0) + 1);
    }
  });
  let minute = -1;
  let sleepTimes = 0;
  for (let [k, v] of map) {
    if (v > sleepTimes) {
      minute = k;
      sleepTimes = v;
    }
  }
  return minute;
}

parseRecords().then((timeTable) => {
  const { id } = computeMaxSleepGuard(timeTable);
  const timesheet = timeTable.get(id);
  const minute = getMaximumSleepMinute(timesheet);
  console.log((+id) * minute);
});