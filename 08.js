// Working on a new approach for running code, so this isn't in the usual
// format executable from the browswer console.

export const solvePartOne = (input) => {
  const lines = input.split('\n').filter(e => !!e);
  const grid = lines.map(line => Array.from(line));
  const locations = {};
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] !== '.') {
        locations[grid[row][col]] ??= [];
        locations[grid[row][col]].push([row, col]);
      }
    }
  }

  const withAntinodes = new Set();

  const inBounds = (location) => (
    0 <= location[0] && location[0] < grid.length &&
    0 <= location[1] && location[1] < grid[0].length
  );

  for (const [char, charLocations] of Object.entries(locations)) {
    for (let first = 0; first < charLocations.length - 1; first++) {
      for (let second = first + 1; second < charLocations.length; second++) {
        const [dr, dc] = [
          charLocations[second][0] - charLocations[first][0],
          charLocations[second][1] - charLocations[first][1]
        ];
        const beforeFirst = [
          charLocations[first][0] - dr,
          charLocations[first][1] - dc,
        ];
        const afterSecond = [
          charLocations[second][0] + dr,
          charLocations[second][1] + dc,
        ];
        if (inBounds(beforeFirst)) {
          withAntinodes.add(JSON.stringify(beforeFirst));
        }
        if (inBounds(afterSecond)) {
          withAntinodes.add(JSON.stringify(afterSecond));
        }
      }
    }
  }

  return withAntinodes.size;
};

export const solvePartTwo = (input) => {
  const lines = input.split('\n').filter(e => !!e);
  const grid = lines.map(line => Array.from(line));
  const locations = {};
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] !== '.') {
        locations[grid[row][col]] ??= [];
        locations[grid[row][col]].push([row, col]);
      }
    }
  }

  const withAntinodes = new Set();

  const inBounds = (location) => (
    0 <= location[0] && location[0] < grid.length &&
    0 <= location[1] && location[1] < grid[0].length
  );

  for (const [char, charLocations] of Object.entries(locations)) {
    for (let first = 0; first < charLocations.length - 1; first++) {
      for (let second = first + 1; second < charLocations.length; second++) {
        const [dr, dc] = [
          charLocations[second][0] - charLocations[first][0],
          charLocations[second][1] - charLocations[first][1]
        ];
        let before = [
          charLocations[first][0],
          charLocations[first][1],
        ];
        while (inBounds(before)) {
          withAntinodes.add(JSON.stringify(before));
          before = [
            before[0] - dr,
            before[1] - dc
          ];
        }
        let after = [
          charLocations[first][0],
          charLocations[first][1],
        ];
        while (inBounds(after)) {
          withAntinodes.add(JSON.stringify(after));
          after = [
            after[0] + dr,
            after[1] + dc,
          ]
        }
      }
    }
  }

  return withAntinodes.size;
};