/**
 * Wave 29 — hexRing / hexSpiral size, uniqueness, and nesting.
 * Deepens existing hex-coordinates ring/spiral APIs.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  hexRing,
  hexSpiral,
  hexDistance,
  hexesInRange,
  createAxial,
  hexEquals,
  hexInArray,
  type AxialCoord,
} from '../../src/core/hex';

function key(h: AxialCoord): string {
  return `${h.q},${h.r}`;
}

describe('Wave 29 hex-ring — radius 0 and perimeter sizes', () => {
  it('radius 0 returns the center alone', () => {
    const c = createAxial(4, -1);
    expect(hexRing(c, 0)).toEqual([c]);
  });

  it('radius r>0 has exactly 6*r cells', () => {
    for (const c of [
      createAxial(0, 0),
      createAxial(2, -3),
      createAxial(-5, 4),
    ]) {
      for (let r = 1; r <= 6; r++) {
        expect(hexRing(c, r)).toHaveLength(6 * r);
      }
    }
  });

  it('every ring cell is exactly distance r from center', () => {
    const c = createAxial(1, 2);
    for (let r = 1; r <= 5; r++) {
      for (const h of hexRing(c, r)) {
        expect(hexDistance(c, h)).toBe(r);
      }
    }
  });

  it('ring cells are unique', () => {
    const c = createAxial(0, 0);
    for (let r = 1; r <= 5; r++) {
      const keys = hexRing(c, r).map(key);
      expect(new Set(keys).size).toBe(keys.length);
    }
  });
});

describe('Wave 29 hex-ring — disjoint radii', () => {
  it('rings at different radii do not overlap', () => {
    const c = createAxial(-1, -1);
    const seen = new Set<string>();
    for (let r = 0; r <= 4; r++) {
      for (const h of hexRing(c, r)) {
        const k = key(h);
        expect(seen.has(k)).toBe(false);
        seen.add(k);
      }
    }
  });

  it('union of rings 0..n equals hexesInRange(n)', () => {
    const c = createAxial(2, -2);
    for (let n = 0; n <= 4; n++) {
      const fromRings: AxialCoord[] = [];
      for (let r = 0; r <= n; r++) {
        fromRings.push(...hexRing(c, r));
      }
      const range = hexesInRange(c, n);
      expect(fromRings).toHaveLength(range.length);
      for (const h of fromRings) {
        expect(hexInArray(h, range)).toBe(true);
      }
    }
  });
});

describe('Wave 29 hex-spiral — composition', () => {
  it('spiral starts with center then successive rings', () => {
    const c = createAxial(0, 0);
    for (let radius = 0; radius <= 4; radius++) {
      const spiral = hexSpiral(c, radius);
      expect(hexEquals(spiral[0], c)).toBe(true);
      expect(spiral).toHaveLength(3 * radius * (radius + 1) + 1);

      let idx = 1;
      for (let r = 1; r <= radius; r++) {
        const ring = hexRing(c, r);
        for (const h of ring) {
          expect(hexEquals(spiral[idx], h)).toBe(true);
          idx++;
        }
      }
      expect(idx).toBe(spiral.length);
    }
  });

  it('spiral cells are unique and cover hexesInRange', () => {
    const c = createAxial(3, 1);
    for (let radius = 0; radius <= 3; radius++) {
      const spiral = hexSpiral(c, radius);
      const keys = spiral.map(key);
      expect(new Set(keys).size).toBe(keys.length);
      const range = hexesInRange(c, radius);
      expect(spiral).toHaveLength(range.length);
      for (const h of range) {
        expect(hexInArray(h, spiral)).toBe(true);
      }
    }
  });

  it('larger spiral is a prefix extension of smaller', () => {
    const c = createAxial(-2, 0);
    const s2 = hexSpiral(c, 2);
    const s3 = hexSpiral(c, 3);
    expect(s3.slice(0, s2.length)).toEqual(s2);
    expect(s3.length).toBeGreaterThan(s2.length);
  });
});

describe('Wave 29 hex-ring — translation invariance', () => {
  it('ring around translated center equals translated ring around origin', () => {
    const originRing = hexRing(createAxial(0, 0), 3);
    const center = createAxial(4, -2);
    const moved = hexRing(center, 3);
    expect(moved).toHaveLength(originRing.length);
    for (const h of originRing) {
      expect(
        hexInArray(createAxial(h.q + center.q, h.r + center.r), moved)
      ).toBe(true);
    }
  });
});
