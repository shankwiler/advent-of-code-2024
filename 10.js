// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const grid = lines.map((line) =>
    Array.from(line).map((num) => parseInt(num))
  );

  const dfs = (curr, want, reachable) => {
    if (typeof grid[curr[0]]?.[curr[1]] !== "number") {
      return;
    }
    if (grid[curr[0]][curr[1]] !== want) {
      return;
    }
    const key = JSON.stringify(curr);
    if (want === 9) {
      reachable.add(key);
      return;
    }
    dfs([curr[0] - 1, curr[1]], want + 1, reachable);
    dfs([curr[0] + 1, curr[1]], want + 1, reachable);
    dfs([curr[0], curr[1] - 1], want + 1, reachable);
    dfs([curr[0], curr[1] + 1], want + 1, reachable);
  };

  let count = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const set = new Set();
      dfs([row, col], 0, set);
      count += set.size;
    }
  }

  return count;
})();

// part two
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const grid = lines.map((line) =>
    Array.from(line).map((num) => parseInt(num))
  );

  const dfs = (curr, want) => {
    if (typeof grid[curr[0]]?.[curr[1]] !== "number") {
      return 0;
    }
    if (grid[curr[0]][curr[1]] !== want) {
      return 0;
    }
    if (want === 9) {
      return 1;
    }
    return (
      dfs([curr[0] - 1, curr[1]], want + 1) +
      dfs([curr[0] + 1, curr[1]], want + 1) +
      dfs([curr[0], curr[1] - 1], want + 1) +
      dfs([curr[0], curr[1] + 1], want + 1)
    );
  };

  let count = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      count += dfs([row, col], 0);
    }
  }

  return count;
})();
