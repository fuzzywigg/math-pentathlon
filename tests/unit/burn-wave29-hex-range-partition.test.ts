/**
 * Wave 29 — hex distance / range / ring / spiral partition invariants.
 * Distinct from #143 graph hex lattice and contiguous region floods.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  hexDistance,
  hexesInRange,
  hexRing,
  hexSpiral,
  getNeighbors,
  hexEquals,
  hexInArray,
  createAxial,
  type AxialCoord,
} from '../../src/core/hex';

const key = (c: AxialCoord) => `${c.q},${c.r}`;

/** Closed form: 3r(r+1)+1 */
function diskCount(radius: number): number {
  return 3 * radius * (radius + 1) + 1;
}

describe('Wave 29 hex-range — distance axioms', () => {
  const points: AxialCoord[] = [];
  for (let q = -3; q <= 3; q++) {
    for (let r = -3; r <= 3; r++) {
      points.push(createAxial(q, r));
    }
  }

  it('identity: d(a,a)=0', () => {
    for (const a of points) {
      expect(hexDistance(a, a)).toBe(0);
    }
  });

  it('symmetry: d(a,b)=d(b,a)', () => {
    for (const a of points) {
      for (const b of points) {
        expect(hexDistance(a, b)).toBe(hexDistance(b, a));
      }
    }
  });

  it('triangle inequality on a subsample', () => {
    const sample = points.filter((_, i) => i % 7 === 0);
    for (const a of sample) {
      for (const b of sample) {
        for (const c of sample) {
          expect(hexDistance(a, c)).toBeLessThanOrEqual(
            hexDistance(a, b) + hexDistance(b, c)
          );
        }
      }
    }
  });

  it('neighbors are exactly distance 1 from center', () => {
    const c = createAxial(2, -3);
    for (const n of getNeighbors(c)) {
      expect(hexDistance(c, n)).toBe(1);
    }
  });

  it('spot distances match cube max-norm', () => {
    expect(hexDistance(createAxial(0, 0), createAxial(3, 0))).toBe(3);
    expect(hexDistance(createAxial(0, 0), createAxial(0, -4))).toBe(4);
    expect(hexDistance(createAxial(0, 0), createAxial(2, -2))).toBe(2);
    expect(hexDistance(createAxial(1, 1), createAxial(-1, 3))).toBe(2);
  });
});

describe('Wave 29 hex-range — hexesInRange disk', () => {
  const centers = [createAxial(0, 0), createAxial(1, -2), createAxial(-4, 3)];

  it('radius 0 is singleton center', () => {
    for (const c of centers) {
      expect(hexesInRange(c, 0)).toEqual([c]);
    }
  });

  it('disk cardinality matches 3r(r+1)+1', () => {
    for (const c of centers) {
      for (const r of [0, 1, 2, 3, 4]) {
        expect(hexesInRange(c, r)).toHaveLength(diskCount(r));
      }
    }
  });

  it('every cell in disk is within radius; nothing outside is included', () => {
    const c = createAxial(0, 0);
    const r = 3;
    const disk = hexesInRange(c, r);
    expect(disk.every((h) => hexDistance(c, h) <= r)).toBe(true);
    // A cell just outside
    expect(hexInArray(createAxial(r + 1, 0), disk)).toBe(false);
  });

  it('disks are nested: range(r) ⊂ range(r+1)', () => {
    const c = createAxial(2, 1);
    for (let r = 0; r < 4; r++) {
      const inner = new Set(hexesInRange(c, r).map(key));
      const outer = new Set(hexesInRange(c, r + 1).map(key));
      for (const k of inner) {
        expect(outer.has(k)).toBe(true);
      }
    }
  });

  it('disk cells are unique', () => {
    const disk = hexesInRange(createAxial(-1, 2), 4);
    expect(new Set(disk.map(key)).size).toBe(disk.length);
  });
});

describe('Wave 29 hex-range — hexRing exact radius', () => {
  it('ring(0) is the center', () => {
    const c = createAxial(5, -2);
    expect(hexRing(c, 0)).toEqual([c]);
  });

  it('ring length is 6*radius for radius>=1', () => {
    for (const c of [createAxial(0, 0), createAxial(3, -1)]) {
      for (const r of [1, 2, 3, 5]) {
        expect(hexRing(c, r)).toHaveLength(6 * r);
      }
    }
  });

  it('every ring cell is exactly distance radius from center', () => {
    const c = createAxial(-2, 4);
    for (const r of [1, 2, 3, 4]) {
      const ring = hexRing(c, r);
      expect(ring.every((h) => hexDistance(c, h) === r)).toBe(true);
      expect(new Set(ring.map(key)).size).toBe(ring.length);
    }
  });

  it('rings partition the disk: union rings 0..R = range(R)', () => {
    const c = createAxial(0, 0);
    for (const R of [1, 2, 3, 4]) {
      const fromRings = new Set<string>();
      for (let r = 0; r <= R; r++) {
        for (const h of hexRing(c, r)) {
          fromRings.add(key(h));
        }
      }
      const disk = new Set(hexesInRange(c, R).map(key));
      expect(fromRings).toEqual(disk);
    }
  });

  it('adjacent rings are disjoint', () => {
    const c = createAxial(1, 1);
    for (let r = 1; r < 4; r++) {
      const a = new Set(hexRing(c, r).map(key));
      const b = new Set(hexRing(c, r + 1).map(key));
      for (const k of a) {
        expect(b.has(k)).toBe(false);
      }
    }
  });
});

describe('Wave 29 hex-range — hexSpiral order', () => {
  it('spiral starts at center then grows by rings', () => {
    const c = createAxial(0, 0);
    const spiral = hexSpiral(c, 3);
    expect(spiral[0]).toEqual(c);
    expect(spiral).toHaveLength(diskCount(3));
  });

  it('spiral equals concatenation of rings 0..R', () => {
    const c = createAxial(2, -3);
    for (const R of [0, 1, 2, 3]) {
      // spiral starts with [c] then rings 1..R (ring 0 is the center)
      const built: AxialCoord[] = [c];
      for (let r = 1; r <= R; r++) {
        built.push(...hexRing(c, r));
      }
      expect(hexSpiral(c, R).map(key)).toEqual(built.map(key));
    }
  });

  it('spiral cells are unique and cover the disk', () => {
    const c = createAxial(-1, -1);
    const spiral = hexSpiral(c, 4);
    expect(new Set(spiral.map(key)).size).toBe(spiral.length);
    expect(new Set(spiral.map(key))).toEqual(
      new Set(hexesInRange(c, 4).map(key))
    );
  });

  it('prefix of spiral of R contains spiral of r for r<R', () => {
    const c = createAxial(0, 0);
    const big = hexSpiral(c, 3);
    const small = hexSpiral(c, 1);
    expect(big.slice(0, small.length).map(key)).toEqual(small.map(key));
  });

  it('non-origin center spiral is a translate of origin spiral', () => {
    const originSpiral = hexSpiral(createAxial(0, 0), 2);
    const center = createAxial(3, -2);
    const shifted = hexSpiral(center, 2);
    expect(shifted).toHaveLength(originSpiral.length);
    for (let i = 0; i < originSpiral.length; i++) {
      expect(shifted[i]).toEqual(
        createAxial(originSpiral[i].q + center.q, originSpiral[i].r + center.r)
      );
    }
  });
});
