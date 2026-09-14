/**
 * Wave 32 — getTwoDiceResults arithmetic + division edge matrix.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { getTwoDiceResults } from '../../src/core/dice';

describe('Wave 32 dice — two-dice ops baseline', () => {
  it('always emits add / both subtracts / multiply', () => {
    const map = getTwoDiceResults(7, 2);
    expect(map.get('7 + 2')).toBe(9);
    expect(map.get('7 - 2')).toBe(5);
    expect(map.get('2 - 7')).toBe(-5);
    expect(map.get('7 × 2')).toBe(14);
  });

  it('includes both integer divisions when each divides the other', () => {
    const map = getTwoDiceResults(6, 3);
    expect(map.get('6 ÷ 3')).toBe(2);
    expect(map.has('3 ÷ 6')).toBe(false);
  });

  it('equal faces divide both ways to 1', () => {
    const map = getTwoDiceResults(5, 5);
    expect(map.get('5 ÷ 5')).toBe(1);
    // Same key written twice — Map still has one entry
    expect([...map.keys()].filter((k) => k.includes('÷'))).toEqual(['5 ÷ 5']);
  });
});

describe('Wave 32 dice — two-dice division edges', () => {
  it('omits non-integer divisions both ways', () => {
    const map = getTwoDiceResults(5, 3);
    expect(map.has('5 ÷ 3')).toBe(false);
    expect(map.has('3 ÷ 5')).toBe(false);
  });

  it('guards division by zero on either side', () => {
    const a = getTwoDiceResults(8, 0);
    expect(a.get('8 × 0')).toBe(0);
    expect(a.get('8 + 0')).toBe(8);
    expect(a.has('8 ÷ 0')).toBe(false);
    expect(a.has('0 ÷ 8')).toBe(true);
    expect(a.get('0 ÷ 8')).toBe(0);

    const b = getTwoDiceResults(0, 4);
    expect(b.has('0 ÷ 4')).toBe(true);
    expect(b.get('0 ÷ 4')).toBe(0);
    expect(b.has('4 ÷ 0')).toBe(false);
  });

  it('both zeros: multiply/add/sub present; no division', () => {
    const map = getTwoDiceResults(0, 0);
    expect(map.get('0 + 0')).toBe(0);
    expect(map.get('0 - 0')).toBe(0);
    expect(map.get('0 × 0')).toBe(0);
    expect(map.has('0 ÷ 0')).toBe(false);
  });
});

describe('Wave 32 dice — two-dice asymmetric integer divide', () => {
  it('only includes b÷a when a divides b', () => {
    const map = getTwoDiceResults(2, 8);
    expect(map.get('8 ÷ 2')).toBe(4);
    expect(map.has('2 ÷ 8')).toBe(false);
  });
});
