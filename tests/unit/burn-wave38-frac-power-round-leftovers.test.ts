/**
 * Wave 38 — fraction power / round leftovers after #171.
 * Distinct from wave 37 power-round matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  power,
  reciprocal,
  roundToDenominator,
  areEqual,
  toDecimal,
  fromWhole,
} from '../../src/core/fractions';

const F = createFraction;

describe('Wave 38 frac-power — integer exponent leftovers', () => {
  it('power 0 is 1; negative exponents use reciprocal', () => {
    expect(areEqual(power(F(3, 5), 0), fromWhole(1))).toBe(true);
    expect(areEqual(power(F(2, 3), -1), F(3, 2))).toBe(true);
    expect(areEqual(power(F(2, 3), -2), F(9, 4))).toBe(true);
    expect(areEqual(reciprocal(power(F(3, 4), 2)), power(reciprocal(F(3, 4)), 2))).toBe(
      true
    );
  });
});

describe('Wave 38 frac-round — denominator snapping leftovers', () => {
  it('already-matching denoms snap to themselves', () => {
    expect(roundToDenominator(F(3, 8), 8)).toEqual({
      numerator: 3,
      denominator: 8,
    });
  });

  it('round stays within half a tick of original value', () => {
    for (const f of [F(5, 7), F(-2, 9), F(11, 13)]) {
      for (const d of [4, 8, 10]) {
        const r = roundToDenominator(f, d);
        expect(r.denominator).toBe(d);
        expect(Math.abs(toDecimal(r) - toDecimal(f))).toBeLessThanOrEqual(
          0.5 / d + 1e-9
        );
      }
    }
  });
});
