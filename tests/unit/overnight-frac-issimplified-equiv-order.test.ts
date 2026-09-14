/**
 * Overnight TOKENMAXX HEAVY — isSimplified flag form + findEquivalent ordering leftover.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  isSimplified,
  findEquivalentFractions,
  simplify,
} from '../../src/core/fractions/arithmetic';
import type { Fraction } from '../../src/core/fractions/types';

describe('Overnight frac — isSimplified flag + equiv order', () => {
  it('isSimplified ignores isNegative; unsimplified flag is false', () => {
    expect(
      isSimplified({ numerator: 3, denominator: 4, isNegative: true })
    ).toBe(true);
    expect(
      isSimplified({ numerator: 2, denominator: 4, isNegative: true })
    ).toBe(false);
  });

  it('findEquivalentFractions(2/4, max=4) starts at simplified base', () => {
    const input: Fraction = { numerator: 2, denominator: 4 };
    expect(simplify(input)).toEqual({
      numerator: 1,
      denominator: 2,
      isNegative: false,
    });
    expect(findEquivalentFractions(input, 4)).toEqual([
      { numerator: 1, denominator: 2 },
      { numerator: 2, denominator: 4 },
    ]);
  });

  it('flag-negative equivalents keep negative numerators', () => {
    const eq = findEquivalentFractions(
      { numerator: 1, denominator: 3, isNegative: true },
      6
    );
    expect(eq).toEqual([
      { numerator: -1, denominator: 3 },
      { numerator: -2, denominator: 6 },
    ]);
  });
});
