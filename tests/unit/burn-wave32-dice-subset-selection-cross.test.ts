/**
 * Wave 32 — subset sum/product cross-checks vs selected totals.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  rollMultiple,
  selectDice,
  getSelectedValues,
  getSelectedTotal,
  getAllPossibleSums,
  getAllPossibleProducts,
} from '../../src/core/dice';

function stubRandom(kind: 'min' | 'max' | 'mid' = 'min'): void {
  let i = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    i += 1;
    if (kind === 'min') return (i % 10_000) * 1e-7;
    if (kind === 'mid') return 0.5 + (i % 100) * 1e-9;
    return 0.999999 - (i % 10_000) * 1e-12;
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 32 dice — selection ⊆ subset catalogs', () => {
  it('every non-empty selection sum appears in getAllPossibleSums', () => {
    stubRandom('mid');
    const result = rollMultiple('d6', 4);
    const allValues = result.rolls.map((r) => r.value);
    const sums = getAllPossibleSums(allValues);
    const ids = result.rolls.map((r) => r.id);

    for (let mask = 1; mask < 1 << ids.length; mask++) {
      const pick = ids.filter((_, i) => mask & (1 << i));
      const selected = selectDice(result, pick, true);
      const total = getSelectedTotal(selected);
      expect(sums).toContain(total);
      expect(getSelectedValues(selected)).toHaveLength(pick.length);
    }
  });

  it('every non-empty selection product appears in getAllPossibleProducts', () => {
    stubRandom('min');
    const result = rollMultiple('d6', 3);
    const allValues = result.rolls.map((r) => r.value);
    const products = getAllPossibleProducts(allValues);
    const ids = result.rolls.map((r) => r.id);

    for (let mask = 1; mask < 1 << ids.length; mask++) {
      const pick = ids.filter((_, i) => mask & (1 << i));
      const selected = selectDice(result, pick, true);
      const values = getSelectedValues(selected);
      const product = values.reduce((p, v) => p * v, 1);
      expect(products).toContain(product);
    }
  });

  it('full-set sum equals roll total and max catalog entry', () => {
    stubRandom('max');
    const result = rollMultiple('d8', 3);
    const sums = getAllPossibleSums(result.rolls.map((r) => r.value));
    expect(sums[sums.length - 1]).toBe(result.total);
    expect(result.total).toBe(24);
  });
});
