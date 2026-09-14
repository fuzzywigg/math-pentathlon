/**
 * Wave 37 — subtract raw (unsimplified) vs simplify leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  subtract,
  add,
  negate,
  areEqual,
  simplify,
  COMMON_FRACTIONS,
} from '../../src/core/fractions';

describe('Wave 37 frac-subtract — raw forms', () => {
  it('a - b equals a + negate(b)', () => {
    for (const a of COMMON_FRACTIONS) {
      for (const b of COMMON_FRACTIONS) {
        const s = subtract(a, b);
        const via = add(a, negate(b));
        expect(areEqual(simplify(s), simplify(via))).toBe(true);
      }
    }
  });

  it('same-denominator subtract keeps denom before simplify', () => {
    const s = subtract(createFraction(5, 8), createFraction(1, 8));
    expect(s.denominator).toBe(8);
    expect(areEqual(simplify(s), createFraction(1, 2))).toBe(true);
  });
});
