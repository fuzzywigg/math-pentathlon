/**
 * Wave 29 — hexDistance + hexesInRange growth / membership matrix.
 * Deepens existing hex-coordinates distance & range APIs.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  hexDistance,
  hexesInRange,
  hexRing,
  getNeighbors,
  createAxial,
  hexEquals,
  hexInArray,
  axialToCube,
  type AxialCoord,
} from '../../src/core/hex';

function key(h: AxialCoord): string {
  return `${h.q},${h.r}`;
}

describe('Wave 29 hex-distance — metric axioms on samples', () => {
  const samples: AxialCoord[] = [
    { q: 0, r: 0 },
    { q: 1, r: 0 },
    { q: 0, r: 2 },
    { q: -3, r: 1 },
    { q: 4, r: -4 },
    { q: 2, r: 3 },
  ];

  it('is zero iff coordinates equal', () => {
    for (const a of samples) {
      expect(hexDistance(a, a)).toBe(0);
      for (const b of samples) {
        if (!hexEquals(a, b)) {
          expect(hexDistance(a, b)).toBeGreaterThan(0);
        }
      }
    }
  });

  it('is symmetric', () => {
    for (const a of samples) {
      for (const b of samples) {
        expect(hexDistance(a, b)).toBe(hexDistance(b, a));
      }
    }
  });

  it('matches max cube-component delta', () => {
    for (const a of samples) {
      for (const b of samples) {
        const ac = axialToCube(a);
        const bc = axialToCube(b);
        const expected = Math.max(
          Math.abs(ac.x - bc.x),
          Math.abs(ac.y - bc.y),
          Math.abs(ac.z - bc.z)
        );
        expect(hexDistance(a, b)).toBe(expected);
      }
    }
  });

  it('neighbors are exactly distance 1', () => {
    const c = createAxial(5, -2);
    for (const n of getNeighbors(c)) {
      expect(hexDistance(c, n)).toBe(1);
    }
  });

  it('triangle inequality holds on the sample set', () => {
    for (const a of samples) {
      for (const b of samples) {
        for (const c of samples) {
          expect(hexDistance(a, c)).toBeLessThanOrEqual(
            hexDistance(a, b) + hexDistance(b, c)
          );
        }
      }
    }
  });
});

describe('Wave 29 hex-distance — known distances', () => {
  it('spot-checks classic axial pairs', () => {
    expect(hexDistance({ q: 0, r: 0 }, { q: 3, r: 0 })).toBe(3);
    expect(hexDistance({ q: 0, r: 0 }, { q: 0, r: 4 })).toBe(4);
    expect(hexDistance({ q: 0, r: 0 }, { q: 2, r: -2 })).toBe(2);
    expect(hexDistance({ q: -1, r: 2 }, { q: 2, r: -1 })).toBe(3);
    expect(hexDistance({ q: 1, r: -1 }, { q: -1, r: 1 })).toBe(2);
  });
});

describe('Wave 29 hex-range — hexesInRange membership and counts', () => {
  it('range 0 is singleton center', () => {
    const c = createAxial(2, -3);
    expect(hexesInRange(c, 0)).toEqual([c]);
  });

  it('count formula is 3*n*(n+1)+1', () => {
    const c = createAxial(0, 0);
    for (let n = 0; n <= 5; n++) {
      expect(hexesInRange(c, n)).toHaveLength(3 * n * (n + 1) + 1);
    }
  });

  it('every cell in range is within distance n; every such cell appears', () => {
    const c = createAxial(1, -1);
    for (const n of [1, 2, 3]) {
      const cells = hexesInRange(c, n);
      for (const h of cells) {
        expect(hexDistance(c, h)).toBeLessThanOrEqual(n);
      }
      // brute scan a bounding box
      for (let q = c.q - n - 1; q <= c.q + n + 1; q++) {
        for (let r = c.r - n - 1; r <= c.r + n + 1; r++) {
          const h = createAxial(q, r);
          const inside = hexDistance(c, h) <= n;
          expect(hexInArray(h, cells)).toBe(inside);
        }
      }
    }
  });

  it('ranges nest: range(n) contains range(n-1)', () => {
    const c = createAxial(-2, 4);
    for (let n = 1; n <= 4; n++) {
      const outer = new Set(hexesInRange(c, n).map(key));
      for (const h of hexesInRange(c, n - 1)) {
        expect(outer.has(key(h))).toBe(true);
      }
    }
  });

  it('range(n) \\ range(n-1) equals hexRing(n)', () => {
    const c = createAxial(0, 0);
    for (let n = 1; n <= 4; n++) {
      const outer = hexesInRange(c, n);
      const inner = new Set(hexesInRange(c, n - 1).map(key));
      const shell = outer.filter((h) => !inner.has(key(h)));
      const ring = hexRing(c, n);
      expect(shell).toHaveLength(ring.length);
      for (const h of ring) {
        expect(hexInArray(h, shell)).toBe(true);
      }
    }
  });

  it('translating the center translates all results', () => {
    const c0 = createAxial(0, 0);
    const c1 = createAxial(3, -2);
    const r0 = hexesInRange(c0, 2);
    const r1 = hexesInRange(c1, 2);
    expect(r1).toHaveLength(r0.length);
    for (const h of r0) {
      expect(hexInArray(createAxial(h.q + c1.q, h.r + c1.r), r1)).toBe(true);
    }
  });
});
