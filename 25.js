// part one -- part two is a freebie it turns out!
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const locks = [];
  const keys = [];
  
  for (let i = 0; i < lines.length; i += 7) {
    const counts = [];
    for (let column = 0; column < lines[i].length; column++) {
      let count = 0;
      for (let j = i + 1; j < i + 6; j++) {
        if (lines[j][column] === '#') {
          count++;
        }
      }
      counts.push(count);
    }
    if (Array.from(lines[i]).every(v => v === '#')) {
      locks.push(counts);
    } else {
      keys.push(counts);
    }
  }

  let matches = 0;

  // I think there's an O(nlogn) solution: sort the keys, then
  // iterate through the locks, then binary search the keys to find
  // the range which can fit in the first column, then of those
  // binary search the range which can fit in the second column, and
  // so on.

  // But the input length is small and I'm eager to get my last stars
  // and call it, so this is it for now!

  for (const lock of locks) {
    for (const key of keys) {
      let good = true;
      for (let i = 0; i < lock.length; i++) {
        if (lock[i] + key[i] > 5) {
          good = false;
        }
      }
      if (good) {
        matches++;
      }
    }
  }

  return matches;
})()