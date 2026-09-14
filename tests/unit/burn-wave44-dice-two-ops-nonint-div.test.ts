/**
 * Wave 44 — getTwoDiceResults omits non-integer division leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getTwoDiceResults } from '../../src/core/dice';

describe('Wave 44 dice — two-ops non-int division', () => {
  it('5 and 2 omit both divisions', () => {
    const map = getTwoDiceResults(5, 2);
    expect(map.has('5 ÷ 2')).toBe(false);
    expect(map.has('2 ÷ 5')).toBe(false);
    expect(map.get('5 + 2')).toBe(7);
    expect(map.get('5 × 2')).toBe(10);
  });

  it('8 and 2 include both integer divisions', () => {
    const map = getTwoDiceResults(8, 2);
    expect(map.get('8 ÷ 2')).toBe(4);
    expect(map.get('2 ÷ 8')).toBeUndefined();
  });
});
