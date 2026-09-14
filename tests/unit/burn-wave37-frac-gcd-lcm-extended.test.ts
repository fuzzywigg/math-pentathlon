/**
 * Wave 37 — gcd/lcm extended grid leftovers beyond wave 27 0..30.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { gcd, lcm } from '../../src/core/fractions';

describe('Wave 37 frac-gcd-lcm — extended', () => {
  it('gcd/lcm identities for 31..60 pairs stepped', () => {
    for (let a = 31; a <= 60; a += 3) {
      for (let b = 31; b <= 60; b += 3) {
        const g = gcd(a, b);
        expect(a % g).toBe(0);
        expect(b % g).toBe(0);
        expect(lcm(a, b) * g).toBe(a * b);
      }
    }
  });

  it('gcd with zero', () => {
    for (const n of [0, 1, 17, 100, 256]) {
      expect(gcd(0, n)).toBe(n);
      expect(gcd(n, 0)).toBe(n);
    }
  });
});
