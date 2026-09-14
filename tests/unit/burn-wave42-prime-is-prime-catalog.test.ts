/**
 * Wave 42 — Prime Gold isPrime catalog leftovers after #186. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { isPrime } from '../../src/games/prime-gold/types';

describe('Wave 42 prime — isPrime catalog', () => {
  it('returns true for primes on the board including 47', () => {
    for (const n of [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]) {
      expect(isPrime(n)).toBe(true);
    }
  });

  it('returns false for 1, squares, and 49', () => {
    for (const n of [1, 4, 6, 8, 9, 10, 15, 21, 25, 49]) {
      expect(isPrime(n)).toBe(false);
    }
  });

  it('returns false below 2 and for negatives', () => {
    expect(isPrime(0)).toBe(false);
    expect(isPrime(-3)).toBe(false);
  });

  it('board corner 49 is composite', () => {
    expect(isPrime(49)).toBe(false);
    expect(7 * 7).toBe(49);
  });
});
