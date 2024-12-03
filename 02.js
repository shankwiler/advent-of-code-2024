// part one
(() => {
  const rawLines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);
  const lines = rawLines.map((line) =>
    line.split(" ").map((num) => parseInt(num))
  );
  const safe = lines.filter((line, li) => {
    const increasing = line[0] < line[1];
    return line.slice(1).every((num, i) => {
      const increased = line[i] < num;
      const difference = Math.abs(num - line[i]);
      return difference >= 1 && difference <= 3 && increasing === increased;
    });
  }).length;

  return safe;
})();

// part two
(() => {
  const isGoodHelper = (line) => {
    const increasing = line[0] < line[1];
    return line.slice(1).every((num, i) => {
      const increased = line[i] < num;
      const difference = Math.abs(num - line[i]);
      return difference >= 1 && difference <= 3 && increasing === increased;
    });
  };
  const isGoodNaive = (line) => {
    for (let i = 0; i < line.length; i++) {
      if (isGoodHelper(line.filter((_, i2) => i !== i2))) {
        return true;
      }
    }
    return false;
  };

  const rawLines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const lines = rawLines.map((line) =>
    line.split(" ").map((num) => parseInt(num))
  );
  const safe = lines.filter((line) => {
    return isGoodNaive(line);
  }).length;

  return safe;
})();
