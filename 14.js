// Part two I thought was a bit unfair, the directions were so unclear.
// Would have been nice to see in the prompt specifically what the tree
// should look like. But maybe that's part of the fun, or maybe it was
// an attempt to throw off LLMs. My approach was to find a diagonal of
// sufficient length, because any Christmas tree drawing would have
// to include a diagonal.

// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const robots = lines.map((line) => {
    const [, colRaw, rowRaw, vColRaw, vRowRaw] = line.match(
      /p=(\d+),(\d+) v=((?:-|\d)+),((?:-|\d)+)/
    );

    return {
      col: parseInt(colRaw),
      row: parseInt(rowRaw),
      vCol: parseInt(vColRaw),
      vRow: parseInt(vRowRaw),
    };
  });

  const cols = 101;
  const rows = 103;
  const times = 100;

  const incr = (place, velocity, max) => {
    const newPlace = place + velocity;
    if (newPlace >= max) {
      return newPlace % max;
    }
    if (newPlace < 0) {
      return max + newPlace;
    }
    return newPlace;
  };

  for (let i = 0; i < times; i++) {
    for (const robot of robots) {
      robot.col = incr(robot.col, robot.vCol, cols);
      robot.row = incr(robot.row, robot.vRow, rows);
    }
  }

  const topLeft = robots.filter(
    (r) => r.row < Math.floor(rows / 2) && r.col < Math.floor(cols / 2)
  ).length;
  const topRight = robots.filter(
    (r) => r.row < Math.floor(rows / 2) && r.col > Math.floor(cols / 2)
  ).length;
  const bottomLeft = robots.filter(
    (r) => r.row > Math.floor(rows / 2) && r.col < Math.floor(cols / 2)
  ).length;
  const bottomRight = robots.filter(
    (r) => r.row > Math.floor(rows / 2) && r.col > Math.floor(cols / 2)
  ).length;

  return topLeft * topRight * bottomLeft * bottomRight;
})();

// part two
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const robots = lines.map((line) => {
    const [, colRaw, rowRaw, vColRaw, vRowRaw] = line.match(
      /p=(\d+),(\d+) v=((?:-|\d)+),((?:-|\d)+)/
    );

    return {
      col: parseInt(colRaw),
      row: parseInt(rowRaw),
      vCol: parseInt(vColRaw),
      vRow: parseInt(vRowRaw),
    };
  });

  const cols = 101;
  const rows = 103;
  const times = 20_000;

  const incr = (place, velocity, max) => {
    const newPlace = place + velocity;
    if (newPlace >= max) {
      return newPlace % max;
    }
    if (newPlace < 0) {
      return max + newPlace;
    }
    return newPlace;
  };

  const isTree = (robots) => {
    const getKey = (robot) => `${robot.row},${robot.col}`;
    const set = new Set(robots.map((robot) => getKey(robot)));
    const hasDiag = robots.some((robot) => {
      const desiredLength = 10;
      let good = true;
      for (let i = 1; i <= desiredLength; i++) {
        if (!set.has(getKey({ row: robot.row - i, col: robot.col + i }))) {
          good = false;
        }
      }
      return good;
    });
    return hasDiag;
  };

  const getSnapshot = (robots) => {
    const grid = Array(103)
      .fill(null)
      .map(() => Array(101).fill("."));

    for (const robot of robots) {
      grid[robot.row][robot.col] = "#";
    }
    return grid.map((line) => line.join("")).join("\n");
  };

  const seen = {};

  for (let i = 0; i < times; i++) {
    const snapshot = getSnapshot(robots);
    if (isTree(robots)) {
      console.log(snapshot);
      return i;
    }
    if (snapshot in seen) {
      throw new Error(`Looped: ${seen[snapshot]}, ${i}`);
    }
    seen[snapshot] = i;
    for (const robot of robots) {
      robot.col = incr(robot.col, robot.vCol, cols);
      robot.row = incr(robot.row, robot.vRow, rows);
    }
  }
  throw new Error("not found");
})();
