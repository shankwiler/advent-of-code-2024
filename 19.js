/**
 * Part two uses a trie. I would have really had no idea what to do there if
 * I hadn't learned about that data structure in CS courses years ago. It runs
 * in < 10ms which was pretty amazing, even just the string.slice() operations
 * alone I thought would eat up a lot of time.
 */

// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const towels = new Set(lines.find((line) => line.includes(",")).split(", "));
  const patterns = lines.filter((line) => !line.includes(","));

  const dfs = (goal, index) => {
    if (index === goal.length) {
      return true;
    }
    for (let i = index + 1; i <= goal.length; i++) {
      if (towels.has(goal.slice(index, i))) {
        if (dfs(goal, i)) {
          return true;
        }
      }
    }
    return false;
  };

  let valid = 0;

  for (const pattern of patterns) {
    if (dfs(pattern, 0)) {
      valid++;
    }
  }

  return valid;
})();

// part two
(() => {
  const START = performance.now();
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const towels = new Set(lines.find((line) => line.includes(",")).split(", "));
  const patterns = lines.filter((line) => !line.includes(","));

  const trie = {};

  for (const towel of towels) {
    let pointer = trie;
    for (const char of towel) {
      if (!pointer[char]) {
        pointer[char] = {};
      }
      pointer = pointer[char];
    }
    pointer.TERMINAL = true;
  }

  const cache = {};

  const navigateTrie = (string) => {
    if (string.length === 0) {
      return 1;
    }
    const cached = cache[string];
    if (cached) {
      return cached;
    }

    let index = 0;
    let pointer = trie;
    let total = 0;
    while (pointer[string[index]] && index < string.length) {
      pointer = pointer[string[index]];
      index++;
      if (pointer.TERMINAL) {
        total += navigateTrie(string.slice(index));
      }
    }

    cache[string] = total;
    return total;
  };

  let total = 0;

  for (const pattern of patterns) {
    total += navigateTrie(pattern);
  }

  console.log("RUNTIME", performance.now() - START);
  return total;
})();
