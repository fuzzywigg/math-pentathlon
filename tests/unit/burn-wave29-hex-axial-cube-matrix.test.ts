/**
 * Wave 29 — hex axial ↔ cube conversion matrix + factory edges.
 * Deepens existing hex-coordinates slice after #146 seat-handoff.
 * Distinct from graph-topology-hex (#143), hex-ui (#130), hex-region (#124).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  axialToCube,
  cubeToAxial,
  createAxial,
  createCube,
  hexEquals,
  type AxialCoord,
} from '../../src/core/hex';

const SAMPLE: AxialCoord[] = [
  { q: 0, r: 0 },
  { q: 1, r: 0 },
  { q: 0, r: 1 },
  { q: -1, r: 0 },
  { q: 0, r: -1 },
  { q: 1, r: -1 },
  { q: -1, r: 1 },
  { q: 3, r: -2 },
  { q: -4, r: 7 },
  { q: 12, r: -5 },
  { q: -8, r: -3 },
  { q: 5, r: 5 },
];

describe('Wave 29 hex-axial-cube — cube constraint on conversions', () => {
  it('axialToCube always yields x+y+z === 0', () => {
    for (const a of SAMPLE) {
      const c = axialToCube(a);
      expect(c.x + c.y + c.z).toBe(0);
      expect(c.x).toBe(a.q);
      expect(c.z).toBe(a.r);
      expect(c.y).toBe(-a.q - a.r);
    }
  });

  it('round-trips axial → cube → axial for a dense grid', () => {
    for (let q = -6; q <= 6; q++) {
      for (let r = -6; r <= 6; r++) {
        const a = createAxial(q, r);
        const back = cubeToAxial(axialToCube(a));
        expect(hexEquals(back, a)).toBe(true);
      }
    }
  });

  it('round-trips cube → axial → cube for valid cubes', () => {
    const cubes = [
      createCube(0, 0, 0),
      createCube(1, -1, 0),
      createCube(2, -3, 1),
      createCube(-5, 2, 3),
      createCube(10, -4, -6),
    ];
    for (const c of cubes) {
      const back = axialToCube(cubeToAxial(c));
      // Compare via axial to avoid Object.is(-0, 0) deep-equal traps
      expect(hexEquals(cubeToAxial(back), cubeToAxial(c))).toBe(true);
      expect(back.x + back.y + back.z).toBe(0);
    }
  });
});

describe('Wave 29 hex-axial-cube — createCube validation', () => {
  it('accepts exact-zero and float-near-zero sums via Math.round', () => {
    expect(createCube(1, -1, 0)).toEqual({ x: 1, y: -1, z: 0 });
    // 0.4 + 0.4 + (-0.8) = 0 → round 0
    expect(createCube(0.4, 0.4, -0.8)).toEqual({
      x: 0.4,
      y: 0.4,
      z: -0.8,
    });
  });

  it('rejects cubes whose rounded sum is not zero', () => {
    expect(() => createCube(1, 1, 1)).toThrow(/Invalid cube coordinates/);
    expect(() => createCube(1, 0, 0)).toThrow(/must equal 0/);
    expect(() => createCube(2, 2, -1)).toThrow();
  });

  it('error message includes the three components and sum', () => {
    try {
      createCube(2, 3, 4);
      expect.unreachable('should throw');
    } catch (e) {
      const msg = String(e);
      expect(msg).toContain('2');
      expect(msg).toContain('3');
      expect(msg).toContain('4');
      expect(msg).toContain('9');
    }
  });
});

describe('Wave 29 hex-axial-cube — createAxial identity', () => {
  it('returns plain {q,r} objects without mutation coupling', () => {
    const a = createAxial(4, -2);
    const b = createAxial(4, -2);
    expect(a).toEqual(b);
    expect(a).not.toBe(b);
    a.q = 99;
    expect(b.q).toBe(4);
  });

  it('preserves zeros and negatives', () => {
    expect(createAxial(0, 0)).toEqual({ q: 0, r: 0 });
    expect(createAxial(-1, -1)).toEqual({ q: -1, r: -1 });
  });
});

describe('Wave 29 hex-axial-cube — neighbor cubes stay on plane', () => {
  it('six AXIAL step offsets map to valid cubes', () => {
    const origin = createAxial(2, -3);
    const steps: AxialCoord[] = [
      { q: 1, r: 0 },
      { q: 1, r: -1 },
      { q: 0, r: -1 },
      { q: -1, r: 0 },
      { q: -1, r: 1 },
      { q: 0, r: 1 },
    ];
    for (const s of steps) {
      const n = createAxial(origin.q + s.q, origin.r + s.r);
      const c = axialToCube(n);
      expect(c.x + c.y + c.z).toBe(0);
      expect(cubeToAxial(c)).toEqual(n);
    }
  });
});
