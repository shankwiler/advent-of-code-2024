/**
 * I included two solutions for part two. One uses a union-find approach, and
 * it runs in 11ms. The other uses a brute force, trying out BFS after each
 * byte "falls". The naive solution finishes in ~6800ms.
 */

// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const size = 71;

  const numFall = 1024;

  const points = new Set(
    lines
      .map((line) => {
        const [col, row] = line.split(",").map((e) => parseInt(e));

        return JSON.stringify([row, col]);
      })
      .slice(0, numFall)
  );

  const seen = new Set(); // should add start w/e
  const queue = [[0, 0, 0, null]];
  let index = 0;

  while (index < queue.length) {
    const curr = queue[index];
    if (curr[0] === size - 1 && curr[1] === size - 1) {
      return curr[2];
    }
    index++;
    for (const [dr, dc] of [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ]) {
      const other = [curr[0] + dr, curr[1] + dc, curr[2] + 1];
      const otherKey = JSON.stringify(other.slice(0, 2));

      if (
        seen.has(otherKey) ||
        points.has(otherKey) ||
        other[0] < 0 ||
        other[0] >= size ||
        other[1] < 0 ||
        other[1] >= size
      ) {
        continue;
      }

      seen.add(otherKey);
      queue.push(other);
    }
  }

  throw new Error("not found");
})();

// part two
(() => {
  const START = performance.now();
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const size = 71;

  const orderedPoints = lines.map((line) => {
    const [col, row] = line.split(",").map((e) => parseInt(e));

    return [row, col];
  });

  const points = new Set(orderedPoints.map((point) => JSON.stringify(point)));

  const unionFind = {};

  const find = (key) => {
    if (unionFind[key].parent === key) {
      return unionFind[key];
    }
    const parent = find(unionFind[key].parent);
    unionFind[key].parent = parent.parent;
    return parent;
  };

  const union = (key1, key2) => {
    const [small, large] = [find(key1), find(key2)].sort(
      (p1, p2) => p1.size - p2.size
    );

    if (small.parent === large.parent) {
      return;
    }

    small.parent = large.parent;
    large.size += small.size;
  };

  const dirs = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const key = JSON.stringify([row, col]);
      if (key in unionFind || points.has(key)) {
        continue;
      }

      unionFind[key] = { parent: key, size: 1 };

      const seen = new Set([key]);
      let index = 0;
      const queue = [[row, col]];

      while (index < queue.length) {
        const curr = queue[index];
        index++;
        for (const [dr, dc] of dirs) {
          const other = [curr[0] + dr, curr[1] + dc];
          const otherKey = JSON.stringify(other.slice(0, 2));

          if (
            seen.has(otherKey) ||
            points.has(otherKey) ||
            other[0] < 0 ||
            other[0] >= size ||
            other[1] < 0 ||
            other[1] >= size
          ) {
            continue;
          }

          seen.add(otherKey);
          queue.push(other);
        }
      }

      for (const nearby of [...seen]) {
        unionFind[nearby] = { parent: nearby, size: 1 };
        union(key, nearby);
      }
    }
  }

  // The idea here is that we work backwards throug the points, finding the
  // first case of (0, 0) being in the same "set" as (size - 1, size -1).

  const startKey = JSON.stringify([0, 0]);
  const endKey = JSON.stringify([size - 1, size - 1]);

  const pointsCopy = new Set([...points]);
  for (const [row, col] of [...orderedPoints].reverse()) {
    const key = JSON.stringify([row, col]);
    pointsCopy.delete(key);
    unionFind[key] = { parent: key, size: 1 };
    for (const [dr, dc] of dirs) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
        continue;
      }
      const otherKey = JSON.stringify([row + dr, col + dc]);
      if (!pointsCopy.has(otherKey)) {
        union(key, otherKey);
      }
    }
    if (
      // if the start or end key has a byte on top, it won't be in union find
      // yet. it eventually will be as we pull away the bytes, working backwards
      // through the list.
      startKey in unionFind &&
      endKey in unionFind &&
      find(startKey).parent === find(endKey).parent
    ) {
      console.log("RUNTIME", performance.now() - START);
      // answer expected as col,row *not* row,col
      return `${col},${row}`;
    }
  }
})();

// naive part two solution
(() => {
  const START = performance.now();
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const size = 71;

  const orderedPoints = lines.map((line) => {
    const [col, row] = line.split(",").map((e) => parseInt(e));

    return [row, col];
  });

  // const points = new Set(orderedPoints.map((point) => JSON.stringify(point)));

  const bfs = (points) => {
    const seen = new Set(); // should add start w/e
    const queue = [[0, 0]];
    let index = 0;

    while (index < queue.length) {
      const curr = queue[index];
      if (curr[0] === size - 1 && curr[1] === size - 1) {
        return true;
      }
      index++;
      for (const [dr, dc] of [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1],
      ]) {
        const other = [curr[0] + dr, curr[1] + dc];
        const otherKey = JSON.stringify(other.slice(0, 2));

        if (
          seen.has(otherKey) ||
          points.has(otherKey) ||
          other[0] < 0 ||
          other[0] >= size ||
          other[1] < 0 ||
          other[1] >= size
        ) {
          continue;
        }

        seen.add(otherKey);
        queue.push(other);
      }
    }

    return false;
  };

  const pointsCopy = new Set();
  for (const point of orderedPoints) {
    const key = JSON.stringify(point);
    pointsCopy.add(key);
    if (!bfs(pointsCopy)) {
      console.log("RUNTIME", performance.now() - START);
      // answer expected as col,row *not* row,col
      return `${point[1]},${point[0]}`;
    }
  }
})();

// helper function for debugging
(() => {
  const getDebugGrid = (ps = points) => {
    const tmp = Array(size)
      .fill(null)
      .map(() => Array(size).fill("."));
    for (const point of ps) {
      const p = JSON.parse(point);
      tmp[p[0]][p[1]] = "#";
    }
    return tmp.map((line) => line.join("")).join("\n");
  };
})();
