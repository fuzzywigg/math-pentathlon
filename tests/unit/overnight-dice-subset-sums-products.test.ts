/**
 * Overnight TOKENMAXX — subset sums/products + two-dice leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getAllPossibleSums,
  getAllPossibleProducts,
  getTwoDiceResults,
  getDiceConfig,
} from '../../src/core/dice/roller';

describe('Overnight dice — subset arithmetic', () => {
  it('sums powerset for [1,2,3]', () => {
    expect(getAllPossibleSums([1, 2, 3])).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('products powerset for [2,3,4]', () => {
    expect(getAllPossibleProducts([2, 3, 4])).toEqual([2, 3, 4, 6, 8, 12, 24]);
  });

  it('two-dice results include integer divisions only', () => {
    const r = getTwoDiceResults(6, 3);
    expect(r.get('6 + 3')).toBe(9);
    expect(r.get('6 − 3') ?? r.get('6 - 3')).toBeDefined();
    expect(r.get('6 ÷ 3')).toBe(2);
    expect(r.has('3 ÷ 6')).toBe(false);
    const noDiv = getTwoDiceResults(5, 2);
    expect([...noDiv.keys()].some((k) => k.includes('÷'))).toBe(false);
  });

  it('getDiceConfig returns faces for known types', () => {
    expect(getDiceConfig('d20').faces).toBe(20);
    expect(getDiceConfig('d6').faces).toBe(6);
  });
});
