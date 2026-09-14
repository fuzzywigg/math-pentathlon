/**
 * Wave 29 — hex coordinate stress matrices (distance tables, orbit closure).
 * Heavy combinatorial deepen of the hex-coordinates unit slice.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  hexDistance,
  hexesInRange,
  hexRing,
  hexSpiral,
  hexLine,
  getNeighbors,
  rotateAround,
  reflect,
  axialToOffset,
  offsetToAxial,
  axialToCube,
  cubeToAxial,
  createAxial,
  hexEquals,
  coordKey,
  type AxialCoord,
  type OffsetParity,
} from '../../src/core/hex';

describe('Wave 29 hex-stress — full distance table on radius-3 disk', () => {
  it('builds a consistent all-pairs distance matrix', () => {
    const cells = hexesInRange(createAxial(0, 0), 3);
    expect(cells).toHaveLength(37);
    for (let i = 0; i < cells.length; i++) {
      for (let j = 0; j < cells.length; j++) {
        const d = hexDistance(cells[i], cells[j]);
        expect(d).toBe(hexDistance(cells[j], cells[i]));
        if (i === j) expect(d).toBe(0);
        // path existence via hexLine length
        expect(hexLine(cells[i], cells[j])).toHaveLength(d + 1);
      }
    }
  });
});

describe('Wave 29 hex-stress — conversion commute on disk', () => {
  it('axial→cube→axial and axial→offset→axial hold for radius-4 disk', () => {
    const cells = hexSpiral(createAxial(0, 0), 4);
    for (const h of cells) {
      expect(cubeToAxial(axialToCube(h))).toEqual(h);
      for (const parity of ['odd', 'even'] as OffsetParity[]) {
        expect(offsetToAxial(axialToOffset(h, parity), parity)).toEqual(h);
      }
    }
  });
});

describe('Wave 29 hex-stress — neighbor graph degree', () => {
  it('interior cells of a large range have degree 6 inside the set', () => {
    const range = 4;
    const cells = hexesInRange(createAxial(0, 0), range);
    const set = new Set(cells.map(coordKey));
    const interior = cells.filter(
      (h) => hexDistance(createAxial(0, 0), h) < range
    );
    for (const h of interior) {
      const nbrs = getNeighbors(h);
      expect(nbrs).toHaveLength(6);
      for (const n of nbrs) {
        expect(set.has(coordKey(n))).toBe(true);
      }
    }
  });
});

describe('Wave 29 hex-stress — dihedral-ish actions on a ring', () => {
  it('rotations permute ring cells; reflections map ring to itself', () => {
    const center = createAxial(0, 0);
    const ring = hexRing(center, 3);
    const ringSet = new Set(ring.map(coordKey));

    for (let s = 0; s < 6; s++) {
      for (const h of ring) {
        const rotated = rotateAround(h, center, s);
        expect(ringSet.has(coordKey(rotated))).toBe(true);
        expect(hexDistance(center, rotated)).toBe(3);
      }
    }

    for (const axis of ['q', 'r', 's'] as const) {
      for (const h of ring) {
        const reflected = reflect(h, axis);
        expect(ringSet.has(coordKey(reflected))).toBe(true);
      }
    }
  });
});

describe('Wave 29 hex-stress — many random-ish axial pairs', () => {
  it('line geodesic property for a grid of endpoints', () => {
    const pts: AxialCoord[] = [];
    for (let q = -3; q <= 3; q += 2) {
      for (let r = -3; r <= 3; r += 2) {
        pts.push(createAxial(q, r));
      }
    }
    for (const a of pts) {
      for (const b of pts) {
        const d = hexDistance(a, b);
        const line = hexLine(a, b);
        expect(line).toHaveLength(d + 1);
        expect(hexEquals(line[0], a)).toBe(true);
        expect(hexEquals(line[line.length - 1], b)).toBe(true);
        for (let i = 1; i < line.length; i++) {
          expect(hexDistance(line[i - 1], line[i])).toBe(1);
        }
      }
    }
  });
});

describe('Wave 29 hex-stress — ring cardinality growth', () => {
  it('cumulative ring sizes match closed form through radius 8', () => {
    let cumulative = 0;
    for (let r = 0; r <= 8; r++) {
      const size = hexRing(createAxial(0, 0), r).length;
      expect(size).toBe(r === 0 ? 1 : 6 * r);
      cumulative += size;
      expect(cumulative).toBe(3 * r * (r + 1) + 1);
      expect(hexSpiral(createAxial(0, 0), r)).toHaveLength(cumulative);
    }
  });
});
