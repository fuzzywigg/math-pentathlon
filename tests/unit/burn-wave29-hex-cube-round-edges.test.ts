/**
 * Wave 29 — cubeRound / hexRound fractional edge matrix.
 * Deepens existing hex-coordinates rounding helpers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  cubeRound,
  hexRound,
  axialToCube,
  cubeToAxial,
  createAxial,
  hexEquals,
  type CubeCoord,
} from '../../src/core/hex';

function sameCube(a: CubeCoord, b: CubeCoord): boolean {
  return a.x === b.x && a.y === b.y && a.z === b.z && a.x + a.y + a.z === 0;
}

describe('Wave 29 hex-cube-round — exact integers are fixed points', () => {
  it('integer cubes round to themselves', () => {
    const cubes: CubeCoord[] = [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: -1, z: 0 },
      { x: -2, y: 3, z: -1 },
      { x: 5, y: -2, z: -3 },
    ];
    for (const c of cubes) {
      expect(sameCube(cubeRound(c), c)).toBe(true);
    }
  });

  it('integer axials are fixed under hexRound', () => {
    for (let q = -5; q <= 5; q++) {
      for (let r = -5; r <= 5; r++) {
        const a = createAxial(q, r);
        expect(hexRound(a)).toEqual(a);
      }
    }
  });
});

describe('Wave 29 hex-cube-round — constraint restoration', () => {
  it('always returns a cube with x+y+z === 0', () => {
    const fracs: CubeCoord[] = [
      { x: 0.4, y: -0.3, z: -0.1 },
      { x: 1.2, y: -0.7, z: -0.4 },
      { x: -1.6, y: 0.9, z: 0.8 },
      { x: 2.4, y: -1.1, z: -1.2 },
      { x: 0.5, y: 0.5, z: -1.0 },
      { x: 0.49, y: 0.49, z: -0.98 },
      { x: -0.2, y: -0.3, z: 0.6 },
    ];
    for (const f of fracs) {
      const r = cubeRound(f);
      expect(r.x + r.y + r.z).toBe(0);
      expect(Number.isInteger(r.x)).toBe(true);
      expect(Number.isInteger(r.y)).toBe(true);
      expect(Number.isInteger(r.z)).toBe(true);
    }
  });

  it('hexRound result always satisfies cube constraint via axialToCube', () => {
    const fracs = [
      { q: 0.4, r: -0.2 },
      { q: 1.7, r: -0.9 },
      { q: -2.3, r: 1.1 },
      { q: 0.5, r: 0.5 },
      { q: -0.1, r: 0.05 },
    ];
    for (const f of fracs) {
      const rounded = hexRound(f);
      const c = axialToCube(rounded);
      expect(c.x + c.y + c.z).toBe(0);
      expect(hexEquals(cubeToAxial(c), rounded)).toBe(true);
    }
  });
});

describe('Wave 29 hex-cube-round — largest-diff axis correction', () => {
  it('when xDiff dominates, x is rewritten as -y-z', () => {
    // Pick values where round(x) is farthest from x
    const c = { x: 0.8, y: 0.1, z: -0.6 };
    // rounds: rx=1, ry=0, rz=-1; xDiff=0.2, yDiff=0.1, zDiff=0.4 → z dominates
    const r = cubeRound(c);
    expect(r.x + r.y + r.z).toBe(0);

    const xDom = { x: 1.6, y: 0.1, z: -0.2 };
    // rx=2, ry=0, rz=0; diffs 0.4, 0.1, 0.2 → x dominates → rx = -ry-rz = 0
    expect(sameCube(cubeRound(xDom), { x: 0, y: 0, z: 0 })).toBe(true);
  });

  it('when yDiff dominates over z, y is rewritten', () => {
    const c = { x: 0.1, y: 1.6, z: -0.2 };
    // rx=0, ry=2, rz=0; diffs 0.1, 0.4, 0.2 → y dominates → ry=-rx-rz=0
    expect(sameCube(cubeRound(c), { x: 0, y: 0, z: 0 })).toBe(true);
  });

  it('when zDiff dominates (else branch), z is rewritten', () => {
    const c = { x: 0.1, y: -0.2, z: 1.6 };
    // rx=0, ry=0, rz=2; diffs 0.1, 0.2, 0.4 → else → rz=-rx-ry=0
    expect(sameCube(cubeRound(c), { x: 0, y: 0, z: 0 })).toBe(true);
  });
});

describe('Wave 29 hex-cube-round — midpoint neighborhoods', () => {
  it('points slightly toward a neighbor snap to origin or that neighbor', () => {
    const origin = createAxial(0, 0);
    const east = createAxial(1, 0);
    const mid = hexRound({ q: 0.4, r: 0 });
    expect(hexEquals(mid, origin) || hexEquals(mid, east)).toBe(true);
  });

  it('fractional points near a known hex snap to it', () => {
    const target = createAxial(2, -1);
    expect(hexRound({ q: 2.1, r: -1.05 })).toEqual(target);
    expect(hexRound({ q: 1.95, r: -0.98 })).toEqual(target);
  });

  it('hexRound of lerp endpoints matches endpoints', () => {
    const a = createAxial(-2, 3);
    const b = createAxial(4, -1);
    expect(hexRound(a)).toEqual(a);
    expect(hexRound(b)).toEqual(b);
    expect(hexRound({ q: a.q, r: a.r })).toEqual(a);
  });
});
