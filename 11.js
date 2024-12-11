// I think I could have utitlized the cache more intelligently on
// part two -- like if you have (num = 6, iteration = 10) in the cache
// that can help you find (num = 6, iteration = 1), but it wasn't
// necessary here.

// part one
(() => {
  const nums = document
    .querySelector("pre")
    .innerText.split(" ")
    .map((e) => parseInt(e));

  let curr = nums;
  for (let i = 0; i < 25; i++) {
    curr = curr
      .map((num) => {
        if (num === 0) {
          return 1;
        }
        const asString = num.toString();
        if (asString.length % 2 === 0) {
          const splitIndex = Math.round(asString.length / 2);
          return [
            parseInt(asString.slice(0, splitIndex)),
            parseInt(asString.slice(splitIndex)),
          ];
        }
        return num * 2024;
      })
      .flat();
  }
  return curr.length;
})();

// part two
(() => {
  const nums = document
    .querySelector("pre")
    .innerText.split(" ")
    .map((e) => parseInt(e));

  const BLINKS = 75;

  const cache = {};

  const getLength = (num, iteration) => {
    const key = `${num},${iteration}`;
    if (key in cache) {
      return cache[key];
    }
    const asString = num.toString();
    let result;
    if (iteration === BLINKS) {
      result = 1;
    } else if (num === 0) {
      result = getLength(1, iteration + 1);
    } else if (asString.length % 2 === 0) {
      const splitIndex = Math.round(asString.length / 2);
      result =
        getLength(parseInt(asString.slice(0, splitIndex)), iteration + 1) +
        getLength(parseInt(asString.slice(splitIndex)), iteration + 1);
    } else {
      result = getLength(num * 2024, iteration + 1);
    }
    cache[`${num},${iteration}`] = result;
    return result;
  };

  return nums.reduce((acc, num) => acc + getLength(num, 0), 0);
})();
