// Struggling to implement part two... will come back to this.

// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const numericGrid = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['.', '0', 'A'],
  ];

  const directionalGrid = [
    ['.', '^', 'A'],
    ['<', 'v', '>'],
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

  const charToDir = { '^': [-1, 0], '>': [0, 1], 'v': [1, 0], '<': [0, -1] };
  const dirs = Object.values(charToDir);

  const getPressResult = (curr) => {
    const firstNonAIndex = curr.findIndex((button) => button !== 'A');
    if (firstNonAIndex === -1 || firstNonAIndex === curr.length - 1) {
      return null;
    }
    const directionChar = curr[firstNonAIndex];
    const [dr, dc] = charToDir[directionChar];
    const afterAMap = firstNonAIndex + 1 === curr.length - 1 ? numericToPos : directionalToPos;
    const afterAGrid = firstNonAIndex + 1 === curr.length - 1 ? numericGrid : directionalGrid;
    const posAfterA = afterAMap[curr[firstNonAIndex + 1]];
    const newChar = afterAGrid[posAfterA[0] + dr]?.[posAfterA[1] + dc];
    if (newChar && newChar !== '.') {
      return [
        ...curr.slice(0, firstNonAIndex + 1),
        newChar,
        ...curr.slice(firstNonAIndex + 2)
      ];
    }
    return null;
  }

  const getNearby = (curr) => {
    const nearby = [];
    const currPos = directionalToPos[curr[0]];

    // if you move first robot
    for (const [dr, dc] of dirs) {
      const other = directionalGrid[currPos[0] + dr]?.[currPos[1] + dc];
      if (other && other !== '.') {
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
    let curr = ['A', 'A', 'A', 0];
    let totalDist = 0;
    for (const goal of line) {
      let found = false;
      const queue = [curr];
      const seen = new Set([JSON.stringify(curr.slice(-1))]);
      let index = 0;
      while (index < queue.length) {
        curr = queue[index];
        index++;
        if (['A', 'A', goal].every((e, i) => e === curr[i])) {
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
        throw new Error('not-reachable');
      }
      totalDist += curr.slice(-1)[0] + 1; // plus one for final press!
      curr = [...curr.slice(0, -1), 0];
    }
    totalComplexity += totalDist * parseInt(line.replace('A', ''));
  }

  return totalComplexity;
})();
