"""
Part two runs quite slowly... but I feel like the algorithm is fine.
Besides maybe some optimizations around using bit shifts for generating
the next secret, or finding a faster way to generate and store the "recent"
prices, I'm not thinking of a way we could speed it up much.

Python is kind of slow, but I've totally lost trust in the bitwise operations
in JS after day 17.
"""

def part_one():
  import os

  with open(os.getcwd() + '/' + '22-input.txt') as f:
    lines = f.read().split('\n')

  def mix(a, b):
    return a ^ b

  def prune(a):
    return a % 16777216

  total = 0

  for line in lines:
    secret = int(line.strip())
    for _ in range(2000):
      secret = prune(mix(secret * 64, secret))
      secret = prune(mix(secret // 32, secret))
      secret = prune(mix(secret * 2048, secret))
    total += secret

  return total

def part_two():
  import os

  with open(os.getcwd() + '/' + '22-input.txt') as f:
    lines = f.read().split('\n')

  def mix(a, b):
    return a ^ b

  def prune(a):
    return a % 16777216

  total = 0

  total_values_of_recent = {}

  for line in lines:
    secret = int(line.strip())
    prev = secret % 10
    recent = tuple()
    value_of_recent = {}
    for _ in range(2000):
      secret = prune(mix(secret * 64, secret))
      secret = prune(mix(secret // 32, secret))
      secret = prune(mix(secret * 2048, secret))
      price = secret % 10
      recent = recent[-3:] + tuple([price - prev])
      if recent not in value_of_recent:
        value_of_recent[recent] = price
      prev = price

    for recent, value in value_of_recent.items():
      if recent not in total_values_of_recent:
        total_values_of_recent[recent] = 0
      total_values_of_recent[recent] += value

  best = -1
  for value in total_values_of_recent.values():
    best = max(best, value)

  return best

print(part_one(), part_two())