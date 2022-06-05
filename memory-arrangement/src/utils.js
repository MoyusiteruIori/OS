export default function toPercent(point) {
  var str = Number(point * 100).toFixed(1);
  str += "%";
  return str;
}

global.runningFlag = false;
global.isPaused = false;
global.basicSpeed = 500;
