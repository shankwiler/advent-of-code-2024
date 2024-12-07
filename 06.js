// Spent probably two hours thinking about how to solve part 2, until
// I decided to just try the brute force solution. It took around 4 seconds to run,
// so I should have just done that from the start. Not sure you can do better than
// O((num positions) ^ 2). The thing is it's really more like O((num positions) * (num on path from part one))
// which is significantly smaller.
// Someone posted on reddit about their idea for linear runtime, but didn't actually
// try coding it up so I'm not so sure.

// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const grid = lines.map((line) => Array.from(line));

  let curr;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === "^") {
        curr = [row, col];
      }
    }
  }

  const visited = new Set();
  let direction = [-1, 0];

  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  while (grid[curr[0]]?.[curr[1]]) {
    visited.add(JSON.stringify(curr));
    const ahead = [curr[0] + direction[0], curr[1] + direction[1]];
    if (grid[ahead[0]]?.[ahead[1]] === "#") {
      direction =
        directions[
          (directions.findIndex(
            (d) => d[0] === direction[0] && d[1] === direction[1]
          ) +
            1) %
            directions.length
        ];
    } else {
      curr = ahead;
    }
  }

  return visited.size;
})();

// part two
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const grid = lines.map((line) => Array.from(line));

  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  const getStart = () => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (grid[row][col] === "^") {
          return [row, col];
        }
      }
    }
  };

  const traverse = (row, col, direction, visited) => {
    if (!grid[row]?.[col]) {
      return false;
    }
    const key = JSON.stringify([row, col, direction]);
    if (visited.has(key)) {
      return true;
    }
    visited.add(key);
    const ahead = [row + direction[0], col + direction[1]];
    const directionIfObstacle =
      directions[
        (directions.findIndex(
          (d) => d[0] === direction[0] && d[1] === direction[1]
        ) +
          1) %
          directions.length
      ];
    if (grid[ahead[0]]?.[ahead[1]] === "#") {
      return traverse(row, col, directionIfObstacle, visited);
    }
    return traverse(ahead[0], ahead[1], direction, visited);
  };

  const start = getStart();
  const visitedSituations = new Set();
  traverse(start[0], start[1], [-1, 0], visitedSituations);

  const visitedPositions = [
    ...new Set(
      [...visitedSituations].map((key) =>
        JSON.stringify(JSON.parse(key).slice(0, 2))
      )
    ),
  ].map((key) => JSON.parse(key));

  let count = 0;

  for (const position of visitedPositions) {
    if (position[0] === start[0] && position[1] === start[1]) {
      continue;
    }
    grid[position[0]][position[1]] = "#";
    if (traverse(start[0], start[1], [-1, 0], new Set())) {
      count++;
    }
    grid[position[0]][position[1]] = ".";
  }

  return count;
})();
