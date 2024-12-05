// Tonight I tried competing, starting at 9:00 PT and rushing to finish.
// Part one I had a bunch of time eaten up because I misinterpreted
// "page number X must be printed at some point before page number Y" to mean
// that in every ordering, if Y is present then 1) X must also be present
// and 2) X must be before Y. But really it means if X and Y are present then
// X must be before Y. If I had read the examples I wouldn't have made that mistake.

// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const lessMap = {};

  let mids = 0;

  for (const line of lines) {
    if (line.includes("|")) {
      const [first, second] = line.split("|");
      lessMap[first] ??= [];
      lessMap[first].push(second);
    } else {
      const list = line.split(",");
      const seen = new Set();
      let good = true;
      for (const num of list) {
        for (const mustBeAfter of lessMap[num] ?? []) {
          if (seen.has(mustBeAfter)) {
            good = false;
          }
        }
        seen.add(num);
      }
      if (good) {
        mids += parseInt(list[Math.floor(list.length / 2)]);
      }
    }
  }
  return mids;
})();

// part two
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const lessMap = {};

  let mids = 0;

  for (const line of lines) {
    if (line.includes("|")) {
      const [first, second] = line.split("|");
      lessMap[first] ??= [];
      lessMap[first].push(second);
    } else {
      const list = line.split(",");
      const seen = new Set();
      let good = true;
      for (const num of list) {
        for (const mustBeAfter of lessMap[num] ?? []) {
          if (seen.has(mustBeAfter)) {
            good = false;
          }
        }
        seen.add(num);
      }
      if (!good) {
        const newList = list.sort((a, b) => {
          if ((lessMap[a] ?? []).includes(b)) {
            return -1;
          }
          if ((lessMap[b] ?? []).includes(a)) {
            return 1;
          }
          return 0;
        });
        mids += parseInt(newList[Math.floor(newList.length / 2)]);
      }
    }
  }
  return mids;
})();
