/**
 * Overnight TOKENMAXX HEAVY — formatMixedNumber + reciprocal flag leftovers.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  formatMixedNumber,
  reciprocal,
  createFraction,
  toDecimal,
} from '../../src/core/fractions/arithmetic';
import type { Fraction } from '../../src/core/fractions/types';

describe('Overnight frac — formatMixedNumber + reciprocal flag', () => {
  it('formatMixedNumber for negatives and wholes', () => {
    expect(formatMixedNumber(createFraction(-7, 3))).toBe('-2 1/3');
    expect(formatMixedNumber(createFraction(6, 3))).toBe('2');
    expect(formatMixedNumber(createFraction(2, 5))).toBe('2/5');
  });

  it('reciprocal of flag-negative returns createFraction form', () => {
    const f: Fraction = { numerator: 2, denominator: 5, isNegative: true };
    const r = reciprocal(f);
    // toStandardForm → -2/5 → createFraction(5, -2) → flips to -5/2
    expect(r).toEqual({ numerator: -5, denominator: 2 });
    expect(toDecimal(r)).toBe(-2.5);
  });
});
