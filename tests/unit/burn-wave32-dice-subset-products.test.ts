/**
 * Wave 32 — getAllPossibleProducts exhaustive / zero / one edges.
 * Deepens subset-product helpers beyond wave 27 smoke. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getAllPossibleProducts } from '../../src/core/dice';

function expectedSubsetProducts(values: number[]): number[] {
  const products = new Set<number>();
  const n = values.length;
  for (let mask = 1; mask < 1 << n; mask++) {
    let product = 1;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) product *= values[i];
    }
    products.add(product);
  }
  return Array.from(products).sort((a, b) => a - b);
}

describe('Wave 32 dice-products — exhaustive agreement', () => {
  it.each([
    [[2]],
    [[2, 3]],
    [[2, 3, 4]],
    [[1, 1, 1]],
    [[5, 5]],
    [[2, 2, 3, 3]],
  ])('matches bit-mask reference for %j', (values) => {
    expect(getAllPossibleProducts(values)).toEqual(
      expectedSubsetProducts(values)
    );
  });

  it('empty input yields empty list', () => {
    expect(getAllPossibleProducts([])).toEqual([]);
  });

  it('including 0 collapses many subsets to 0', () => {
    const products = getAllPossibleProducts([0, 2, 3]);
    expect(products).toContain(0);
    expect(products).toContain(2);
    expect(products).toContain(3);
    expect(products).toContain(6);
    expect(products).toEqual(expectedSubsetProducts([0, 2, 3]));
  });
});

describe('Wave 32 dice-products — sorting + uniqueness', () => {
  it('dedupes identical products from different subsets', () => {
    // 2*6 and 3*4 both = 12
    const products = getAllPossibleProducts([2, 3, 4, 6]);
    expect(products.filter((p) => p === 12)).toHaveLength(1);
    expect(products).toEqual([...products].sort((a, b) => a - b));
  });

  it('ones do not inflate beyond other factors', () => {
    expect(getAllPossibleProducts([1, 5, 1])).toEqual(
      expectedSubsetProducts([1, 5, 1])
    );
    expect(getAllPossibleProducts([1, 5, 1])).toContain(5);
    expect(getAllPossibleProducts([1, 5, 1])).toContain(1);
  });
});
