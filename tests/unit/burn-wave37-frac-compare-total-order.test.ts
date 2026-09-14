/**
 * Wave 37 — compare total-order leftovers across COMMON_FRACTIONS.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  COMMON_FRACTIONS,
  compare,
  areEqual,
  areEquivalent,
  toDecimal,
  createFraction,
} from '../../src/core/fractions';

describe('Wave 37 frac-compare — total order invariants', () => {
  it('compare is antisymmetric and agrees with decimals', () => {
    for (const a of COMMON_FRACTIONS) {
      for (const b of COMMON_FRACTIONS) {
        const c = compare(a, b);
        // avoid Object.is(-0, 0) when c === 0
        expect(compare(b, a)).toBe(c === 0 ? 0 : ((-c) as -1 | 1));
        if (c === 0) {
          expect(areEqual(a, b)).toBe(true);
          expect(areEquivalent(a, b)).toBe(true);
        } else if (c < 0) {
          expect(toDecimal(a)).toBeLessThan(toDecimal(b) + 1e-12);
        } else {
          expect(toDecimal(a)).toBeGreaterThan(toDecimal(b) - 1e-12);
        }
      }
    }
  });

  it('transitivity spot-check on sorted commons', () => {
    const sorted = [...COMMON_FRACTIONS].sort((a, b) => compare(a, b));
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(compare(sorted[i]!, sorted[i + 1]!)).toBeLessThanOrEqual(0);
    }
  });

  it('flag-negative vs signed-numerator compare equal', () => {
    const a = createFraction(-3, 5);
    const b = { numerator: 3, denominator: 5, isNegative: true };
    expect(compare(a, b)).toBe(0);
    expect(areEqual(a, b)).toBe(true);
  });
});
