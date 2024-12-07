// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const possible = (curr, index, nums, target) => {
    if (index === nums.length) {
      return curr === target;
    }
    return possible(
      curr * nums[index],
      index + 1,
      nums,
      target
    ) || possible(
      curr + nums[index],
      index + 1,
      nums,
      target
    );
  };

  let total = 0;

  for (const line of lines) {
    const allNums = line.split(/:| /g).filter(s => !!s);
    const target = parseInt(allNums[0]);
    const nums = allNums.slice(1).map(num => parseInt(num));
    if (possible(nums[0], 1, nums, target)) {
      total += target;
    }
  }

  return total;
})();

// part two
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const possible = (curr, index, nums, target) => {
    if (index === nums.length) {
      return curr === target;
    }
    return possible(
      curr * nums[index],
      index + 1,
      nums,
      target
    ) || possible(
      curr + nums[index],
      index + 1,
      nums,
      target
    ) || possible(
      parseInt(curr.toString() + nums[index].toString()),
      index + 1,
      nums,
      target
    );
  };

  let total = 0;

  for (const line of lines) {
    const allNums = line.split(/:| /g).filter(s => !!s);
    const target = parseInt(allNums[0]);
    const nums = allNums.slice(1).map(num => parseInt(num));
    if (possible(nums[0], 1, nums, target)) {
      total += target;
    }
  }

  return total;
})();