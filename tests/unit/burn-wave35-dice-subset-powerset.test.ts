/**
 * Wave 35 — subset sum/product power-set cardinality & sort contracts.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getAllPossibleSums, getAllPossibleProducts } from '../../src/core/dice';

describe('Wave 35 dice-powerset — distinct values cardinality', () => {
  it('all-distinct positives: sums cover 2^n-1 masks (may collide)', () => {
    // powers of 2 guarantee unique subset sums
    const values = [1, 2, 4, 8];
    const sums = getAllPossibleSums(values);
    expect(sums).toHaveLength(15);
    expect(sums).toEqual([...sums].sort((a, b) => a - b));
    expect(sums[0]).toBe(1);
    expect(sums[sums.length - 1]).toBe(15);
  });

  it('duplicate values collapse sum set size', () => {
    const sums = getAllPossibleSums([2, 2, 2]);
    // subsets: 2, 4, 6 only
    expect(sums).toEqual([2, 4, 6]);
  });
});

describe('Wave 35 dice-powerset — products', () => {
  it('powers-of-two products are unique for small n', () => {
    const values = [2, 3, 5];
    const products = getAllPossibleProducts(values);
    expect(products).toEqual([2, 3, 5, 6, 10, 15, 30]);
  });

  it('sorted ascending always', () => {
    for (const values of [
      [9, 1, 4],
      [7, 7],
      [10, 2, 5, 1],
    ]) {
      const sums = getAllPossibleSums(values);
      const products = getAllPossibleProducts(values);
      expect(sums).toEqual([...sums].sort((a, b) => a - b));
      expect(products).toEqual([...products].sort((a, b) => a - b));
    }
  });
});
