/**
 * Wave 32 — getTwoDiceResults op matrix including division / zero edges.
 * Deepens two-dice arithmetic map used by combo games. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getTwoDiceResults } from '../../src/core/dice';

describe('Wave 32 dice-two-ops — symmetric arithmetic grid', () => {
  const pairs: Array<[number, number]> = [
    [1, 1],
    [2, 3],
    [6, 3],
    [8, 2],
    [9, 6],
    [7, 4],
    [10, 5],
    [12, 4],
  ];

  it('always includes + − × and ordered subtractions', () => {
    for (const [a, b] of pairs) {
      const map = getTwoDiceResults(a, b);
      expect(map.get(`${a} + ${b}`)).toBe(a + b);
      expect(map.get(`${a} - ${b}`)).toBe(a - b);
      expect(map.get(`${b} - ${a}`)).toBe(b - a);
      expect(map.get(`${a} × ${b}`)).toBe(a * b);
    }
  });

  it('includes integer division only when evenly divisible', () => {
    expect(getTwoDiceResults(6, 3).get('6 ÷ 3')).toBe(2);
    expect(getTwoDiceResults(6, 3).get('3 ÷ 6')).toBeUndefined();
    expect(getTwoDiceResults(8, 2).get('8 ÷ 2')).toBe(4);
    expect(getTwoDiceResults(7, 4).has('7 ÷ 4')).toBe(false);
    expect(getTwoDiceResults(7, 4).has('4 ÷ 7')).toBe(false);
  });

  it('mutual divisors emit both directions', () => {
    const map = getTwoDiceResults(4, 2);
    expect(map.get('4 ÷ 2')).toBe(2);
    expect(map.get('2 ÷ 4')).toBeUndefined(); // 2%4 !== 0
    const equal = getTwoDiceResults(5, 5);
    expect(equal.get('5 ÷ 5')).toBe(1);
  });
});

describe('Wave 32 dice-two-ops — zero edges', () => {
  it('never divides by zero; multiply-by-zero allowed', () => {
    const a0 = getTwoDiceResults(5, 0);
    expect(a0.get('5 + 0')).toBe(5);
    expect(a0.get('5 - 0')).toBe(5);
    expect(a0.get('0 - 5')).toBe(-5);
    expect(a0.get('5 × 0')).toBe(0);
    expect(a0.has('5 ÷ 0')).toBe(false);
    // 0 % 5 === 0 → 0÷5 = 0 is integer division
    expect(a0.get('0 ÷ 5')).toBe(0);
  });

  it('0,0: add/sub/mul only — no ÷0', () => {
    const map = getTwoDiceResults(0, 0);
    expect(map.get('0 + 0')).toBe(0);
    expect(map.get('0 - 0')).toBe(0);
    expect(map.get('0 × 0')).toBe(0);
    expect(map.has('0 ÷ 0')).toBe(false);
  });
});
