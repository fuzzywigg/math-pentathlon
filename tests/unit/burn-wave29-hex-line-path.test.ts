/**
 * Wave 29 — hexLine continuity, length, and path invariants.
 * Distinct from graph bfs/dijkstra paths (#143) and polyomino geometry (#145).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  hexLine,
  hexDistance,
  areNeighbors,
  hexEquals,
  createAxial,
  type AxialCoord,
} from '../../src/core/hex';

function expectSameHex(a: AxialCoord, b: AxialCoord): void {
  expect(hexEquals(a, b)).toBe(true);
}

const key = (c: AxialCoord) => `${c.q},${c.r}`;

const PAIRS: Array<[AxialCoord, AxialCoord]> = [
  [createAxial(0, 0), createAxial(0, 0)],
  [createAxial(0, 0), createAxial(4, 0)],
  [createAxial(0, 0), createAxial(0, -5)],
  [createAxial(0, 0), createAxial(3, -3)],
  [createAxial(0, 0), createAxial(-2, 4)],
  [createAxial(1, 2), createAxial(5, -1)],
  [createAxial(-3, 1), createAxial(2, -4)],
  [createAxial(4, 4), createAxial(-1, -2)],
  [createAxial(2, -1), createAxial(2, -1)],
];

describe('Wave 29 hex-line — endpoints and length', () => {
  it('includes both endpoints', () => {
    for (const [a, b] of PAIRS) {
      const line = hexLine(a, b);
      expectSameHex(line[0], a);
      expectSameHex(line.at(-1)!, b);
    }
  });

  it('length is distance + 1', () => {
    for (const [a, b] of PAIRS) {
      const line = hexLine(a, b);
      expect(line).toHaveLength(hexDistance(a, b) + 1);
    }
  });

  it('self-line is a singleton', () => {
    for (const a of [
      createAxial(0, 0),
      createAxial(7, -3),
      createAxial(-2, -2),
    ]) {
      expect(hexLine(a, a)).toHaveLength(1);
      expectSameHex(hexLine(a, a)[0], a);
    }
  });
});

describe('Wave 29 hex-line — continuity', () => {
  it('consecutive cells are neighbors (or identical only if length 1)', () => {
    for (const [a, b] of PAIRS) {
      const line = hexLine(a, b);
      for (let i = 0; i < line.length - 1; i++) {
        expect(areNeighbors(line[i], line[i + 1])).toBe(true);
        expect(hexDistance(line[i], line[i + 1])).toBe(1);
      }
    }
  });

  it('no duplicate cells on a proper line', () => {
    for (const [a, b] of PAIRS) {
      if (hexEquals(a, b)) continue;
      const line = hexLine(a, b);
      expect(new Set(line.map(key)).size).toBe(line.length);
    }
  });

  it('distance from start increases monotonically along the line', () => {
    for (const [a, b] of PAIRS) {
      const line = hexLine(a, b);
      for (let i = 1; i < line.length; i++) {
        expect(hexDistance(a, line[i])).toBeGreaterThanOrEqual(
          hexDistance(a, line[i - 1])
        );
      }
      expect(hexDistance(a, line[line.length - 1])).toBe(hexDistance(a, b));
    }
  });
});

describe('Wave 29 hex-line — reverse and composition', () => {
  it('reverse line is the reversed sequence', () => {
    for (const [a, b] of PAIRS) {
      const forward = hexLine(a, b);
      const backward = hexLine(b, a);
      expect(backward.map(key)).toEqual([...forward].reverse().map(key));
    }
  });

  it('axis-aligned east line is the expected q-steps', () => {
    const line = hexLine(createAxial(0, 0), createAxial(3, 0));
    expect(line).toEqual([
      createAxial(0, 0),
      createAxial(1, 0),
      createAxial(2, 0),
      createAxial(3, 0),
    ]);
  });

  it('diagonal cube-axis line (q+r=0) stays on the axis', () => {
    const line = hexLine(createAxial(0, 0), createAxial(4, -4));
    expect(line.every((h) => h.q + h.r === 0)).toBe(true);
    expect(line).toHaveLength(5);
  });

  it('dense pair matrix: every pair in a small patch has a continuous line', () => {
    const patch: AxialCoord[] = [];
    for (let q = -2; q <= 2; q++) {
      for (let r = -2; r <= 2; r++) {
        patch.push(createAxial(q, r));
      }
    }
    for (const a of patch) {
      for (const b of patch) {
        const line = hexLine(a, b);
        expect(line).toHaveLength(hexDistance(a, b) + 1);
        for (let i = 0; i < line.length - 1; i++) {
          expect(areNeighbors(line[i], line[i + 1])).toBe(true);
        }
      }
    }
  });
});
