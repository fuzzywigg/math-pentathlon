/**
 * Wave 32 — getAllPossibleSums exhaustive / empty / duplicate edges.
 * Deepens subset-sum helpers used by DiceSelector possible-sums UI.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { getAllPossibleSums } from '../../src/core/dice';

function expectedSubsetSums(values: number[]): number[] {
  const sums = new Set<number>();
  const n = values.length;
  for (let mask = 1; mask < 1 << n; mask++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) sum += values[i];
    }
    sums.add(sum);
  }
  return Array.from(sums).sort((a, b) => a - b);
}

describe('Wave 32 dice-sums — exhaustive agreement', () => {
  it.each([
    [[1]],
    [[1, 2]],
    [[1, 2, 3]],
    [[2, 2, 2]],
    [[5, 5, 10]],
    [[1, 3, 5, 7]],
    [[6, 6, 6, 6]],
  ])('matches bit-mask reference for %j', (values) => {
    expect(getAllPossibleSums(values)).toEqual(expectedSubsetSums(values));
  });

  it('empty input yields empty list (no empty-subset 0)', () => {
    expect(getAllPossibleSums([])).toEqual([]);
  });

  it('single zero still emits 0 as a valid non-empty subset sum', () => {
    expect(getAllPossibleSums([0])).toEqual([0]);
    expect(getAllPossibleSums([0, 1])).toEqual([0, 1]);
  });

  it('output is strictly sorted ascending with unique values', () => {
    const sums = getAllPossibleSums([4, 2, 4, 1]);
    expect(sums).toEqual([...sums].sort((a, b) => a - b));
    expect(new Set(sums).size).toBe(sums.length);
  });
});

describe('Wave 32 dice-sums — size bounds', () => {
  it('n distinct powers of two yield 2^n - 1 unique sums', () => {
    const values = [1, 2, 4, 8];
    expect(getAllPossibleSums(values)).toHaveLength(15);
    expect(getAllPossibleSums(values).at(-1)).toBe(15);
  });

  it('all-ones of length n yield 1..n contiguous sums', () => {
    const values = [1, 1, 1, 1, 1];
    expect(getAllPossibleSums(values)).toEqual([1, 2, 3, 4, 5]);
  });
});
