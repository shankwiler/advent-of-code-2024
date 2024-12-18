// part one
(() => {
  const registers = {
    A: 32916674,
    B: 0,
    C: 0,
  };

  const codes = [2,4,1,1,7,5,0,3,1,4,4,0,5,5,3,0];

  const combos = {
    0: () => 0,
    1: () => 1,
    2: () => 2,
    3: () => 3,
    4: () => registers.A,
    5: () => registers.B,
    6: () => registers.C,
  };

  const output = [];

  for (let i = 0; i < codes.length; ) {
    const operations = {
      0: (val) => {
        registers.A = Math.floor(registers.A / Math.pow(2, combos[val]()));
        i += 2;
      },
      1: (val) => {
        registers.B = registers.B ^ val;
        i += 2
      },
      2: (val) => {
        registers.B = combos[val]() % 8;
        i += 2
      },
      3: (val) => {
        if (registers.A === 0) {
          i += 2;
          return;
        }
        if (i !== val) {
          i = val;
        } else {
          i += 2;
        }
      },
      4: () => {
        registers.B = registers.B ^ registers.C;
        i += 2;
      },
      5: (val) => {
        output.push(combos[val]() % 8);
        i += 2;
      },
      6: (val) => {
        registers.B = Math.floor(registers.A / Math.pow(2, combos[val]()));
        i += 2;
      },
      7: (val) => {
        registers.C = Math.floor(registers.A / Math.pow(2, combos[val]()));
        i += 2;
      }
    }

    operations[codes[i]](codes[i + 1]);
  }

  return output.join(',');
})();

// part two done in python
