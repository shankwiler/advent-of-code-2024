"""
part two

Found some annoying behavior with large numbers and bitwise XOR with JS, leading to negative results.
Lost confidence in JS and switched to Python.

- Found the following are true about my input:
  - There's only one go to, at the very end
  - B and C are purely ephemeral state and don't carry over to the next loop
  - A is continually divided by 8
  - A can affect the next result -- but it doesn't always
- Manually did some searching to find how to construct blocks of the input
- Some of the blocks would affect "lower" bits, so I made sure to:
  - Only consider the "lowest" result for a block
  - Do not use that block if it's the kind that will affect "lower" bits
- Thankfully I found some groupings fro which that worked
- There were still 6 codes at the beginning to figure out, so I just manually iterated
  over the remaining possibilities from there.
"""

def get_output(A):
  return ((A % 8) ^ 1 ^ 4 ^ (A // 2**((A % 8) ^ 1))) % 8

def solve(A):
  out = []
  curr = A
  while curr != 0:
    out.append(get_output(curr))
    curr //= 8
  return out

goal = [2,4,1,1,7,5,0,3,1,4,4,0,5,5,3,0]

want = [
  goal[:4],
  goal[4:8],
  goal[8:12],
  goal[12:],
  [0,3,1,4,4,0],
  [4,1,1,7,5]
]

# next line was found from searching for the "want" blocks above
# and then multiplying them "up" to become the "higher bits" so
# we're left with just the "lower" bits missing
pretty_good = 2944 * (8 ** 12) + 177646 * (8 ** 6)

for i in range(pretty_good, pretty_good + 8 ** 6):
  if i % 10000 == 0:
    print(i - pretty_good, 'of', pretty_good + 8 ** 6 - i)
  res = solve(i)
  if res == goal:
    print(i, res)
