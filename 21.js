// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const numericGrid = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    [".", "0", "A"],
  ];

  const directionalGrid = [
    [".", "^", "A"],
    ["<", "v", ">"],
  ];

  const gridToPosMap = (grid) => {
    const map = {};
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        map[grid[row][col]] = [row, col];
      }
    }
    return map;
  };

  const numericToPos = gridToPosMap(numericGrid);
  const directionalToPos = gridToPosMap(directionalGrid);

  const charToDir = { "^": [-1, 0], ">": [0, 1], v: [1, 0], "<": [0, -1] };
  const dirs = Object.values(charToDir);

  const getPressResult = (curr) => {
    const firstNonAIndex = curr.findIndex((button) => button !== "A");
    if (firstNonAIndex === -1 || firstNonAIndex === curr.length - 1) {
      return null;
    }
    const directionChar = curr[firstNonAIndex];
    const [dr, dc] = charToDir[directionChar];
    const afterAMap =
      firstNonAIndex + 1 === curr.length - 1 ? numericToPos : directionalToPos;
    const afterAGrid =
      firstNonAIndex + 1 === curr.length - 1 ? numericGrid : directionalGrid;
    const posAfterA = afterAMap[curr[firstNonAIndex + 1]];
    const newChar = afterAGrid[posAfterA[0] + dr]?.[posAfterA[1] + dc];
    if (newChar && newChar !== ".") {
      return [
        ...curr.slice(0, firstNonAIndex + 1),
        newChar,
        ...curr.slice(firstNonAIndex + 2),
      ];
    }
    return null;
  };

  const getNearby = (curr) => {
    const nearby = [];
    const currPos = directionalToPos[curr[0]];

    // if you move first robot
    for (const [dr, dc] of dirs) {
      const other = directionalGrid[currPos[0] + dr]?.[currPos[1] + dc];
      if (other && other !== ".") {
        nearby.push([other, curr[1], curr[2]]);
      }
    }

    // if you tell first robot to press
    const ifPress = getPressResult(curr);

    if (ifPress) {
      nearby.push(ifPress);
    }

    return nearby;
  };

  let totalComplexity = 0;

  for (const line of lines) {
    let curr = ["A", "A", "A", 0];
    let totalDist = 0;
    for (const goal of line) {
      let found = false;
      const queue = [curr];
      const seen = new Set([JSON.stringify(curr.slice(-1))]);
      let index = 0;
      while (index < queue.length) {
        curr = queue[index];
        index++;
        if (["A", "A", goal].every((e, i) => e === curr[i])) {
          found = true;
          break;
        }
        for (const nearby of getNearby(curr.slice(0, -1))) {
          const key = JSON.stringify(nearby);
          if (!seen.has(key)) {
            queue.push([...nearby, curr.slice(-1)[0] + 1]);
            seen.add(key);
          }
        }
      }
      if (!found) {
        throw new Error("not-reachable");
      }
      totalDist += curr.slice(-1)[0] + 1; // plus one for final press!
      curr = [...curr.slice(0, -1), 0];
    }
    totalComplexity += totalDist * parseInt(line.replace("A", ""));
  }

  return totalComplexity;
})();

/*

figure out "natural break poionts" when a layer goes from A then does stuff then back to A
figure out how long that takes and what it's doing in the meantime

The thing that's cache-able is:
  - Given where I am now, assuming all the layers above me are A, how hard will it be to get
    one to the right, left, up, or down, with all the layers above me pointing to A again.
  - This is useful, because it tells me how hard it will be to get the layer below me to be in
    a position to move
  - To see what I mean, run aoc-21-checker.js and look
    at the path followed. You'll see a predictable number of steps between AAA> and AAA^
    for example -- 21.
  - Note: aoc-21-checker.js basically is the part one solution expanded to support arbitrary
    numbers of layers. Because it's a giant BFS it only works up to ~8 layers, but it was helpful
    for debugging. Adding that code down below

Specifically, the question we want our function to return the answer to is:
  - Given my position, and the position of the layer above me, how hard is it to move the
    layer below me (left, right, up, down)?
  - It's assumed that at the time of asking this question, the layer two above me and up
    all are pointing to A.
  - In order for the layer below me to move, the layer above me on up will need to be at A.
*/

// part two
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);
  const NUM_LAYERS = 25;

  const numericGrid = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    [".", "0", "A"],
  ];

  const directionalGrid = [
    [".", "^", "A"],
    ["<", "v", ">"],
  ];

  const gridToPosMap = (grid) => {
    const map = {};
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        map[grid[row][col]] = [row, col];
      }
    }
    return map;
  };

  const numericToPos = gridToPosMap(numericGrid);
  const directionalToPos = gridToPosMap(directionalGrid);

  const charToDir = { "^": [-1, 0], ">": [0, 1], v: [1, 0], "<": [0, -1] };
  const chars = [...Object.keys(charToDir), "A"];

  const cache = {};

  // There's sort of an off by one error here. "robotsAbove" is really more like
  // "robots above the bottom (second) layer including the one above (first in this
  // call)."
  // Definitely could make the code clearer.
  const search = (first, second, goal, robotsAbove, useNumericGrid = false) => {
    if (robotsAbove === -1) {
      return 0;
    }
    const searchKey = JSON.stringify([first, second, goal, robotsAbove]);
    if (searchKey in cache) {
      return cache[searchKey];
    }
    const getNearby = (curr) => {
      const nearby = [];

      for (const char of chars) {
        const cost = search("A", curr[0], char, robotsAbove - 1);
        nearby.push([char, curr[1], curr[2] + cost]);
      }

      const deltaIfPush = charToDir[curr[0]];
      if (deltaIfPush) {
        const [dr, dc] = deltaIfPush;
        const toPosMap = useNumericGrid ? numericToPos : directionalToPos;
        const grid = useNumericGrid ? numericGrid : directionalGrid;
        const secondPos = toPosMap[curr[1]];
        const otherPos = [secondPos[0] + dr, secondPos[1] + dc];
        const otherKey = grid[otherPos[0]]?.[otherPos[1]];
        if (otherKey && otherKey !== ".") {
          nearby.push([curr[0], otherKey, curr[2] + 1]);
        }
      }

      return nearby;
    };

    const start = [first, second, 0];
    const seen = new Set();
    const queue = [start];
    while (queue.length > 0) {
      queue.sort((a, b) => b[2] - a[2]);
      const curr = queue.pop();
      const key = JSON.stringify(curr.slice(0, 2));
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      if (curr[0] === "A" && curr[1] === goal) {
        cache[searchKey] = curr[2];
        return curr[2];
      }
      for (const nearby of getNearby(curr)) {
        queue.push(nearby);
      }
    }
    throw new Error("not found");
  };

  let totalComplexity = 0;

  for (const line of lines) {
    let totalDist = 0;

    let currNumeric = "A";

    for (const goal of line) {
      // plus one for the final button press
      totalDist += search("A", currNumeric, goal, NUM_LAYERS, true) + 1;
      currNumeric = goal;
    }

    totalComplexity += totalDist * parseInt(line.replace("A", ""));
  }

  return totalComplexity;
})();

// part two checker (an adapted version of part one to support arbitrary
// numbers of layers)
// The code is basically indecipherable but I'm adding it here in case I
// ever come back to these problems.
//
// DEBUG CODE BELOW, NOT A SOLUTION:
(() => {
  // const lines = document
  //   .querySelector("pre")
  //   .innerText.split("\n")
  //   .filter((e) => !!e);

  const numericGrid = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    [".", "0", "A"],
  ];

  const directionalGrid = [
    [".", "^", "A"],
    ["<", "v", ">"],
  ];

  const gridToPosMap = (grid) => {
    const map = {};
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        map[grid[row][col]] = [row, col];
      }
    }
    return map;
  };

  const numericToPos = gridToPosMap(numericGrid);
  const directionalToPos = gridToPosMap(directionalGrid);

  const charToDir = { "^": [-1, 0], ">": [0, 1], v: [1, 0], "<": [0, -1] };
  const dirs = Object.values(charToDir);

  const getPressResult = (curr) => {
    const firstNonAIndex = curr.findIndex((button) => button !== "A");
    if (firstNonAIndex === -1 || firstNonAIndex === curr.length - 1) {
      return null;
    }
    const directionChar = curr[firstNonAIndex];
    const [dr, dc] = charToDir[directionChar];
    const afterAMap =
      firstNonAIndex + 1 === curr.length - 1 ? numericToPos : directionalToPos;
    const afterAGrid =
      firstNonAIndex + 1 === curr.length - 1 ? numericGrid : directionalGrid;
    const posAfterA = afterAMap[curr[firstNonAIndex + 1]];
    const newChar = afterAGrid[posAfterA[0] + dr]?.[posAfterA[1] + dc];
    if (newChar && newChar !== ".") {
      return [
        ...curr.slice(0, firstNonAIndex + 1),
        newChar,
        ...curr.slice(firstNonAIndex + 2),
      ];
    }
    return null;
  };

  const getNearby = (curr) => {
    const nearby = [];
    const currPos = directionalToPos[curr[0]];

    // if you move first robot
    for (const [dr, dc] of dirs) {
      const other = directionalGrid[currPos[0] + dr]?.[currPos[1] + dc];
      if (other && other !== ".") {
        // console.log('c', curr);
        // throw new Error('hi')
        nearby.push([other, ...curr.slice(1)]);
      }
    }

    // if you tell first robot to press
    const ifPress = getPressResult(curr);

    if (ifPress) {
      nearby.push(ifPress);
    }

    return nearby;
  };

  let totalComplexity = 0;

  const getPaths = (curr, prev) => {
    let path = [];
    let currPrev = JSON.stringify(curr.slice(0, -1));
    while (currPrev) {
      path.push(currPrev);
      currPrev = prev[currPrev];
    }
    path.reverse();
    const outs = [];
    for (let layer = 0; layer < JSON.parse(path[0]).length - 1; layer++) {
      const out = [];
      for (let i = 0; i < path.length; i++) {
        const p = path[i];
        const direction = (() => {
          if (i === 0) return null;

          const old = JSON.parse(path[i - 1])[layer];
          const curr = JSON.parse(path[i])[layer];

          if (layer !== 0) {
            if (old === curr) {
              const allBeforeA = JSON.parse(path[i - 1])
                .slice(0, layer)
                .every((e) => e === "A");
              const allCurrA = JSON.parse(path[i])
                .slice(0, layer)
                .every((e) => e === "A");
              if (allBeforeA && allCurrA) {
                return "A";
              }
              return null;
            }
          }

          const oldPos = directionalToPos[old];
          const newPos = directionalToPos[curr];
          const dr = newPos[0] - oldPos[0];
          const dc = newPos[1] - oldPos[1];
          if (dr === 0 && dc === 0) {
            return "A";
          }
          if (dr === -1) {
            return "^";
          }
          if (dc === 1) {
            return ">";
          }
          if (dr === 1) {
            return "v";
          }
          if (dc === -1) {
            return "<";
          }
          throw new Error("impossible");
        })();
        if (direction) {
          out.push(direction);
        }
      }
      outs.push(out.join(""));
    }

    return outs;
  };

  const solve = (start, end, howMany) => {
    console.log("kylesh called");
    const lines = [end];

    for (const line of lines) {
      let curr = [...Array(howMany).fill("A"), start, 0];
      let totalDist = 0;

      for (const goal of line) {
        const prev = {};
        let found = false;
        const queue = [curr];
        const seen = new Set([JSON.stringify(curr.slice(0, -1))]);
        let index = 0;
        while (index < queue.length) {
          curr = queue[index];
          // console.log(curr)
          index++;
          if (
            [...Array(howMany).fill("A"), goal].every((e, i) => e === curr[i])
          ) {
            found = true;
            break;
          }
          for (const nearby of getNearby(curr.slice(0, -1))) {
            const key = JSON.stringify(nearby);
            if (!seen.has(key)) {
              prev[key] = JSON.stringify(curr.slice(0, -1));
              queue.push([...nearby, curr.slice(-1)[0] + 1]);
              seen.add(key);
            }
          }
        }
        if (!found) {
          throw new Error("not-reachable");
        }
        let path = [];
        let currPrev = JSON.stringify(curr.slice(0, -1));
        while (currPrev) {
          path.push(currPrev);
          currPrev = prev[currPrev];
        }
        path.reverse();
        for (let i = 0; i < path.length; i++) {
          const p = path[i];
          const direction = (() => {
            if (i === 0) return null;

            const old = JSON.parse(path[i - 1])[0];
            const curr = JSON.parse(path[i])[0];

            const oldPos = directionalToPos[old];
            const newPos = directionalToPos[curr];
            const dr = newPos[0] - oldPos[0];
            const dc = newPos[1] - oldPos[1];
            if (dr === 0 && dc === 0) {
              return "A";
            }
            if (dr === -1) {
              return "^";
            }
            if (dc === 1) {
              return ">";
            }
            if (dr === 1) {
              return "v";
            }
            if (dc === -1) {
              return "<";
            }
            throw new Error("impossible");
          })();
          // console.log("path", direction, p);
        }
        // console.log('path', path)
        // return getPaths(curr, prev);
        console.log(
          "out path",
          getPaths(curr, prev),
          path.map((p) => JSON.parse(p).join(","))
        );
        return curr.slice(-1)[0];
        console.log("total", curr.slice(-1)[0]);
        totalDist += curr.slice(-1)[0] + 1; // plus one for final press!
        curr = [...curr.slice(0, -1), 0];
      }
      totalComplexity += totalDist * parseInt(line.replace("A", ""));
    }
  };

  // console.warn('remember numeric grid is mutated for testing!!!!');

  return solve("6", "1", 6);

  // const pathResults = {};
  // const resultsByRow = {};

  // for (let i = 2; i <= 8; i++) {
  //   const result = solve('A', '0', i);
  //   pathResults[i] = result;
  //   for (let j = 0; j < result.length; j++) {
  //     resultsByRow[j] ??= {};
  //     resultsByRow[j][result[result.length - 1 - j]] ??= [];
  //     resultsByRow[j][result[result.length - 1 - j]].push(i);
  //   }
  // }

  // return resultsByRow;

  for (const [name, res] of [
    // ["1 left 4 layers", solve("A", "0", 4)],
    // ["1 left 3 layers", solve("A", "0", 3)],
    // ["1 left 2 layers", solve("A", "0", 2)],
    // ['1 up 3 layers', solve('A', '3', 3)],
    // ['1 up 4 layers', solve('A', '3', 4)],
    // ['1 right', solve('0', 'A', 2)],
    // ['1 down', solve('3', 'A', 2)],
    // ['1 left', solve('A', '0', 2)],
    // ['1 up and 1 right', solve('0', '3', 2)],
    // ['1 up and 1 left', solve('A', '2', 2)],
    // ['1 down and 1 right', solve('2', 'A', 2)],
    // ['1 down and 1 left', solve('3', '0', 2)]
  ]) {
    console.log(name, res);
  }

  return totalComplexity;
})();
