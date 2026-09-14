/**
 * Wave 29 — hex neighbor / diagonal / direction matrices (core coordinates).
 * Distinct from games/hex parallelogram neighbors and contiguous getHexNeighbors.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  getNeighbors,
  getNeighbor,
  getDiagonalNeighbors,
  areNeighbors,
  hexDistance,
  hexEquals,
  hexInArray,
  axialToCube,
  createAxial,
  AXIAL_DIRECTIONS,
  CUBE_DIRECTIONS,
  CUBE_DIAGONALS,
  DIRECTION_NAMES,
  type AxialCoord,
} from '../../src/core/hex';

const CENTERS: AxialCoord[] = [
  createAxial(0, 0),
  createAxial(2, -1),
  createAxial(-3, 2),
  createAxial(4, 4),
  createAxial(-5, -1),
];

const key = (c: AxialCoord) => `${c.q},${c.r}`;

describe('Wave 29 hex-neighbors — six edge neighbors', () => {
  it('every center has exactly 6 unique neighbors at distance 1', () => {
    for (const c of CENTERS) {
      const n = getNeighbors(c);
      expect(n).toHaveLength(6);
      expect(new Set(n.map(key)).size).toBe(6);
      expect(n.every((x) => hexDistance(c, x) === 1)).toBe(true);
      expect(n.every((x) => areNeighbors(c, x))).toBe(true);
    }
  });

  it('neighbor relation is symmetric on the sample', () => {
    for (const c of CENTERS) {
      for (const n of getNeighbors(c)) {
        expect(areNeighbors(n, c)).toBe(true);
        expect(hexInArray(c, getNeighbors(n))).toBe(true);
      }
    }
  });

  it('AXIAL_DIRECTIONS match getNeighbors at origin', () => {
    const n = getNeighbors(createAxial(0, 0));
    expect(n).toEqual([...AXIAL_DIRECTIONS]);
  });

  it('CUBE_DIRECTIONS agree with axial neighbors after conversion', () => {
    const origin = createAxial(0, 0);
    const fromCube = CUBE_DIRECTIONS.map((d) => createAxial(d.x, d.z));
    const n = getNeighbors(origin);
    expect(fromCube.map(key).sort()).toEqual(n.map(key).sort());
  });
});

describe('Wave 29 hex-neighbors — getNeighbor direction index', () => {
  it('directions 0..5 enumerate all neighbors without duplicates', () => {
    for (const c of CENTERS) {
      const viaIndex = [0, 1, 2, 3, 4, 5].map((i) => getNeighbor(c, i));
      expect(new Set(viaIndex.map(key)).size).toBe(6);
      expect(viaIndex.map(key).sort()).toEqual(getNeighbors(c).map(key).sort());
    }
  });

  it('direction index wraps mod 6 (including negatives via JS remainder)', () => {
    const c = createAxial(1, -1);
    expect(getNeighbor(c, 6)).toEqual(getNeighbor(c, 0));
    expect(getNeighbor(c, 7)).toEqual(getNeighbor(c, 1));
    expect(getNeighbor(c, 12)).toEqual(getNeighbor(c, 0));
  });

  it('DIRECTION_NAMES has length 6 matching AXIAL_DIRECTIONS', () => {
    expect(DIRECTION_NAMES).toHaveLength(6);
    expect(AXIAL_DIRECTIONS).toHaveLength(6);
  });
});

describe('Wave 29 hex-neighbors — diagonals', () => {
  it('each center has 6 diagonal neighbors at distance 2', () => {
    for (const c of CENTERS) {
      const d = getDiagonalNeighbors(c);
      expect(d).toHaveLength(6);
      expect(new Set(d.map(key)).size).toBe(6);
      expect(d.every((x) => hexDistance(c, x) === 2)).toBe(true);
      expect(d.every((x) => !areNeighbors(c, x))).toBe(true);
    }
  });

  it('CUBE_DIAGONALS length is 6 and each sums to 0', () => {
    expect(CUBE_DIAGONALS).toHaveLength(6);
    for (const d of CUBE_DIAGONALS) {
      expect(d.x + d.y + d.z).toBe(0);
    }
  });

  it('edge neighbors and diagonal neighbors are disjoint', () => {
    for (const c of CENTERS) {
      const edge = new Set(getNeighbors(c).map(key));
      const diag = new Set(getDiagonalNeighbors(c).map(key));
      for (const k of edge) {
        expect(diag.has(k)).toBe(false);
      }
    }
  });
});

describe('Wave 29 hex-neighbors — areNeighbors predicate table', () => {
  it('true only for the six axial unit steps', () => {
    const a = createAxial(3, -2);
    const truths = [
      createAxial(4, -2),
      createAxial(4, -3),
      createAxial(3, -3),
      createAxial(2, -2),
      createAxial(2, -1),
      createAxial(3, -1),
    ];
    for (const b of truths) {
      expect(areNeighbors(a, b)).toBe(true);
    }
  });

  it('false for self, distance-2, and skew pairs', () => {
    const a = createAxial(0, 0);
    expect(areNeighbors(a, a)).toBe(false);
    expect(areNeighbors(a, createAxial(2, 0))).toBe(false);
    expect(areNeighbors(a, createAxial(1, 1))).toBe(false);
    expect(areNeighbors(a, createAxial(-1, -1))).toBe(false);
    expect(areNeighbors(a, createAxial(3, -3))).toBe(false);
  });

  it('areNeighbors iff hexDistance === 1 on a dense patch', () => {
    for (let q = -2; q <= 2; q++) {
      for (let r = -2; r <= 2; r++) {
        const a = createAxial(q, r);
        for (let q2 = -2; q2 <= 2; q2++) {
          for (let r2 = -2; r2 <= 2; r2++) {
            const b = createAxial(q2, r2);
            expect(areNeighbors(a, b)).toBe(hexDistance(a, b) === 1);
          }
        }
      }
    }
  });

  it('neighbor cubes differ by a CUBE_DIRECTIONS entry', () => {
    const a = createAxial(1, 2);
    for (const n of getNeighbors(a)) {
      const ac = axialToCube(a);
      const nc = axialToCube(n);
      const delta = { x: nc.x - ac.x, y: nc.y - ac.y, z: nc.z - ac.z };
      expect(
        CUBE_DIRECTIONS.some(
          (d) => d.x === delta.x && d.y === delta.y && d.z === delta.z
        )
      ).toBe(true);
    }
  });
});
