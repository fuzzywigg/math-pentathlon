/**
 * Wave 29 — hex type factories, coord keys, and cross-API consistency stress.
 * Distinct from #143–#145. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createAxial,
  createCube,
  createOffset,
  createLayout,
  coordKey,
  parseCoordKey,
  hexEquals,
  hexInArray,
  axialToCube,
  cubeToAxial,
  axialToOffset,
  offsetToAxial,
  getNeighbors,
  hexDistance,
  hexLine,
  hexRing,
  hexesInRange,
  rotateAround,
  reflect,
  hexSpiral,
  AXIAL_DIRECTIONS,
  CUBE_DIRECTIONS,
  type AxialCoord,
} from '../../src/core/hex';

const key = (c: AxialCoord) => `${c.q},${c.r}`;

describe('Wave 29 hex-types — factories', () => {
  it('createAxial / createOffset return plain structs', () => {
    expect(createAxial(1, -2)).toEqual({ q: 1, r: -2 });
    expect(createOffset(4, 5)).toEqual({ col: 4, row: 5 });
  });

  it('createLayout defaults and overrides', () => {
    expect(createLayout()).toEqual({
      orientation: 'pointy',
      size: 30,
      origin: { x: 0, y: 0 },
    });
    expect(createLayout('flat', 12, 3, 4)).toEqual({
      orientation: 'flat',
      size: 12,
      origin: { x: 3, y: 4 },
    });
  });

  it('createCube accepts near-zero float sums that round to 0', () => {
    // Math.round(0.1 + -0.05 + -0.05) = Math.round(0) = 0
    expect(createCube(0.1, -0.05, -0.05)).toEqual({
      x: 0.1,
      y: -0.05,
      z: -0.05,
    });
  });
});

describe('Wave 29 hex-types — coordKey round-trip', () => {
  it('coordKey / parseCoordKey round-trip on a grid', () => {
    for (let q = -5; q <= 5; q++) {
      for (let r = -5; r <= 5; r++) {
        const c = createAxial(q, r);
        expect(parseCoordKey(coordKey(c))).toEqual(c);
        expect(coordKey(c)).toBe(`${q},${r}`);
      }
    }
  });

  it('distinct coords get distinct keys', () => {
    const keys = new Set<string>();
    for (let q = -3; q <= 3; q++) {
      for (let r = -3; r <= 3; r++) {
        keys.add(coordKey(createAxial(q, r)));
      }
    }
    expect(keys.size).toBe(7 * 7);
  });
});

describe('Wave 29 hex-types — equality helpers', () => {
  it('hexEquals is reflexive/symmetric and rejects mismatches', () => {
    const a = createAxial(2, 3);
    const b = createAxial(2, 3);
    const c = createAxial(2, 4);
    expect(hexEquals(a, a)).toBe(true);
    expect(hexEquals(a, b)).toBe(true);
    expect(hexEquals(a, c)).toBe(false);
    expect(hexEquals(c, a)).toBe(false);
  });

  it('hexInArray scans with hexEquals semantics', () => {
    const list = [createAxial(0, 0), createAxial(1, -1), createAxial(2, 2)];
    expect(hexInArray(createAxial(1, -1), list)).toBe(true);
    expect(hexInArray(createAxial(9, 9), list)).toBe(false);
    expect(hexInArray(createAxial(0, 0), [])).toBe(false);
  });
});

describe('Wave 29 hex-types — direction constant integrity', () => {
  it('AXIAL_DIRECTIONS are the six unit neighbors of origin', () => {
    expect(AXIAL_DIRECTIONS).toHaveLength(6);
    for (const d of AXIAL_DIRECTIONS) {
      expect(hexDistance(createAxial(0, 0), d)).toBe(1);
    }
    expect(new Set(AXIAL_DIRECTIONS.map(key)).size).toBe(6);
  });

  it('CUBE_DIRECTIONS match AXIAL_DIRECTIONS via cubeToAxial', () => {
    expect(CUBE_DIRECTIONS).toHaveLength(6);
    for (const d of CUBE_DIRECTIONS) {
      expect(d.x + d.y + d.z).toBe(0);
    }
    const fromCube = CUBE_DIRECTIONS.map((d) => cubeToAxial(d));
    expect(fromCube.map(key).sort()).toEqual(
      [...AXIAL_DIRECTIONS].map(key).sort()
    );
  });
});

describe('Wave 29 hex-types — cross-API consistency stress', () => {
  it('range disk = unique cells reachable within d by neighbor BFS', () => {
    const center = createAxial(0, 0);
    const radius = 3;
    const disk = new Set(hexesInRange(center, radius).map(key));

    const visited = new Set<string>();
    const queue: Array<{ c: AxialCoord; d: number }> = [{ c: center, d: 0 }];
    visited.add(key(center));
    while (queue.length) {
      const { c, d } = queue.shift()!;
      if (d === radius) continue;
      for (const n of getNeighbors(c)) {
        const k = key(n);
        if (!visited.has(k)) {
          visited.add(k);
          queue.push({ c: n, d: d + 1 });
        }
      }
    }
    expect(visited).toEqual(disk);
  });

  it('hexLine length matches distance for every pair in ring(2)', () => {
    const center = createAxial(0, 0);
    const ring = hexRing(center, 2);
    for (const a of ring) {
      for (const b of ring) {
        expect(hexLine(a, b)).toHaveLength(hexDistance(a, b) + 1);
      }
    }
  });

  it('offset round-trip preserves neighbor distances', () => {
    const a = createAxial(1, -1);
    const b = createAxial(2, -1);
    for (const parity of ['odd', 'even'] as const) {
      const ao = offsetToAxial(axialToOffset(a, parity), parity);
      const bo = offsetToAxial(axialToOffset(b, parity), parity);
      expect(hexDistance(ao, bo)).toBe(hexDistance(a, b));
    }
  });

  it('reflect then rotate still preserves origin distance', () => {
    const origin = createAxial(0, 0);
    for (const c of hexSpiral(origin, 2)) {
      const transformed = rotateAround(reflect(c, 'q'), origin, 2);
      expect(hexDistance(origin, transformed)).toBe(hexDistance(origin, c));
    }
  });

  it('axial→cube→axial identity on spiral cells', () => {
    for (const c of hexSpiral(createAxial(1, -1), 3)) {
      expect(cubeToAxial(axialToCube(c))).toEqual(c);
    }
  });
});
