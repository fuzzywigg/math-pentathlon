/**
 * Wave 41 — Fab-a-Diffy divide-by-zero null leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  calculateResult,
  getPossibleResults,
} from '../../src/games/fab-a-diffy/rules';
import type { FractionBar } from '../../src/games/fab-a-diffy/types';
import type { Fraction } from '../../src/core/fractions/types';

describe('Wave 41 fab-a-diffy — divide-by-zero null', () => {
  const half: Fraction = { numerator: 1, denominator: 2 };
  const zero: Fraction = { numerator: 0, denominator: 1 };

  it('calculateResult divide returns null when divisor numerator is 0', () => {
    expect(calculateResult(half, zero, 'divide')).toBeNull();
    expect(calculateResult(zero, zero, 'divide')).toBeNull();
  });

  it('other ops with zero still return fractions', () => {
    expect(calculateResult(half, zero, 'add')).toEqual({
      numerator: 1,
      denominator: 2,
    });
    expect(calculateResult(half, zero, 'subtract')).toEqual({
      numerator: 1,
      denominator: 2,
    });
    expect(calculateResult(half, zero, 'multiply')).toEqual({
      numerator: 0,
      denominator: 1,
    });
  });

  it('getPossibleResults omits invalid divide when one bar is zero', () => {
    const barA: FractionBar = {
      id: 'a',
      fraction: half,
      owner: null,
      used: false,
    };
    const barB: FractionBar = {
      id: 'b',
      fraction: zero,
      owner: null,
      used: false,
    };
    const results = getPossibleResults(barA, barB);
    expect(results.every((r) => r.result.numerator >= 0)).toBe(true);
    // reverse divide zero/half is fine; forward half/0 must not appear
    const bad = results.find(
      (r) =>
        r.operation === 'divide' &&
        r.result.numerator === Infinity
    );
    expect(bad).toBeUndefined();
    expect(calculateResult(half, zero, 'divide')).toBeNull();
  });
});
