/**
 * Wave 38 — dice subset sums/products + two-dice ops leftovers.
 * Beyond wave 32 subset smoke. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getAllPossibleSums,
  getAllPossibleProducts,
  getTwoDiceResults,
} from '../../src/core/dice';

describe('Wave 38 dice-subsets — sum/product cardinality', () => {
  it('empty values yield empty subsets', () => {
    expect(getAllPossibleSums([])).toEqual([]);
    expect(getAllPossibleProducts([])).toEqual([]);
  });

  it('singleton yields itself for both sum and product', () => {
    expect(getAllPossibleSums([7])).toEqual([7]);
    expect(getAllPossibleProducts([7])).toEqual([7]);
  });

  it('distinct powers-of-two produce unique subset sums', () => {
    const vals = [1, 2, 4, 8];
    const sums = getAllPossibleSums(vals);
    expect(sums).toHaveLength(15);
    expect(sums[0]).toBe(1);
    expect(sums.at(-1)).toBe(15);
    expect(new Set(sums).size).toBe(15);
  });

  it('duplicate values collapse product set size', () => {
    expect(getAllPossibleProducts([2, 2, 3])).toEqual([2, 3, 4, 6, 12]);
  });

  it('includes zero in sums; products include zero when a factor is 0', () => {
    expect(getAllPossibleSums([0, 5])).toEqual([0, 5]);
    expect(getAllPossibleProducts([0, 5])).toEqual([0, 5]);
  });
});

describe('Wave 38 dice-twodice — arithmetic map edges', () => {
  it('covers + − × and integer ÷ both ways', () => {
    const m = getTwoDiceResults(6, 3);
    expect(m.get('6 + 3')).toBe(9);
    expect(m.get('6 - 3')).toBe(3);
    expect(m.get('3 - 6')).toBe(-3);
    expect(m.get('6 × 3')).toBe(18);
    expect(m.get('6 ÷ 3')).toBe(2);
    expect(m.has('3 ÷ 6')).toBe(false);
  });

  it('skips dividing by zero but allows zero÷nonzero when integer', () => {
    const m = getTwoDiceResults(5, 0);
    expect(m.get('5 + 0')).toBe(5);
    expect(m.get('5 × 0')).toBe(0);
    expect(m.has('5 ÷ 0')).toBe(false);
    expect(m.get('0 ÷ 5')).toBe(0);
  });

  it('equal dice still expose subtraction and ÷ 1', () => {
    const m = getTwoDiceResults(4, 4);
    expect(m.get('4 - 4')).toBe(0);
    expect(m.get('4 ÷ 4')).toBe(1);
  });
});
