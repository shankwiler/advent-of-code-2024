// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);
  const minSave = 100;

  const grid = lines.map((line) => Array.from(line));

  let start;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === "S") {
        start = [row, col];
      }
    }
  }

  const dirs = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  const seen = new Set(JSON.stringify(start));
  const queue = [start];
  const prevs = {};
  let index = 0;
  let path;
  while (index < queue.length) {
    const curr = queue[index];
    if (grid[curr[0]][curr[1]] === "E") {
      path = [];
      let step = curr;
      while (step) {
        path.push(step);
        step = prevs[JSON.stringify(step)];
      }
      path.reverse();
      break;
    }
    seen.add(JSON.stringify(curr));
    index++;
    for (const [dr, dc] of dirs) {
      const other = [curr[0] + dr, curr[1] + dc];
      const otherKey = JSON.stringify(other);
      if (
        !seen.has(otherKey) &&
        [".", "E"].includes(grid[other[0]]?.[other[1]])
      ) {
        queue.push(other);
        prevs[otherKey] = curr;
        seen.add(otherKey);
      }
    }
  }

  if (!path) {
    throw new Error("not found");
  }

  const distance = Object.fromEntries(
    path.map((point, i) => [JSON.stringify(point), i])
  );

  let total = 0;
  let saves = {};

  for (let i = 0; i < path.length; i++) {
    const cell = path[i];
    const dist = distance[JSON.stringify(cell)];
    for (const [dr, dc] of dirs) {
      if (grid[cell[0] + dr]?.[cell[1] + dc] === "#") {
        const other = [cell[0] + dr * 2, cell[1] + dc * 2];
        const otherDist = distance[JSON.stringify(other)];
        const ifShortcut = otherDist - dist - 2;
        if (ifShortcut >= minSave) {
          total++;
          saves[ifShortcut] ??= 0;
          saves[ifShortcut]++;
        }
      }
    }
  }

  return [total, saves];
})();

// part two - technically O(N). Somehow slower than the less clever solution
// that I added below this one.
(() => {
  const START = performance.now();
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);
  const minSave = 100;

  const grid = lines.map((line) => Array.from(line));

  let start;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === "S") {
        start = [row, col];
      }
    }
  }

  const dirs = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  const seen = new Set(JSON.stringify(start));
  const queue = [start];
  const prevs = {};
  let index = 0;
  let path;
  while (index < queue.length) {
    const curr = queue[index];
    if (grid[curr[0]][curr[1]] === "E") {
      path = [];
      let step = curr;
      while (step) {
        path.push(step);
        step = prevs[JSON.stringify(step)];
      }
      path.reverse();
      break;
    }
    seen.add(JSON.stringify(curr));
    index++;
    for (const [dr, dc] of dirs) {
      const other = [curr[0] + dr, curr[1] + dc];
      const otherKey = JSON.stringify(other);
      if (
        !seen.has(otherKey) &&
        [".", "E"].includes(grid[other[0]]?.[other[1]])
      ) {
        queue.push(other);
        prevs[otherKey] = curr;
        seen.add(otherKey);
      }
    }
  }

  if (!path) {
    throw new Error("not found");
  }

  const distances = Array(grid.length)
    .fill(null)
    .map(() => Array(grid[0].length).fill(null));
  for (let i = 0; i < path.length; i++) {
    const [row, col] = path[i];
    distances[row][col] = i;
  }

  let total = 0;

  for (let i = 0; i < path.length; i++) {
    const cell = path[i];
    const dist = i;
    for (let downs = -20; downs <= 20; downs++) {
      const maxRights = 20 - Math.abs(downs);
      for (let rights = -maxRights; rights <= maxRights; rights++) {
        const other = [cell[0] + downs, cell[1] + rights];
        const otherDist = distances[other[0]]?.[other[1]];
        if (otherDist && otherDist > dist) {
          const oldDist = otherDist - dist;
          const newDist = Math.abs(downs) + Math.abs(rights);
          if (oldDist - newDist >= minSave) {
            total++;
          }
        }
      }
    }
  }

  console.log("runtime", performance.now() - START);

  return total;
})();

// part two - O(N^2)
(() => {
  const START = performance.now();
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);
  const minSave = 100;

  const grid = lines.map((line) => Array.from(line));

  let start;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === "S") {
        start = [row, col];
      }
    }
  }

  const dirs = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  const seen = new Set(JSON.stringify(start));
  const queue = [start];
  const prevs = {};
  let index = 0;
  let path;
  while (index < queue.length) {
    const curr = queue[index];
    if (grid[curr[0]][curr[1]] === "E") {
      path = [];
      let step = curr;
      while (step) {
        path.push(step);
        step = prevs[JSON.stringify(step)];
      }
      path.reverse();
      break;
    }
    seen.add(JSON.stringify(curr));
    index++;
    for (const [dr, dc] of dirs) {
      const other = [curr[0] + dr, curr[1] + dc];
      const otherKey = JSON.stringify(other);
      if (
        !seen.has(otherKey) &&
        [".", "E"].includes(grid[other[0]]?.[other[1]])
      ) {
        queue.push(other);
        prevs[otherKey] = curr;
        seen.add(otherKey);
      }
    }
  }

  if (!path) {
    throw new Error("not found");
  }

  let total = 0;

  for (let i = 0; i < path.length; i++) {
    for (let j = i + minSave; j < path.length; j++) {
      const rowDist = Math.abs(path[j][0] - path[i][0]);
      const colDist = Math.abs(path[j][1] - path[i][1]);
      const newDist = rowDist + colDist;
      const prevDist = j - i;
      if (newDist <= 20 && prevDist - newDist >= minSave) {
        total++;
      }
    }
  }

  console.log("runtime", performance.now() - START);
  return total;
})();
