/**
 * Wave 40 — createFraction zero denominator leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createFraction } from '../../src/core/fractions';

describe('Wave 40 frac — create zero denom', () => {
  it('throws when denominator is zero', () => {
    expect(() => createFraction(1, 0)).toThrow(/Denominator cannot be zero/i);
  });

  it('negative denominator flips sign onto numerator', () => {
    const f = createFraction(3, -4);
    expect(f.denominator).toBe(4);
    expect(f.numerator).toBe(-3);
  });
});
