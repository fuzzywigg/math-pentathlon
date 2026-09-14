/**
 * Wave 39 — parseFraction null matrix leftovers after #172/#173.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { parseFraction, areEqual, createFraction } from '../../src/core/fractions';

describe('Wave 39 frac — parse null matrix', () => {
  it('null for empty, 1/0, garbage', () => {
    expect(parseFraction('')).toBeNull();
    expect(parseFraction('1/0')).toBeNull();
    expect(parseFraction('not-a-fraction')).toBeNull();
    expect(parseFraction('1 1/0')).toBeNull();
  });

  it('valid simple / mixed / whole', () => {
    expect(areEqual(parseFraction('3/4')!, createFraction(3, 4))).toBe(true);
    expect(areEqual(parseFraction('1 1/2')!, createFraction(3, 2))).toBe(true);
    expect(areEqual(parseFraction('5')!, createFraction(5, 1))).toBe(true);
  });
});
