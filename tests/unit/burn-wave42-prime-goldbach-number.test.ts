/**
 * Wave 42 — Prime Gold isGoldbachNumber leftovers after #186. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { isGoldbachNumber } from '../../src/games/prime-gold/types';

describe('Wave 42 prime — isGoldbachNumber', () => {
  it('accepts even numbers expressible as sum of two primes', () => {
    expect(isGoldbachNumber(4)).toBe(true); // 2+2
    expect(isGoldbachNumber(6)).toBe(true); // 3+3
    expect(isGoldbachNumber(8)).toBe(true); // 3+5
    expect(isGoldbachNumber(10)).toBe(true); // 3+7 or 5+5
    expect(isGoldbachNumber(18)).toBe(true);
  });

  it('rejects 2, odd numbers, and non-Goldbach evens above board range', () => {
    expect(isGoldbachNumber(2)).toBe(false);
    expect(isGoldbachNumber(3)).toBe(false);
    expect(isGoldbachNumber(1)).toBe(false);
    expect(isGoldbachNumber(7)).toBe(false);
  });

  it('matches board Goldbach target band (even, >2, <20)', () => {
    for (const n of [4, 6, 8, 10, 12, 14, 16, 18]) {
      expect(isGoldbachNumber(n)).toBe(true);
    }
    expect(isGoldbachNumber(20)).toBe(true);
    expect(isGoldbachNumber(22)).toBe(true);
  });
});
