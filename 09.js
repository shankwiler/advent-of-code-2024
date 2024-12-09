export const solvePartOne = (rawInput) => {
  // pointer will start at the first space that is filled
  // then it moves onto free space, and the second pointer
  // tells it what will be there
  // as it goes, it sums up every file id multiplied by the positions

  const input = Array.from(rawInput).map((num) => parseInt(num));

  let index = 0;
  let toMoveIndex = input.length % 2 == 0 ? input.length - 2 : input.length - 1;
  let position = 0;
  let total = 0;

  while (index <= toMoveIndex) {
    if (index % 2 === 0) {
      const fileId = Math.round(index / 2);
      const positionEnd = position + input[index];
      for (; position < positionEnd; position++) {
        total += fileId * position;
      }
      index++;
    } else {
      const fileId = Math.round(toMoveIndex / 2);
      const toFill = Math.min(input[index], input[toMoveIndex]);
      const positionEnd = position + toFill;
      for (; position < positionEnd; position++) {
        total += fileId * position;
      }
      input[index] -= toFill;
      input[toMoveIndex] -= toFill;
      if (input[toMoveIndex] === 0) {
        toMoveIndex -= 2;
      }
      if (input[index] === 0) {
        index++;
      }
    }
  }

  return total;
};

export const solvePartTwo = (rawInput) => {
  // Performance is quite bad, sort of a "just implement it" type solution.
  // I added a faster solution below.
  const input = Array.from(rawInput).map((num) => parseInt(num));

  let blocks = [];

  for (let i = 0; i < input.length; i += 2) {
    blocks.push({
      type: "FILE",
      id: Math.round(i / 2),
      length: input[i],
      moved: false,
    });
    blocks.push({
      type: "FREE",
      length: input[i + 1],
    });
  }

  for (let source = blocks.length - 1; source > 0; ) {
    if (blocks[source].type === "FREE") {
      source--;
      continue;
    }

    let moved = false;

    for (let destination = 0; destination < source; destination++) {
      if (
        blocks[destination].type === "FREE" &&
        blocks[destination].length >= blocks[source].length
      ) {
        blocks = [
          ...blocks.slice(0, destination),
          {
            ...blocks[source],
            moved: true,
          },
          {
            ...blocks[destination],
            length: blocks[destination].length - blocks[source].length,
          },
          ...blocks.slice(destination + 1).map((block) =>
            block.id === blocks[source].id
              ? {
                  type: "FREE",
                  length: blocks[source].length,
                }
              : block
          ),
        ];
        moved = true;
        break;
      }
    }
    if (!moved) {
      source--;
    }
  }

  let total = 0;
  let position = 0;

  for (const entry of blocks) {
    if (entry.type === "FREE") {
      position += entry.length;
    } else {
      const end = position + entry.length;
      for (; position < end; position++) {
        total += position * entry.id;
      }
    }
  }

  return total;
};

export const solvePartTwoFast = (rawInput) => {
  // Way faster because we're not re-creating the blocks array over and over.
  // Still O(N^2) time complexity. We could probably cheese a solution like
  // create nine stacks for every possible size that could be needed, where the
  // leftmost free space is at the top of the stack. I think that'd work, and
  // it'd get us O(N) time complexity.
  const input = Array.from(rawInput).map((num) => parseInt(num));

  let blocks = [];

  for (let i = 0; i < input.length; i += 2) {
    blocks.push({
      type: "FILE",
      id: Math.round(i / 2),
      length: input[i],
      moved: false,
    });
    blocks.push({
      type: "FREE",
      length: input[i + 1],
    });
  }

  const moved = {};

  for (let source = blocks.length - 1; source > 0; source--) {
    if (blocks[source].type === "FREE") {
      continue;
    }

    for (let destination = 0; destination < source; destination++) {
      if (
        blocks[destination].type === "FREE" &&
        blocks[destination].length >= blocks[source].length
      ) {
        blocks[destination].length -= blocks[source].length;
        moved[destination] ??= [];
        moved[destination].push(blocks[source]);
        blocks[source] = { type: "FREE", length: blocks[source].length };
        break;
      }
    }
  }

  const newBlocks = [];
  for (let i = 0; i < blocks.length; i++) {
    newBlocks.push(...(moved[i] ?? []));
    newBlocks.push(blocks[i]);
  }

  let total = 0;
  let position = 0;

  for (const entry of newBlocks) {
    if (entry.type === "FREE") {
      position += entry.length;
    } else {
      const end = position + entry.length;
      for (; position < end; position++) {
        total += position * entry.id;
      }
    }
  }

  return total;
};
