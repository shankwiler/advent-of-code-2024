// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);
  const nums = lines.map((line) =>
    line.split(/\s+/).map((num) => parseInt(num))
  );
  const lefts = nums.map((pair) => pair[0]).sort();
  const rights = nums.map((pair) => pair[1]).sort();
  return lefts
    .map((num, i) => Math.abs(num - rights[i]))
    .reduce((num, tot) => num + tot, 0);
})();

// part two
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);
  const nums = lines.map((line) =>
    line.split(/\s+/).map((num) => parseInt(num))
  );
  const lefts = nums.map((pair) => pair[0]).sort();
  const rights = nums.map((pair) => pair[1]).sort();
  const counts = rights.reduce((acc, num) => {
    acc[num] ??= 0;
    acc[num]++;
    return acc;
  }, {});
  return lefts
    .map((num, i) => num * (counts[num] ?? 0))
    .reduce((num, tot) => num + tot, 0);
})();
