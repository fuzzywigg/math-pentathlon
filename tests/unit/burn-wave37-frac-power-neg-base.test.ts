/**
 * Wave 37 — power with negative bases leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  power,
  areEqual,
  simplify,
  fromWhole,
} from '../../src/core/fractions';

describe('Wave 37 frac-power-neg — signed bases', () => {
  it('even exponents yield positive; odd keep sign', () => {
    const base = createFraction(-2, 3);
    expect(areEqual(simplify(power(base, 2)), createFraction(4, 9))).toBe(true);
    expect(areEqual(simplify(power(base, 3)), createFraction(-8, 27))).toBe(
      true
    );
    expect(areEqual(power(base, 0), fromWhole(1))).toBe(true);
  });

  it('flag-negative base powers via toStandardForm', () => {
    const base = { numerator: 2, denominator: 5, isNegative: true };
    const p2 = power(base, 2);
    expect(areEqual(simplify(p2), createFraction(4, 25))).toBe(true);
    const p3 = power(base, 3);
    expect(areEqual(simplify(p3), createFraction(-8, 125))).toBe(true);
  });
});
