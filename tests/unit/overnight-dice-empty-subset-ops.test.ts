/**
 * Overnight TOKENMAXX — empty subset sum/product leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAllPossibleSums, getAllPossibleProducts, getTwoDiceResults } from '../../src/core/dice/roller';

describe('Overnight dice — empty/zero subset edges', () => {
  it('empty values yield empty catalogs', () => {
    expect(getAllPossibleSums([])).toEqual([]);
    expect(getAllPossibleProducts([])).toEqual([]);
  });

  it('two-dice with zero allows 0÷n but not n÷0', () => {
    const r = getTwoDiceResults(0, 5);
    expect(r.get('0 ÷ 5')).toBe(0);
    expect(r.has('5 ÷ 0')).toBe(false);
    expect(r.get('0 + 5')).toBe(5);
  });
});
