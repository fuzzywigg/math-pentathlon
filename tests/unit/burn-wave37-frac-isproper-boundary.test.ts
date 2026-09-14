/**
 * Wave 37 — isProper / isWholeNumber boundary leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  fromWhole,
  isProper,
  isWholeNumber,
  simplify,
} from '../../src/core/fractions';

describe('Wave 37 frac-proper — boundaries', () => {
  it('equal abs num/den is improper; below is proper', () => {
    expect(isProper(createFraction(3, 4))).toBe(true);
    expect(isProper(createFraction(4, 4))).toBe(false);
    expect(isProper(createFraction(5, 4))).toBe(false);
    expect(isProper(createFraction(-3, 4))).toBe(true);
    expect(isProper(createFraction(-5, 4))).toBe(false);
  });

  it('isWholeNumber uses numerator % denominator (unsimplified wholes count)', () => {
    expect(isWholeNumber(fromWhole(7))).toBe(true);
    expect(isWholeNumber(createFraction(8, 4))).toBe(true); // 8 % 4 === 0
    expect(isWholeNumber(simplify(createFraction(8, 4)))).toBe(true);
    expect(isWholeNumber(createFraction(1, 2))).toBe(false);
    expect(isWholeNumber(createFraction(5, 3))).toBe(false);
  });
});
