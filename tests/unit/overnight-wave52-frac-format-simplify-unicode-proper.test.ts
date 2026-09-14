/**
 * Overnight HEAVY leftover after #234 — formatFraction simplify + unicode proper.
 * Neg mixed unicode covered; unreduced proper with both flags not. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { formatFraction } from '../../src/core/fractions/arithmetic';

describe('Wave 52 frac — simplify unicode proper', () => {
  it('simplifies 2/4 to unicode ½ when both options set', () => {
    expect(
      formatFraction(
        { numerator: 2, denominator: 4 },
        { simplify: true, useUnicodeFractions: true }
      )
    ).toBe('½');
  });
});
