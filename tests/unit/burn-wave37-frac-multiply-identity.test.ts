/**
 * Wave 37 — multiply identity/zero leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  COMMON_FRACTIONS,
  multiply,
  areEqual,
  simplify,
  createFraction,
  fromWhole,
  isZero,
} from '../../src/core/fractions';

describe('Wave 37 frac-mul — identity and zero', () => {
  it('a*1 == a; a*0 == 0', () => {
    const one = fromWhole(1);
    const zero = fromWhole(0);
    for (const a of COMMON_FRACTIONS) {
      expect(areEqual(simplify(multiply(a, one)), simplify(a))).toBe(true);
      expect(isZero(multiply(a, zero))).toBe(true);
    }
  });

  it('commutativity on commons', () => {
    for (const a of COMMON_FRACTIONS) {
      for (const b of COMMON_FRACTIONS) {
        expect(
          areEqual(simplify(multiply(a, b)), simplify(multiply(b, a)))
        ).toBe(true);
      }
    }
  });
});
