// part one
(() => {
  const input = document
    .querySelector("pre")
    .innerText;

  return Array.from(input.matchAll(/mul\((\d+),(\d+)\)/g))
    .map(([, num1, num2]) => parseInt(num1) * parseInt(num2))
    .reduce((sum, num) => sum + num, 0);
})();

// part two
(() => {
  const input = document.querySelector("pre").innerText;

  return Array.from(
    input.matchAll(/(?:mul\((\d+),(\d+)\))|(?:do\(\))|(?:don't\(\))/g)
  ).reduce(
    (acc, command) => {
      if (command[0] === "don't()") {
        return { sum: acc.sum, do: false };
      }
      if (command[0] === "do()") {
        return { sum: acc.sum, do: true };
      }
      return {
        sum: acc.sum + (acc.do ? parseInt(command[1]) * parseInt(command[2]) : 0),
        do: acc.do,
      };
    },
    { sum: 0, do: true }
  ).sum;
})();
