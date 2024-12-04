// part one
(() => {
  const toFind = "XMAS";

  const getNumStartingAt = (grid, row, col) => {
    let found = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        let good = true;
        for (let i = 0; i < toFind.length; i++) {
          if (grid[row + dr * i]?.[col + dc * i] !== toFind[i]) {
            good = false;
            break;
          }
        }
        if (good) {
          found++;
        }
      }
    }
    return found;
  };

  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);
  const grid = lines.map((line) => Array.from(line));
  let total = 0;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      total += getNumStartingAt(grid, row, col);
    }
  }

  return total;
})();

// part two
(() => {
  // (-1,-1); (-1, 1)
  // (1, -1); (1, 1)
  const relevant = new Set(["M", "S"]);

  const isCenterOfMas = (grid, row, col) => {
    if (grid[row][col] !== "A") {
      return false;
    }
    for (const [dr, dc] of [
      [-1, -1],
      [-1, 1],
    ]) {
      const start = grid[row + dr]?.[col + dc];
      const end = grid[row + dr * -1]?.[col + dc * -1];

      const matchAcrossDiagonal =
        relevant.has(start) && relevant.has(end) && start !== end;
      if (!matchAcrossDiagonal) {
        return false;
      }
    }
    return true;
  };

  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);
  const grid = lines.map((line) => Array.from(line));
  let total = 0;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      total += isCenterOfMas(grid, row, col) ? 1 : 0;
    }
  }

  return total;
})();
