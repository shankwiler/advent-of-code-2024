// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const values = {};
  for (const line of lines.filter((e) => e.includes(":"))) {
    const [wire, valueRaw] = line.split(": ");
    values[wire] = parseInt(valueRaw);
  }

  let toSolve = [];
  for (const line of lines.filter((e) => !e.includes(":"))) {
    const [, ...equation] = line.match(/(.+) (.+) (.+) -> (.+)/);
    toSolve.push(equation);
  }

  const solved = {
    ...values,
  };

  // Could've used BFS... small enough search space we can just use
  // a simple O(N^2) loop.
  while (toSolve.length > 0) {
    const newToSolve = [];
    for (const equation of toSolve) {
      const [in1, op, in2, out] = equation;
      if (in1 in solved && in2 in solved) {
        if (op === "AND") {
          solved[out] = solved[in1] & solved[in2];
        } else if (op === "OR") {
          solved[out] = solved[in1] | solved[in2];
        } else if (op === "XOR") {
          solved[out] = solved[in1] ^ solved[in2];
        }
      } else {
        newToSolve.push(equation);
      }
    }
    toSolve = newToSolve;
  }

  const zs = Object.keys(solved)
    .filter((e) => e[0] === "z")
    .sort((a, b) => parseInt(a.replace("z", "")) - parseInt(b.replace("z", "")))
    .reverse();
  return parseInt(zs.map((z) => solved[z]).join(""), 2);
})();

// part two. Raw notes pasted below it
// basically the idea was to, for each of x__ and y__, figure out where the
// "solution" output went and where the "carry" went (see https://en.wikipedia.org/wiki/Adder_(electronics)).
// from there, we just need to ensure we throw an error if an expected operation
// isn't found in the list, or if the output wire is bogus.
// I manually ran the code, found an error, added the replacement, ran the code again, found the
// next replacement, and so on.
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const replacements = [
    ["fdv", "dbp"],
    ["ckj", "z15"],
    ["z23", "kdf"],
    ["z39", "rpp"],
  ];

  const getKey = (key) => {
    for (const [first, second] of replacements) {
      if (key === first) {
        return second;
      }
      if (key === second) {
        return first;
      }
    }
    return key;
  };

  const find = (first, second, op) => {
    for (const line of lines) {
      const match =
        line.match(new RegExp(`${first} ${op} ${second} -> (.+)`)) ??
        line.match(new RegExp(`${second} ${op} ${first} -> (.+)`));

      if (match) {
        return getKey(match[1]);
      }
    }
    throw new Error(`not-found: ${first} ${op} ${second}`);
  };

  const maxX = Math.max(
    ...lines.map((line) => parseInt(line.match(/^x(\d+)/)?.[1] ?? "0"))
  );

  let carryIn;

  for (let i = 0; i <= maxX; i++) {
    const padI = i.toString().padStart(2, "0");
    const xyXor = find(`x${padI}`, `y${padI}`, "XOR");
    const xyAnd = find(`x${padI}`, `y${padI}`, "AND");
    const carryInAndXYXor = i === 0 ? undefined : find(carryIn, xyXor, "AND");
    // console.log('running', { padI, xyXor, xyAnd, carryIn, carryInAndXYXor })
    const carryOut = i === 0 ? xyAnd : find(xyAnd, carryInAndXYXor, "OR");
    const solution = i === 0 ? xyXor : find(xyXor, carryIn, "XOR");

    if (solution !== `z${padI}`) {
      console.log("issue found with solution", {
        padI,
        xyXor,
        xyAnd,
        carryInAndXYXor,
        carryOut,
        solution,
      });
      throw new Error("issue found");
    }

    console.log({
      i,
      xyXor,
      xyAnd,
      carryInAndXYXor,
      carryOut,
      solution,
    });

    carryIn = carryOut;
  }

  return replacements.flat().sort().join(",");
})();

/*

part two raw notes.

---
this first section I was analyzing z03

x00 AND y00 -> rfg
fps AND rfg -> fdn
fdn OR hnq -> mvw
mvw AND nfs -> jqp
jqp OR hvw -> tgm
tgm XOR qtf -> z03


fdn = x00 & y00
hnq = x01 & y01
mvw = (x00 & y00) | (x01 & y01) = fnd | hnq
nfs = x02 ^ y02
jqp = ((x00 & y00) | (x01 & y01)) & (x02 ^ y02) = mvw & nfs
hvw = x02 & y02
tgm = (((x00 & y00) | (x01 & y01)) & (x02 ^ y02)) | (x02 & y02) = jqp | hvw
qtf = x03 ^ y03
z03 = ((((x00 & y00) | (x01 & y01)) & (x02 ^ y02)) | (x02 & y02)) ^ (x03 ^ y03) = tgm ^ qtf

---
analzying how x00 and y00 were used, including the "carry" later used with x01 and y01


x00 XOR y00 -> z00
x00 AND y00 -> rfg

y01 XOR x01 -> fps
x01 AND y01 -> hnq
fps XOR rfg -> z01

fps = y01 ^ x01
hnq = x01 & y01
z01 = (y01 ^ x01) ^ (x00 & y00)

--
here I was analyzing the first error I found

y06 AND x06 -> fdv
x06 XOR y06 -> dbp
fdv XOR vjf -> z06

carry in was vjf

fdv = y06 & x06
dbp = x06 ^ y06
z06 = (y06 & x06) ^ (carry in)
*/
