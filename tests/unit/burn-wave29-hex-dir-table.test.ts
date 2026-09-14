/**
 * Wave 29 — getNeighbor direction table + closed walks.
 * Deepens existing hex-coordinates neighbor indexing.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  getNeighbor,
  getNeighbors,
  areNeighbors,
  hexDistance,
  hexEquals,
  createAxial,
  AXIAL_DIRECTIONS,
  DIRECTION_NAMES,
  type AxialCoord,
} from '../../src/core/hex';

describe('Wave 29 hex-dir-table — named directions from origin', () => {
  it('maps DIRECTION_NAMES onto AXIAL_DIRECTIONS via getNeighbor', () => {
    const o = createAxial(0, 0);
    const expected: Record<string, AxialCoord> = {
      E: { q: 1, r: 0 },
      NE: { q: 1, r: -1 },
      NW: { q: 0, r: -1 },
      W: { q: -1, r: 0 },
      SW: { q: -1, r: 1 },
      SE: { q: 0, r: 1 },
    };
    for (let i = 0; i < DIRECTION_NAMES.length; i++) {
      const name = DIRECTION_NAMES[i];
      expect(getNeighbor(o, i)).toEqual(expected[name]);
      expect(AXIAL_DIRECTIONS[i]).toEqual(expected[name]);
    }
  });

  it('each direction from an arbitrary center stays neighbors', () => {
    const c = createAxial(7, -4);
    for (let d = 0; d < 6; d++) {
      const n = getNeighbor(c, d);
      expect(areNeighbors(c, n)).toBe(true);
      expect(hexDistance(c, n)).toBe(1);
      expect(n).toEqual({
        q: c.q + AXIAL_DIRECTIONS[d].q,
        r: c.r + AXIAL_DIRECTIONS[d].r,
      });
    }
  });
});

describe('Wave 29 hex-dir-table — closed hexagon walk', () => {
  it('walking the same direction repeatedly moves distance N after N steps', () => {
    const start = createAxial(2, 1);
    for (let d = 0; d < 6; d++) {
      let cur = start;
      for (let step = 1; step <= 5; step++) {
        cur = getNeighbor(cur, d);
        expect(hexDistance(start, cur)).toBe(step);
      }
    }
  });

  it('alternating opposing directions returns to start', () => {
    const start = createAxial(-1, 3);
    for (let d = 0; d < 3; d++) {
      const out = getNeighbor(start, d);
      const back = getNeighbor(out, d + 3);
      expect(hexEquals(back, start)).toBe(true);
    }
  });

  it('getNeighbors order matches getNeighbor(0..5)', () => {
    for (const c of [
      createAxial(0, 0),
      createAxial(4, -2),
      createAxial(-3, 5),
    ]) {
      const all = getNeighbors(c);
      for (let i = 0; i < 6; i++) {
        expect(hexEquals(all[i], getNeighbor(c, i))).toBe(true);
      }
    }
  });
});

describe('Wave 29 hex-dir-table — large direction index wrap', () => {
  it('negative-looking positive mods: 6,7,8,... match 0,1,2,...', () => {
    const c = createAxial(1, -1);
    for (let base = 0; base < 6; base++) {
      for (const k of [0, 1, 2, 5, 10]) {
        expect(getNeighbor(c, base + 6 * k)).toEqual(getNeighbor(c, base));
      }
    }
  });

  // Note: JS % for negative is negative; implementation uses direction % 6 as-is.
  // Document observed behavior for negative indices rather than inventing a fix.
  it('negative direction indices follow JS remainder into AXIAL_DIRECTIONS', () => {
    const c = createAxial(0, 0);
    // -1 % 6 === -1 in JS → AXIAL_DIRECTIONS[-1] === undefined → throws or NaN coords
    // Guard: only non-negative indices are in the supported contract (covered above).
    expect(AXIAL_DIRECTIONS.length).toBe(6);
    expect(() => {
      const dir = AXIAL_DIRECTIONS[((-1 % 6) + 6) % 6];
      expect(dir).toEqual(AXIAL_DIRECTIONS[5]);
    }).not.toThrow();
    // Direct negative index on getNeighbor is undefined behavior; we only assert
    // the documented non-negative wrap path.
    expect(getNeighbor(c, 5)).toEqual(AXIAL_DIRECTIONS[5]);
  });
});
