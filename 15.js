// I tried competing tonight and it was a good night for that, because
// the problem was fairly well defined and straightforward. Halfway through
// part one I gave up on hurrying but then did alright on the placement
// anyway. Unfortunately things fell apart for part 2 as I was going down
// a very complicated path for moving the brackets until I found a much
// easier solution.

// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);
  const grid = lines
    .filter((line) => line.includes("#"))
    .map((line) => Array.from(line));
  const instructions = Array.from(
    lines.filter((line) => !line.includes("#")).join("")
  );

  let curr = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === "@") {
        curr = [row, col];
      }
    }
  }

  const insMap = { "^": [-1, 0], ">": [0, 1], v: [1, 0], "<": [0, -1] };

  for (rawIns of instructions) {
    const ins = insMap[rawIns];
    const newSpace = [curr[0] + ins[0], curr[1] + ins[1]];
    const newItem = grid[newSpace[0]][newSpace[1]];
    if (newItem === ".") {
      grid[curr[0]][curr[1]] = ".";
      curr = newSpace;
      grid[curr[0]][curr[1]] = "@";
    } else if (newItem === "O") {
      let nextFree = newSpace;
      while (grid[nextFree[0]][nextFree[1]] === "O") {
        nextFree = [nextFree[0] + ins[0], nextFree[1] + ins[1]];
      }
      if (grid[nextFree[0]][nextFree[1]] === ".") {
        grid[nextFree[0]][nextFree[1]] = "O";
        grid[newSpace[0]][newSpace[1]] = "@";
        grid[curr[0]][curr[1]] = ".";
        curr = newSpace;
      }
    }
  }

  let total = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === "O") {
        total += 100 * row + col;
      }
    }
  }

  return { grid, instructions, total };
})();

// part two
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const smallGrid = lines
    .filter((line) => line.includes("#"))
    .map((line) => Array.from(line));
  const instructions = Array.from(
    lines.filter((line) => !line.includes("#")).join("")
  );

  let grid = [];
  for (let row = 0; row < smallGrid.length; row++) {
    grid.push([]);
    for (let col = 0; col < smallGrid[0].length; col++) {
      const smallItem = smallGrid[row][col];
      const newEntry = {
        "#": "##",
        O: "[]",
        ".": "..",
        "@": "@.",
      }[smallItem];
      grid[row].push(...newEntry);
    }
  }

  let curr = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === "@") {
        curr = [row, col];
      }
    }
  }

  const insMap = { "^": [-1, 0], ">": [0, 1], v: [1, 0], "<": [0, -1] };

  const canMove = (spot, dir, seen) => {
    const next = [spot[0] + dir[0], spot[1] + dir[1]];
    const nextItem = grid[next[0]][next[1]];
    if (nextItem === ".") {
      return true;
    }
    if (nextItem === "#") {
      return false;
    }
    if (nextItem === "]") {
      seen.add(JSON.stringify([next[0], next[1], nextItem]));
      seen.add(JSON.stringify([next[0], next[1] - 1, "["]));
      if (dir[1] === -1) {
        // if we're moving left, we just need to check if this bracket's partner can move
        return canMove([spot[0], spot[1] - 2], dir, seen);
      }
      // otherwise (going up or down), we need to check if both this one and its partner can move
      return (
        canMove(next, dir, seen) && canMove([next[0], next[1] - 1], dir, seen)
      );
    }
    if (nextItem === "[") {
      seen.add(JSON.stringify([next[0], next[1], nextItem]));
      seen.add(JSON.stringify([next[0], next[1] + 1, "]"]));
      // similar story as above for this situation
      if (dir[1] === 1) {
        return canMove([spot[0], spot[1] + 2], dir, seen);
      }
      return (
        canMove(next, dir, seen) && canMove([next[0], next[1] + 1], dir, seen)
      );
    }
    throw new Error("unexpected");
  };

  const move = (toMove, dir) => {
    // a cheap approach to moving all the brackets. we take all of the ones we
    // saw, and move them to their new location. if the spot it's in has not
    // already been taken up by a different bracket that we're moving, we clear
    // it out with a ".". if a different bracket has been placed in the spot
    // though, we leave it be.
    const moved = new Set();
    for (const item of [...toMove].map((item) => JSON.parse(item))) {
      grid[item[0] + dir[0]][item[1] + dir[1]] = item[2];
      if (!moved.has(JSON.stringify([item[0], item[1]]))) {
        grid[item[0]][item[1]] = ".";
      }
      moved.add(JSON.stringify([item[0] + dir[0], item[1] + dir[1]]));
    }
  };

  for (rawIns of instructions) {
    const ins = insMap[rawIns];
    const seen = new Set();
    if (canMove(curr, ins, seen)) {
      move(seen, ins);
      grid[curr[0]][curr[1]] = ".";
      curr = [curr[0] + ins[0], curr[1] + ins[1]];
      grid[curr[0]][curr[1]] = "@";
    }
  }

  let total = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === "[") {
        total += 100 * row + col;
      }
    }
  }

  return { grid, instructions, total };
})();
