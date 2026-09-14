/**
 * Wave 40 — areCoprime / isPerfectSquare / getDigitSum leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  areCoprime,
  isPerfectSquare,
  getDigitSum,
} from '../../src/core/attributes';

describe('Wave 40 attr — coprime / square / digits', () => {
  it('areCoprime true for 8,15; false for 8,12', () => {
    expect(areCoprime(8, 15)).toBe(true);
    expect(areCoprime(8, 12)).toBe(false);
  });

  it('isPerfectSquare covers 0/1 and rejects negatives', () => {
    expect(isPerfectSquare(0)).toBe(true);
    expect(isPerfectSquare(1)).toBe(true);
    expect(isPerfectSquare(16)).toBe(true);
    expect(isPerfectSquare(-4)).toBe(false);
    expect(isPerfectSquare(2)).toBe(false);
  });

  it('getDigitSum uses absolute value for negatives', () => {
    expect(getDigitSum(-38)).toBe(11);
    expect(getDigitSum(38)).toBe(11);
  });
});
