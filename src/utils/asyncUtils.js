import core from "../core.js";

export function runForSeconds(duration, callback) {
  runHelper(duration, callback);
}

function runHelper(durationLeft, callback) {
  if (durationLeft <= 0) {
    return;
  }

  callback(durationLeft);

  setTimeout(() => {
    runHelper(durationLeft - core.deltaTime / 1000, callback);
  }, core.deltaTime / 1000);
}
