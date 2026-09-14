/**
 * Wave 37 — areEqual / areEquivalent dual-style leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  areEqual,
  areEquivalent,
  simplify,
} from '../../src/core/fractions';

describe('Wave 37 frac-equal — dual styles', () => {
  it('areEqual matches areEquivalent for scaled pairs', () => {
    const pairs = [
      [createFraction(1, 2), createFraction(2, 4)],
      [createFraction(3, 9), createFraction(1, 3)],
      [createFraction(-1, 2), createFraction(-2, 4)],
      [createFraction(-1, 2), { numerator: 1, denominator: 2, isNegative: true }],
      [createFraction(0, 3), createFraction(0, 9)],
      [createFraction(5, 1), createFraction(10, 2)],
    ];
    for (const [a, b] of pairs) {
      expect(areEqual(a, b)).toBe(true);
      expect(areEquivalent(a, b)).toBe(true);
      expect(areEqual(simplify(a), simplify(b))).toBe(true);
    }
  });

  it('unequal pairs', () => {
    expect(areEqual(createFraction(1, 2), createFraction(1, 3))).toBe(false);
    expect(areEqual(createFraction(1, 2), createFraction(-1, 2))).toBe(false);
  });
});
