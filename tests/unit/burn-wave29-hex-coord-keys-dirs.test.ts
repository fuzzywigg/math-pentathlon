/**
 * Wave 29 — hex type factories, direction catalogs, coordKey helpers.
 * Deepens existing hex types slice alongside coordinates.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createAxial,
  createCube,
  createOffset,
  createLayout,
  coordKey,
  parseCoordKey,
  AXIAL_DIRECTIONS,
  CUBE_DIRECTIONS,
  CUBE_DIAGONALS,
  DIRECTION_NAMES,
  getNeighbor,
  axialToCube,
  hexDistance,
  type AxialCoord,
} from '../../src/core/hex';

describe('Wave 29 hex-types — direction catalogs', () => {
  it('AXIAL_DIRECTIONS has 6 unit steps matching DIRECTION_NAMES', () => {
    expect(AXIAL_DIRECTIONS).toHaveLength(6);
    expect(DIRECTION_NAMES).toHaveLength(6);
    expect([...DIRECTION_NAMES]).toEqual(['E', 'NE', 'NW', 'W', 'SW', 'SE']);
    for (const d of AXIAL_DIRECTIONS) {
      expect(hexDistance({ q: 0, r: 0 }, d)).toBe(1);
      const c = axialToCube(d);
      expect(c.x + c.y + c.z).toBe(0);
    }
  });

  it('CUBE_DIRECTIONS match AXIAL_DIRECTIONS under axialToCube', () => {
    expect(CUBE_DIRECTIONS).toHaveLength(6);
    for (let i = 0; i < 6; i++) {
      expect(axialToCube(AXIAL_DIRECTIONS[i])).toEqual(CUBE_DIRECTIONS[i]);
    }
  });

  it('CUBE_DIAGONALS are all distance-2 from origin in cube max-norm', () => {
    expect(CUBE_DIAGONALS).toHaveLength(6);
    for (const d of CUBE_DIAGONALS) {
      expect(d.x + d.y + d.z).toBe(0);
      expect(Math.max(Math.abs(d.x), Math.abs(d.y), Math.abs(d.z))).toBe(2);
    }
  });

  it('opposing axial directions sum to zero', () => {
    for (let i = 0; i < 3; i++) {
      const a = AXIAL_DIRECTIONS[i];
      const b = AXIAL_DIRECTIONS[i + 3];
      expect(a.q + b.q).toBe(0);
      expect(a.r + b.r).toBe(0);
    }
  });
});

describe('Wave 29 hex-types — coordKey / parseCoordKey', () => {
  it('round-trips integer coordinates including negatives', () => {
    const samples: AxialCoord[] = [
      { q: 0, r: 0 },
      { q: 1, r: -2 },
      { q: -7, r: 4 },
      { q: 12, r: 12 },
      { q: -1, r: -1 },
    ];
    for (const h of samples) {
      expect(parseCoordKey(coordKey(h))).toEqual(h);
    }
  });

  it('uses comma-separated q,r format', () => {
    expect(coordKey(createAxial(3, -5))).toBe('3,-5');
    expect(parseCoordKey('8,0')).toEqual({ q: 8, r: 0 });
  });

  it('distinct hexes get distinct keys', () => {
    const keys = new Set<string>();
    for (let q = -3; q <= 3; q++) {
      for (let r = -3; r <= 3; r++) {
        keys.add(coordKey(createAxial(q, r)));
      }
    }
    expect(keys.size).toBe(7 * 7);
  });
});

describe('Wave 29 hex-types — factories', () => {
  it('createOffset / createLayout return independent objects', () => {
    const o1 = createOffset(1, 2);
    const o2 = createOffset(1, 2);
    expect(o1).toEqual(o2);
    expect(o1).not.toBe(o2);

    const l1 = createLayout('flat', 40, 5, 6);
    const l2 = createLayout('flat', 40, 5, 6);
    expect(l1).toEqual(l2);
    expect(l1).not.toBe(l2);
    expect(l1.origin).not.toBe(l2.origin);
  });

  it('createCube rejects non-planar inputs but createAxial never throws', () => {
    expect(() => createCube(1, 1, 0)).toThrow();
    expect(createAxial(999, -999)).toEqual({ q: 999, r: -999 });
  });
});

describe('Wave 29 hex-types — direction walk closes after 6 steps on a ring', () => {
  it('walking one step per direction from a ring-start returns to start', () => {
    // Mimic hexRing construction: start at center + dir[4]*radius, then walk
    const center = createAxial(0, 0);
    const radius = 2;
    let current = createAxial(
      center.q + AXIAL_DIRECTIONS[4].q * radius,
      center.r + AXIAL_DIRECTIONS[4].r * radius
    );
    const start = { ...current };
    const seen: string[] = [];
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < radius; j++) {
        seen.push(coordKey(current));
        current = getNeighbor(current, i);
      }
    }
    expect(current).toEqual(start);
    expect(new Set(seen).size).toBe(6 * radius);
  });
});
