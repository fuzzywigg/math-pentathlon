/**
 * Wave 37 — getFactors range leftovers 1..120.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getFactors } from '../../src/core/fractions';

describe('Wave 37 frac-factors — 1..120', () => {
  it('every n has 1 and n; all factors divide', () => {
    for (let n = 1; n <= 120; n++) {
      const f = getFactors(n);
      expect(f[0]).toBe(1);
      expect(f[f.length - 1]).toBe(n);
      expect(new Set(f).size).toBe(f.length);
      for (const x of f) expect(n % x).toBe(0);
      // sorted
      for (let i = 1; i < f.length; i++) {
        expect(f[i]!).toBeGreaterThan(f[i - 1]!);
      }
    }
  });

  it('primes have exactly two factors', () => {
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    for (const p of primes) {
      expect(getFactors(p)).toEqual([1, p]);
    }
  });

  it('perfect squares include sqrt once', () => {
    for (const n of [4, 9, 16, 25, 36, 49, 64, 81, 100]) {
      const f = getFactors(n);
      const root = Math.sqrt(n);
      expect(f.filter((x) => x === root)).toHaveLength(1);
    }
  });
});
