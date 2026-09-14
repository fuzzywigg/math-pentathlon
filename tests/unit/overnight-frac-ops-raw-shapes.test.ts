/**
 * Overnight TOKENMAXX HEAVY — subtract/divide/power/negate raw shape leftovers.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  subtract,
  divide,
  power,
  negate,
  toDecimal,
  createFraction,
} from '../../src/core/fractions/arithmetic';
import type { Fraction } from '../../src/core/fractions/types';

describe('Overnight frac — raw op shapes + negate flag', () => {
  it('subtract with flag-negative yields raw {n,d} without isNegative', () => {
    const a: Fraction = { numerator: 1, denominator: 2, isNegative: true };
    const b = createFraction(1, 4);
    const r = subtract(a, b);
    expect(r).toEqual({ numerator: -3, denominator: 4 });
    expect('isNegative' in r && (r as Fraction).isNegative).toBeFalsy();
  });

  it('divide returns unsimplified multiply-by-reciprocal raw', () => {
    const r = divide(createFraction(1, 2), createFraction(1, 4));
    expect(r).toEqual({ numerator: 4, denominator: 2 });
  });

  it('power(flag-neg, odd) returns negative-numerator style', () => {
    const base: Fraction = { numerator: 2, denominator: 5, isNegative: true };
    const r = power(base, 3);
    expect(r).toEqual({ numerator: -8, denominator: 125 });
    expect((r as Fraction).isNegative).toBeUndefined();
  });

  it('negate on flag-negative keeps value negative (single negate)', () => {
    const f: Fraction = { numerator: 3, denominator: 5, isNegative: true };
    const n = negate(f);
    expect(n).toEqual({ numerator: -3, denominator: 5 });
    expect(toDecimal(n)).toBe(-0.6);
    // Original toDecimal also negative via flag
    expect(toDecimal(f)).toBe(-0.6);
  });
});
