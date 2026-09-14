/**
 * Wave 32 — getAllPossibleSums subset / empty / duplicate / stress edges.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { getAllPossibleSums } from '../../src/core/dice';

describe('Wave 32 dice — subset sums catalog', () => {
  it('returns empty array for empty input', () => {
    expect(getAllPossibleSums([])).toEqual([]);
  });

  it('enumerates all non-empty subsets for [1,2,4]', () => {
    // 1,2,4,1+2=3,1+4=5,2+4=6,1+2+4=7
    expect(getAllPossibleSums([1, 2, 4])).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('dedupes identical face values', () => {
    expect(getAllPossibleSums([3, 3, 3])).toEqual([3, 6, 9]);
  });

  it('includes zeros when a face is zero', () => {
    const sums = getAllPossibleSums([0, 5]);
    expect(sums).toContain(0);
    expect(sums).toContain(5);
    expect(sums).toEqual([0, 5]);
  });

  it('sorts ascending and stays unique under larger bag', () => {
    const sums = getAllPossibleSums([1, 1, 2, 3]);
    expect(sums).toEqual([...sums].sort((a, b) => a - b));
    expect(new Set(sums).size).toBe(sums.length);
    expect(sums[0]).toBe(1);
    expect(sums[sums.length - 1]).toBe(7);
  });
});

describe('Wave 32 dice — subset sums stress', () => {
  it('6 distinct unit faces yield 1..6', () => {
    expect(getAllPossibleSums([1, 1, 1, 1, 1, 1])).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('does not include the empty-subset zero for positive faces', () => {
    const sums = getAllPossibleSums([2, 5, 7]);
    expect(sums).not.toContain(0);
  });
});
