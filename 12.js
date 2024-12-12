// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n").filter(e => !!e);

  const grid = lines.map(line => Array.from(line));

  const done = new Set();

  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  const dfs = (row, col, want, visited) => {
    const key = JSON.stringify([row, col]);

    if (visited.has(key) || done.has(key) || grid[row]?.[col] !== want) {
      return;
    }

    visited.add(key);
    for (const [dr, dc] of directions) {
      dfs(row + dr, col + dc, want, visited);
    }
  };

  const groups = [];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const group = new Set();
      dfs(row, col, grid[row][col], group);
      if (group.size !== 0) {
        groups.push(group);
      }

      for (const entry of [...group]) {
        done.add(entry);
      }
    }
  }

  const getEdges = (group) => {
    const edges = new Set();
    for (const entryKey of group) {
      const [row, col] = JSON.parse(entryKey);

      for (const [dr, dc] of directions) {
        if (grid[row + dr]?.[col + dc] !== grid[row][col]) {
          edges.add(JSON.stringify([row, col, dr, dc]));
        }
      }
    }

    return edges;
  };

  let total = 0;

  for (const group of groups) {
    const edges = getEdges([...group]);
    const area = group.size;
    const perimeter = edges.size;

    total += area * perimeter;
  }

  return total;
})();

// part two
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n").filter(e => !!e);

  const grid = lines.map(line => Array.from(line));

  const done = new Set();

  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  const dfs = (row, col, want, visited) => {
    const key = JSON.stringify([row, col]);

    if (visited.has(key) || done.has(key) || grid[row]?.[col] !== want) {
      return;
    }

    visited.add(key);
    for (const [dr, dc] of directions) {
      dfs(row + dr, col + dc, want, visited);
    }
  };

  const groups = [];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const group = new Set();
      dfs(row, col, grid[row][col], group);
      if (group.size !== 0) {
        groups.push(group);
      }

      for (const entry of [...group]) {
        done.add(entry);
      }
    }
  }

  const getEdges = (group) => {
    const edges = new Set();
    for (const entryKey of group) {
      const [row, col] = JSON.parse(entryKey);

      for (const [dr, dc] of directions) {
        if (grid[row + dr]?.[col + dc] !== grid[row][col]) {
          edges.add(JSON.stringify([row, col, dr, dc]));
        }
      }
    }

    return edges;
  };

  const getSides = (edges) => {
    // for each edge:
    //   if the edge is "above" or "below" a cell, then we move left and right
    //   to find other cells on the same "side"
    //   if the edge is "left" or "right" of a cell, then we move up and down
    //   to find other cells on the same "side"
    let sides = 0;
    const visited = new Set();
    for (const edgeKey of [...edges]) {
      if (visited.has(edgeKey)) {
        continue;
      }
      const [row, col, dr, dc] = JSON.parse(edgeKey);
      sides++;
      visited.add(edgeKey);
      if (dr !== 0) {
        let curr = [row, col - 1, dr, dc];
        while (edges.has(JSON.stringify(curr))) {
          visited.add(JSON.stringify(curr));
          curr = [curr[0], curr[1] - 1, dr, dc];
        }
        curr = [row, col + 1, dr, dc];
        while (edges.has(JSON.stringify(curr))) {
          visited.add(JSON.stringify(curr));
          curr = [curr[0], curr[1] + 1, dr, dc];
        }
      } else if (dc !== 0) {
        let curr = [row - 1, col, dr, dc];
        while (edges.has(JSON.stringify(curr))) {
          visited.add(JSON.stringify(curr));
          curr = [curr[0] - 1, col, dr, dc];
        }
        curr = [row + 1, col, dr, dc];
        while (edges.has(JSON.stringify(curr))) {
          visited.add(JSON.stringify(curr));
          curr = [curr[0] + 1, col, dr, dc];
        }
      }
    }
    return sides;
  };

  let total = 0;

  for (const group of groups) {
    const edges = getEdges([...group]);
    const area = group.size;
    const sides = getSides(edges);

    total += area * sides;
  }

  return total;
})();
