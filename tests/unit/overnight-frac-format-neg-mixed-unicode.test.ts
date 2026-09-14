/**
 * Overnight TOKENMAXX HEAVY — formatFraction negative mixed unicode leftover.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  formatFraction,
  createFraction,
} from '../../src/core/fractions/arithmetic';

describe('Overnight frac — negative mixed unicode format', () => {
  it('formats -2 ½ and -1 ¾ with mixed+unicode', () => {
    expect(
      formatFraction(createFraction(-5, 2), {
        showMixedNumber: true,
        useUnicodeFractions: true,
      })
    ).toBe('-2 ½');
    expect(
      formatFraction(createFraction(-7, 4), {
        showMixedNumber: true,
        useUnicodeFractions: true,
      })
    ).toBe('-1 ¾');
  });

  it('flag-negative improper mixes the same way', () => {
    expect(
      formatFraction(
        { numerator: 5, denominator: 2, isNegative: true },
        { showMixedNumber: true, useUnicodeFractions: true }
      )
    ).toBe('-2 ½');
  });
});
