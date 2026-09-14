/**
 * Wave 29 — neighbor / diagonal / areNeighbors symmetry matrix.
 * Deepens existing hex-coordinates neighbor ops (not board-bound hex-neighbors).
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
  createAxial,
  AXIAL_DIRECTIONS,
  CUBE_DIAGONALS,
  type AxialCoord,
} from '../../src/core/hex';

const CENTERS: AxialCoord[] = [
  { q: 0, r: 0 },
  { q: 3, r: -2 },
  { q: -4, r: 1 },
  { q: 5, r: 5 },
  { q: -2, r: -3 },
];

describe('Wave 29 hex-neighbors — six edge-adjacent cells', () => {
  it('always returns exactly 6 unique neighbors at distance 1', () => {
    for (const c of CENTERS) {
      const n = getNeighbors(c);
      expect(n).toHaveLength(6);
      const keys = new Set(n.map((h) => `${h.q},${h.r}`));
      expect(keys.size).toBe(6);
      for (const h of n) {
        expect(hexDistance(c, h)).toBe(1);
        expect(areNeighbors(c, h)).toBe(true);
        expect(areNeighbors(h, c)).toBe(true);
      }
    }
  });

  it('matches AXIAL_DIRECTIONS offsets from center', () => {
    const c = createAxial(2, -5);
    const n = getNeighbors(c);
    for (let i = 0; i < 6; i++) {
      expect(hexEquals(n[i], getNeighbor(c, i))).toBe(true);
      expect(n[i]).toEqual({
        q: c.q + AXIAL_DIRECTIONS[i].q,
        r: c.r + AXIAL_DIRECTIONS[i].r,
      });
    }
  });

  it('getNeighbor wraps direction via % 6 for large indices', () => {
    const c = createAxial(1, 1);
    for (let d = 0; d < 6; d++) {
      expect(getNeighbor(c, d)).toEqual(getNeighbor(c, d + 6));
      expect(getNeighbor(c, d)).toEqual(getNeighbor(c, d + 12));
      expect(getNeighbor(c, d)).toEqual(getNeighbor(c, d + 18));
    }
  });
});

describe('Wave 29 hex-neighbors — diagonal (vertex) neighbors', () => {
  it('returns 6 diagonals at distance 2', () => {
    for (const c of CENTERS) {
      const d = getDiagonalNeighbors(c);
      expect(d).toHaveLength(6);
      expect(CUBE_DIAGONALS).toHaveLength(6);
      for (const h of d) {
        expect(hexDistance(c, h)).toBe(2);
        expect(areNeighbors(c, h)).toBe(false);
      }
      const keys = new Set(d.map((h) => `${h.q},${h.r}`));
      expect(keys.size).toBe(6);
    }
  });

  it('diagonals never overlap edge-neighbors', () => {
    const c = createAxial(0, 0);
    const edge = getNeighbors(c);
    const diag = getDiagonalNeighbors(c);
    for (const d of diag) {
      expect(hexInArray(d, edge)).toBe(false);
    }
  });
});

describe('Wave 29 hex-neighbors — areNeighbors predicate matrix', () => {
  it('is true only for the six edge offsets', () => {
    const a = createAxial(0, 0);
    const trueOffsets = [
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
    ];
    for (const [dq, dr] of trueOffsets) {
      expect(areNeighbors(a, createAxial(dq, dr))).toBe(true);
    }
    const falseOffsets = [
      [0, 0],
      [2, 0],
      [1, 1],
      [-1, -1],
      [2, -1],
      [-2, 1],
      [0, 2],
      [3, -3],
    ];
    for (const [dq, dr] of falseOffsets) {
      expect(areNeighbors(a, createAxial(dq, dr))).toBe(false);
    }
  });

  it('is symmetric across a dense local neighborhood', () => {
    for (let q = -3; q <= 3; q++) {
      for (let r = -3; r <= 3; r++) {
        const a = createAxial(q, r);
        for (const b of getNeighbors(a)) {
          expect(areNeighbors(a, b)).toBe(true);
          expect(areNeighbors(b, a)).toBe(true);
        }
        for (const b of getDiagonalNeighbors(a)) {
          expect(areNeighbors(a, b)).toBe(false);
          expect(areNeighbors(b, a)).toBe(false);
        }
      }
    }
  });

  it('self is never a neighbor', () => {
    for (const c of CENTERS) {
      expect(areNeighbors(c, c)).toBe(false);
      expect(hexDistance(c, c)).toBe(0);
    }
  });
});

describe('Wave 29 hex-neighbors — hexEquals / hexInArray', () => {
  it('hexEquals is strict on both axes', () => {
    expect(hexEquals(createAxial(1, 2), createAxial(1, 2))).toBe(true);
    expect(hexEquals(createAxial(1, 2), createAxial(1, 3))).toBe(false);
    expect(hexEquals(createAxial(1, 2), createAxial(0, 2))).toBe(false);
  });

  it('hexInArray finds by value not reference', () => {
    const arr = [createAxial(0, 0), createAxial(1, -1)];
    expect(hexInArray(createAxial(1, -1), arr)).toBe(true);
    expect(hexInArray(createAxial(2, 0), arr)).toBe(false);
    expect(hexInArray(createAxial(0, 0), [])).toBe(false);
  });
});
