/**
 * Overnight TOKENMAXX HEAVY — abs / isPositive / isNegative flag lattice leftovers.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  abs,
  isPositive,
  isNegative,
  isZero,
  isProper,
  isWholeNumber,
} from '../../src/core/fractions/arithmetic';
import type { Fraction } from '../../src/core/fractions/types';

describe('Overnight frac — predicate flag lattice leftovers', () => {
  it('abs strips isNegative flag — flag-neg becomes positive-looking', () => {
    const f: Fraction = { numerator: 3, denominator: 4, isNegative: true };
    const a = abs(f);
    // abs only copies abs(numerator)+denominator — drops isNegative
    expect(a).toEqual({ numerator: 3, denominator: 4 });
    expect(isNegative(a)).toBe(false);
    expect(isPositive(a)).toBe(true);
    expect(isNegative(f)).toBe(true);
  });

  it('zero with flag still isZero; improper/whole boundaries', () => {
    expect(isZero({ numerator: 0, denominator: 5, isNegative: true })).toBe(
      true
    );
    expect(isProper({ numerator: 5, denominator: 5 })).toBe(false);
    expect(isWholeNumber({ numerator: -9, denominator: 3 })).toBe(true);
    expect(isWholeNumber({ numerator: 5, denominator: 2 })).toBe(false);
  });
});
