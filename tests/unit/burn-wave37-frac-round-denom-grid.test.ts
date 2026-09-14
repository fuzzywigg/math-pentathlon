/**
 * Wave 37 — roundToDenominator dense grid leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  roundToDenominator,
  toDecimal,
  fromWhole,
} from '../../src/core/fractions';

describe('Wave 37 frac-round — target denominator matrix', () => {
  const targets = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 100];

  it('always returns exact targetDenominator', () => {
    const samples = [
      createFraction(1, 3),
      createFraction(2, 7),
      createFraction(5, 6),
      createFraction(-4, 9),
      fromWhole(0),
      fromWhole(2),
    ];
    for (const f of samples) {
      for (const t of targets) {
        const r = roundToDenominator(f, t);
        expect(r.denominator).toBe(t);
        expect(Number.isInteger(r.numerator)).toBe(true);
        expect(Math.abs(toDecimal(r) - toDecimal(f))).toBeLessThanOrEqual(
          0.5 / t + 1e-12
        );
      }
    }
  });

  it('idempotent when already at target denom after round', () => {
    for (const t of targets) {
      const once = roundToDenominator(createFraction(7, 11), t);
      const twice = roundToDenominator(once, t);
      expect(twice).toEqual(once);
    }
  });

  it('whole numbers map to n*target / target', () => {
    expect(roundToDenominator(fromWhole(3), 8)).toEqual({
      numerator: 24,
      denominator: 8,
    });
  });
});
