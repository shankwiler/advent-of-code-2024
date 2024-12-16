// Neither of the solutions I wrote for part tow feel very good. The first was my idea, and the
// second I wrote later on after googling for an idea on how to write a Dijkstra
// variant that finds *all* shortest paths.

// I might take a look at https://en.wikipedia.org/wiki/Shortest_path_problem#Algorithms
// later on to see if there's a better option.

// A failed approach I had also tried was like: one pass Dijkstra, once you find E, don't
// stop. Only stop once you've either exhausted all paths that are <= the path you found
// to E, or you've exhausted all paths to unvisited nodes. You can visit nodes multiple
// times only if the path was <= the path you've found previously. It's not clear to me
// that this was significantly worse compared to the other approaches, but I guess it would
// lead us to explore all sorts of dead-end options.

// As a side note, I wish JS had a heap or pqueue built-in. I just sorted the array
// on every iteration.

// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);
  const grid = Array.from(lines.map((line) => Array.from(line)));

  let start;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === "S") {
        start = [row, col];
      }
    }
  }

  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  const getCost = (oldDirection, newDirection) => {
    const oldDirectionIndex = directions.findIndex(
      (d) => oldDirection[0] === d[0] && oldDirection[1] === d[1]
    );
    const newDirectionIndex = directions.findIndex(
      (d) => newDirection[0] === d[0] && newDirection[1] === d[1]
    );
    const directionIndexes = [oldDirectionIndex, newDirectionIndex].sort(
      (a, b) => a - b
    );
    return (
      1000 *
      Math.min(
        directionIndexes[0] + directions.length - directionIndexes[1],
        directionIndexes[1] - directionIndexes[0]
      )
    );
  };

  let next = [[start, [0, 1], 0]];
  const visited = new Set();

  while (next.length !== 0) {
    next.sort(([, , distA], [, , distB]) => distB - distA);
    const [curr, direction, distance] = next.pop();
    const key = JSON.stringify([curr, direction]);
    if (visited.has(key)) {
      continue;
    }
    if (grid[curr[0]][curr[1]] === "E") {
      return distance;
    }
    visited.add(key);
    for (const [dr, dc] of directions) {
      const neighb = [curr[0] + dr, curr[1] + dc];
      const item = grid[neighb[0]]?.[neighb[1]];
      if (item && item !== "#") {
        next.push([
          neighb,
          [dr, dc],
          distance + getCost(direction, [dr, dc]) + 1,
        ]);
      }
    }
  }

  throw new Error("not found");
})();

// part two -- weird solution
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const grid = Array.from(lines.map((line) => Array.from(line)));

  let start;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === "S") {
        start = [row, col];
      }
    }
  }

  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  const getCost = (oldDirection, newDirection) => {
    const oldDirectionIndex = directions.findIndex(
      (d) => oldDirection[0] === d[0] && oldDirection[1] === d[1]
    );
    const newDirectionIndex = directions.findIndex(
      (d) => newDirection[0] === d[0] && newDirection[1] === d[1]
    );
    const directionIndexes = [oldDirectionIndex, newDirectionIndex].sort(
      (a, b) => a - b
    );
    return (
      1000 *
      Math.min(
        directionIndexes[0] + directions.length - directionIndexes[1],
        directionIndexes[1] - directionIndexes[0]
      )
    );
  };

  const initialSweep = () => {
    let next = [[start, [0, 1], 0, []]];
    const visited = new Set();

    while (next.length !== 0) {
      next.sort(([, , distA], [, , distB]) => distB - distA);
      const [curr, direction, distance, path] = next.pop();
      const key = JSON.stringify([curr, direction]);
      if (visited.has(key)) {
        continue;
      }
      if (grid[curr[0]][curr[1]] === "E") {
        const golden = {};
        for (const [entry, distance] of path) {
          golden[entry] = distance;
        }

        return [golden, distance];
      }
      visited.add(key);
      for (const [dr, dc] of directions) {
        const neighb = [curr[0] + dr, curr[1] + dc];
        const item = grid[neighb[0]]?.[neighb[1]];
        if (item && item !== "#") {
          next.push([
            neighb,
            [dr, dc],
            distance + getCost(direction, [dr, dc]) + 1,
            [...path, [key, distance]],
          ]);
        }
      }
    }

    return [golden, bestDistance];
  };

  const [golden, bestDistance] = initialSweep();

  if (golden.size === 0) {
    throw new Error("not found");
  }

  const getPathsToGolden = () => {
    // Dijkstra from every possible starting position to find all the different ways
    // you could get to either the end, OR (importantly) *another* cell on the "golden"
    // path we found earlier. ie
    // ...
    // .#.
    // ...
    // There are of course two ways to get from the bottom left to top right, so if both
    // the bottom left and top right were on the "golden" path found in the initial
    // sweep, we run another Dijkstra from the bottom left, and only stop once we get to E.
    // So long as the top right is closer than E (which it must be b/c it's on the golden
    // path from the initial sweep) we'll have passed by and recorded the paths to the top
    // right before finishing the full Dijkstra.
    const allStatesLeadingToGoldenPath = new Set();

    for (const startEntry of Object.keys(golden)) {
      const parsedStart = JSON.parse(startEntry);
      let next = [[parsedStart[0], parsedStart[1], golden[startEntry], []]];
      const visited = new Set();

      while (next.length !== 0) {
        next.sort(([, , distA], [, , distB]) => distB - distA);
        const [curr, direction, distance, path] = next.pop();
        const key = JSON.stringify([curr, direction]);
        if (
          parsedStart[0][0] === 11 &&
          parsedStart[0][1] === 1 &&
          curr[0] === 8 &&
          curr[1] === 3
        ) {
        }
        if (allStatesLeadingToGoldenPath.has(key)) {
          continue;
        }
        if (grid[curr[0]][curr[1]] === "E" && distance > bestDistance) {
          continue;
        }
        if (
          grid[curr[0]][curr[1]] === "E" ||
          (key in golden && key !== startEntry && golden[key] === distance)
        ) {
          for (const entry of path) {
            allStatesLeadingToGoldenPath.add(entry);
          }
        }
        if (visited.has(key)) {
          continue;
        }
        visited.add(key);
        for (const [dr, dc] of directions) {
          const neighb = [curr[0] + dr, curr[1] + dc];
          const item = grid[neighb[0]]?.[neighb[1]];
          if (item && item !== "#") {
            next.push([
              neighb,
              [dr, dc],
              distance + getCost(direction, [dr, dc]) + 1,
              [...path, key],
            ]);
          }
        }
      }
    }

    return allStatesLeadingToGoldenPath;
  };

  const pathsToGolden = getPathsToGolden();

  const uniqueCells = new Set(
    [...pathsToGolden].map((entry) => JSON.stringify(JSON.parse(entry)[0]))
  );

  return uniqueCells.size + 1; // E is not accounted for in the paths to golden, but is one of the best seats
})();

// part two -- another weird solution. Wrote the above and got the star so I didn't
// feel like cheating for googling "djikstra find all shortest paths," then took the
// idea from https://stackoverflow.com/a/2819450.
// This still feels pretty jank and I think is technically exponential time and space
// as every single location could have a route that flows through every other location.
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);
  const grid = Array.from(lines.map((line) => Array.from(line)));

  let start;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === "S") {
        start = [row, col];
      }
    }
  }

  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  const getCost = (oldDirection, newDirection) => {
    const oldDirectionIndex = directions.findIndex(
      (d) => oldDirection[0] === d[0] && oldDirection[1] === d[1]
    );
    const newDirectionIndex = directions.findIndex(
      (d) => newDirection[0] === d[0] && newDirection[1] === d[1]
    );
    const directionIndexes = [oldDirectionIndex, newDirectionIndex].sort(
      (a, b) => a - b
    );
    return (
      1000 *
      Math.min(
        directionIndexes[0] + directions.length - directionIndexes[1],
        directionIndexes[1] - directionIndexes[0]
      )
    );
  };

  let next = [[start, [0, 1], 0, []]];
  const visited = {};

  const pathsToEntry = {};

  while (next.length !== 0) {
    next.sort(([, , distA], [, , distB]) => distB - distA);
    const [curr, direction, distance, path] = next.pop();
    const key = JSON.stringify([curr, direction]);
    if (!(key in visited) || visited[key] === distance) {
      pathsToEntry[key] = path;
    }
    if (key in visited) {
      continue;
    }
    if (grid[curr[0]][curr[1]] === "E") {
      const allSeats = new Set();
      for (const entry of path) {
        const [entryLoc] = JSON.parse(entry);
        allSeats.add(JSON.stringify(entryLoc));
        for (const subEntry of pathsToEntry[entry]) {
          const [subEntryLoc] = JSON.parse(subEntry);
          allSeats.add(JSON.stringify(subEntryLoc));
        }
      }
      return allSeats.size + 1; // E not accounted for in the paths
    }
    visited[key] = distance;
    for (const [dr, dc] of directions) {
      const neighb = [curr[0] + dr, curr[1] + dc];
      const item = grid[neighb[0]]?.[neighb[1]];
      if (item && item !== "#") {
        next.push([
          neighb,
          [dr, dc],
          distance + getCost(direction, [dr, dc]) + 1,
          [...path, key],
        ]);
      }
    }
  }

  throw new Error("not found");
})();
