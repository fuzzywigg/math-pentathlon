/**
 * Wave 35 — empty / singleton subset sum & product contracts.
 * Deepens roller leftovers after #156 / #160. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getAllPossibleSums, getAllPossibleProducts } from '../../src/core/dice';

describe('Wave 35 dice-empty-subsets — empty input', () => {
  it('returns empty arrays for empty values', () => {
    expect(getAllPossibleSums([])).toEqual([]);
    expect(getAllPossibleProducts([])).toEqual([]);
  });
});

describe('Wave 35 dice-empty-subsets — singletons', () => {
  it('singleton sum/product equals the value', () => {
    for (const v of [0, 1, 7, 12, -3]) {
      expect(getAllPossibleSums([v])).toEqual([v]);
      expect(getAllPossibleProducts([v])).toEqual([v]);
    }
  });
});

describe('Wave 35 dice-empty-subsets — zeros', () => {
  it('zero in set keeps 0 in products and does not inflate sums', () => {
    const sums = getAllPossibleSums([0, 2, 3]);
    expect(sums).toContain(0);
    expect(sums).toContain(2);
    expect(sums).toContain(3);
    expect(sums).toContain(5);
    const products = getAllPossibleProducts([0, 2, 3]);
    expect(products).toContain(0);
    expect(products).toContain(2);
    expect(products).toContain(6);
  });
});
