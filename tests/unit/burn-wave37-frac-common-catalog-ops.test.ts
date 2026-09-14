/**
 * Wave 37 — COMMON_FRACTIONS catalog closed ops leftovers.
 * Tests-only. Not fraction-bar-ui.
 */
import { describe, it, expect } from 'vitest';

import {
  COMMON_FRACTIONS,
  add,
  multiply,
  areEqual,
  simplify,
  isPositive,
  toDecimal,
  FRACTION_COLORS,
} from '../../src/core/fractions';

describe('Wave 37 frac-common — catalog properties', () => {
  it('all commons are positive proper-or-unit with known colors', () => {
    for (const f of COMMON_FRACTIONS) {
      expect(isPositive(f) || f.numerator === 0).toBe(true);
      expect(f.denominator).toBeGreaterThan(0);
      if (FRACTION_COLORS[f.denominator]) {
        expect(FRACTION_COLORS[f.denominator]).toMatch(/^#/);
      }
    }
  });

  it('pairwise add of unit fractions with shared denom stays finite', () => {
    const units = COMMON_FRACTIONS.filter((f) => f.numerator === 1);
    for (const a of units) {
      for (const b of units) {
        const s = add(a, b);
        expect(Number.isFinite(toDecimal(s))).toBe(true);
        expect(areEqual(simplify(s), simplify(add(b, a)))).toBe(true);
      }
    }
  });

  it('multiply of all commons by 1/1 identity-ish via simplify', () => {
    const one = COMMON_FRACTIONS.find((f) => f.numerator === 1 && f.denominator === 1)
      ?? { numerator: 1, denominator: 1 };
    for (const f of COMMON_FRACTIONS) {
      expect(areEqual(simplify(multiply(f, one)), simplify(f))).toBe(true);
    }
  });
});
