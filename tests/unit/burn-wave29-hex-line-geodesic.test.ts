/**
 * Wave 29 — hexLine geodesic tables across a dense endpoint grid.
 * Deepens existing hex-coordinates line drawing.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  hexLine,
  hexDistance,
  hexEquals,
  hexInArray,
  createAxial,
  type AxialCoord,
} from '../../src/core/hex';

function grid(lo: number, hi: number): AxialCoord[] {
  const out: AxialCoord[] = [];
  for (let q = lo; q <= hi; q++) {
    for (let r = lo; r <= hi; r++) {
      out.push(createAxial(q, r));
    }
  }
  return out;
}

describe('Wave 29 hex-line-geodesic — dense grid', () => {
  it('every pair in a 5×5 axial window has a geodesic line', () => {
    const pts = grid(-2, 2);
    expect(pts).toHaveLength(25);
    for (const a of pts) {
      for (const b of pts) {
        const d = hexDistance(a, b);
        const line = hexLine(a, b);
        expect(line).toHaveLength(d + 1);
        expect(hexEquals(line[0], a)).toBe(true);
        expect(hexEquals(line[line.length - 1], b)).toBe(true);
        for (let i = 0; i < line.length; i++) {
          expect(hexDistance(a, line[i])).toBe(i);
          expect(hexDistance(line[i], b)).toBe(d - i);
        }
      }
    }
  });
});

describe('Wave 29 hex-line-geodesic — monotonic distance from start', () => {
  it('distance from start increases by exactly 1 each step', () => {
    const pairs: Array<[AxialCoord, AxialCoord]> = [
      [createAxial(-4, 0), createAxial(4, 0)],
      [createAxial(0, -4), createAxial(0, 4)],
      [createAxial(-3, 3), createAxial(3, -3)],
      [createAxial(-2, -2), createAxial(3, 1)],
      [createAxial(5, -2), createAxial(-1, 4)],
    ];
    for (const [a, b] of pairs) {
      const line = hexLine(a, b);
      for (let i = 1; i < line.length; i++) {
        expect(hexDistance(a, line[i]) - hexDistance(a, line[i - 1])).toBe(1);
      }
    }
  });
});

describe('Wave 29 hex-line-geodesic — subset uniqueness', () => {
  it('lines do not revisit cells', () => {
    const a = createAxial(-3, 2);
    const b = createAxial(4, -1);
    const line = hexLine(a, b);
    const keys = line.map((h) => `${h.q},${h.r}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('short chord cells lie on the long line when colinear', () => {
    const a = createAxial(0, 0);
    const mid = createAxial(2, 0);
    const b = createAxial(4, 0);
    const long = hexLine(a, b);
    expect(hexInArray(mid, long)).toBe(true);
    expect(hexLine(a, mid).every((h) => hexInArray(h, long))).toBe(true);
    expect(hexLine(mid, b).every((h) => hexInArray(h, long))).toBe(true);
  });
});

describe('Wave 29 hex-line-geodesic — opposite directions', () => {
  it('line(a,b) reversed equals line(b,a)', () => {
    const samples = grid(-1, 2);
    for (let i = 0; i < samples.length; i += 3) {
      for (let j = i; j < samples.length; j += 5) {
        const a = samples[i];
        const b = samples[j];
        const ab = hexLine(a, b);
        const ba = hexLine(b, a);
        expect(ba).toHaveLength(ab.length);
        for (let k = 0; k < ab.length; k++) {
          expect(hexEquals(ab[k], ba[ba.length - 1 - k])).toBe(true);
        }
      }
    }
  });
});
