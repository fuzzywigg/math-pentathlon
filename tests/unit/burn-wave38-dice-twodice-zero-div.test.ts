/**
 * Wave 38 — getTwoDiceResults zero-division leftovers.
 * Wave 35 dense grid started at 1. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getTwoDiceResults } from '../../src/core/dice';

describe('Wave 38 dice-two — zero division', () => {
  it('(0,b) omits divisions involving ÷0 but keeps multiply-by-zero', () => {
    const map = getTwoDiceResults(0, 4);
    expect(map.get('0 × 4')).toBe(0);
    expect(map.get('0 + 4')).toBe(4);
    expect(map.has('0 ÷ 4')).toBe(true); // 0 % 4 === 0
    expect(map.has('4 ÷ 0')).toBe(false);
  });

  it('(a,0) omits a÷0 and keeps 0÷a when integer', () => {
    const map = getTwoDiceResults(5, 0);
    expect(map.has('5 ÷ 0')).toBe(false);
    expect(map.has('0 ÷ 5')).toBe(true);
    expect(map.get('5 × 0')).toBe(0);
  });

  it('(0,0) never emits division keys', () => {
    const map = getTwoDiceResults(0, 0);
    const keys = [...map.keys()];
    expect(keys.some((k) => k.includes('÷'))).toBe(false);
    expect(map.get('0 × 0')).toBe(0);
    expect(map.get('0 + 0')).toBe(0);
  });

  it('nonzero integer pair still includes both division directions when even', () => {
    const map = getTwoDiceResults(6, 3);
    expect(map.get('6 ÷ 3')).toBe(2);
    expect(map.get('3 ÷ 6')).toBeUndefined();
  });
});
