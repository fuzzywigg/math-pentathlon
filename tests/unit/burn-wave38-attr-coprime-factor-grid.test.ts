/**
 * Wave 38 — areCoprime × getFactors dense pairwise grid.
 * Beyond wave 29 sparse samples. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { areCoprime, getFactors, isPrime } from '../../src/core/attributes/logic';

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

describe('Wave 38 attr-coprime — full grid -20..20', () => {
  it('areCoprime equals gcd===1 for all pairs', () => {
    for (let a = -20; a <= 20; a++) {
      for (let b = -20; b <= 20; b++) {
        expect(areCoprime(a, b)).toBe(gcd(a, b) === 1);
      }
    }
  });
});

describe('Wave 38 attr-factors — product identity 1..60', () => {
  it('every factor divides n; factors are sorted ascending', () => {
    for (let n = 1; n <= 60; n++) {
      const f = getFactors(n);
      expect(f[0]).toBe(1);
      expect(f[f.length - 1]).toBe(n);
      for (let i = 1; i < f.length; i++) expect(f[i]).toBeGreaterThan(f[i - 1]);
      for (const d of f) expect(n % d).toBe(0);
      // pairing: for each d, n/d also in list
      for (const d of f) expect(f.includes(n / d)).toBe(true);
    }
  });

  it('primes have exactly two factors', () => {
    for (let n = 2; n <= 60; n++) {
      if (isPrime(n)) expect(getFactors(n)).toEqual([1, n]);
    }
  });
});
