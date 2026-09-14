/**
 * Wave 40 — getAllPossibleProducts empty/zero leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getAllPossibleProducts } from '../../src/core/dice';

describe('Wave 40 dice — products zero / empty', () => {
  it('empty values → empty products', () => {
    expect(getAllPossibleProducts([])).toEqual([]);
  });

  it('zero with positive yields 0 among products', () => {
    const products = getAllPossibleProducts([0, 4]);
    expect(products).toContain(0);
    expect(products).toContain(4);
    expect(products.sort((a, b) => a - b)).toEqual([0, 4]);
  });
});
