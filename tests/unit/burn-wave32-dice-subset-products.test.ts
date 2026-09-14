/**
 * Wave 32 — getAllPossibleProducts subset / empty / zero / stress edges.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { getAllPossibleProducts } from '../../src/core/dice';

describe('Wave 32 dice — subset products catalog', () => {
  it('returns empty array for empty input', () => {
    expect(getAllPossibleProducts([])).toEqual([]);
  });

  it('enumerates products for [2,3,5]', () => {
    // 2,3,5,6,10,15,30
    expect(getAllPossibleProducts([2, 3, 5])).toEqual([2, 3, 5, 6, 10, 15, 30]);
  });

  it('dedupes when faces repeat', () => {
    expect(getAllPossibleProducts([2, 2, 2])).toEqual([2, 4, 8]);
  });

  it('zero face collapses products that include it to 0', () => {
    const products = getAllPossibleProducts([0, 4]);
    expect(products).toContain(0);
    expect(products).toContain(4);
    expect(products).toEqual([0, 4]);
  });

  it('single value is identity', () => {
    expect(getAllPossibleProducts([7])).toEqual([7]);
  });
});

describe('Wave 32 dice — subset products stress', () => {
  it('sorts ascending unique for mixed bag', () => {
    const products = getAllPossibleProducts([1, 2, 2, 3]);
    expect(products).toEqual([...products].sort((a, b) => a - b));
    expect(new Set(products).size).toBe(products.length);
    expect(products).toContain(1);
    expect(products).toContain(12);
  });
});
