// part one 
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const xns = {};

  for (const line of lines) {
    const [first, second] = line.split('-');
    xns[first] ??= new Set();
    xns[first].add(second);
    xns[second] ??= new Set();
    xns[second].add(first);
  }

  const matches = new Set();

  for (const node of Object.keys(xns)) {
    if (node[0] !== 't') {
      continue;
    }
    const xnArr = Array.from(xns[node]);
    for (let i = 0; i < xnArr.length; i++) {
      for (let j = i + 1; j < xnArr.length; j++) {
        if (xns[xnArr[i]].has(xnArr[j])) {
          matches.add(JSON.stringify([node, xnArr[i], xnArr[j]].sort()));
        }
      }
    }
  }

  return matches;
})();

// part two
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const xns = {};

  for (const line of lines) {
    const [first, second] = line.split('-');
    xns[first] ??= new Set();
    xns[first].add(second);
    xns[second] ??= new Set();
    xns[second].add(first);
  }

  const matches = new Set();

  for (const node of Object.keys(xns)) {
    const xnArr = Array.from(xns[node]);
    for (let i = 0; i < xnArr.length; i++) {
      for (let j = i + 1; j < xnArr.length; j++) {
        if (xns[xnArr[i]].has(xnArr[j])) {
          matches.add(JSON.stringify([node, xnArr[i], xnArr[j]].sort()));
        }
      }
    }
  }

  const nextMatches = (ms) => {
    const newMatches = new Set();

    for (const match of ms) {
      const matchArr = JSON.parse(match);
      for (const other of xns[matchArr[0]]) {
        // Probably should have explicitly ignored "other" if it already
        // is in your "match" -- but it's fine because it'll get washed out
        // as long as it doesn't have itself as a match. ie the content of
        // the every call will return false because xns[other] does not have other.
        if (matchArr.every(e => xns[other].has(e))) {
          newMatches.add(JSON.stringify([...matchArr, other].sort()));
        }
      }
    }

    return newMatches;
  };

  let currMatches = matches;
  while (true) {
    const next = nextMatches(currMatches);
    if (next.size === 0) {
      break;
    }
    currMatches = next;
  }

  if (currMatches.size !== 1) {
    throw new Error('uh oh');
  }

  const found = JSON.parse(Array.from(currMatches)[0]).sort().join(',');

  return found;
})();