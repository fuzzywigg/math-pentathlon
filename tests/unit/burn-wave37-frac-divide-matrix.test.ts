/**
 * Wave 37 — divide matrix leftovers vs multiply-reciprocal.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  divide,
  multiply,
  reciprocal,
  areEqual,
  simplify,
  COMMON_FRACTIONS,
} from '../../src/core/fractions';

describe('Wave 37 frac-divide — matrix', () => {
  it('a/b == a * reciprocal(b) for nonzero commons', () => {
    for (const a of COMMON_FRACTIONS) {
      for (const b of COMMON_FRACTIONS) {
        if (b.numerator === 0) continue;
        const q = divide(a, b);
        const m = multiply(a, reciprocal(b));
        expect(areEqual(simplify(q), simplify(m))).toBe(true);
      }
    }
  });

  it('a/a == 1 for nonzero', () => {
    for (const a of COMMON_FRACTIONS) {
      if (a.numerator === 0) continue;
      expect(areEqual(simplify(divide(a, a)), createFraction(1, 1))).toBe(
        true
      );
    }
  });
});
