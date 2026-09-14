/**
 * Wave 29 — hexLine continuity + rotate/reflect group actions.
 * Deepens existing hex-coordinates line / rotation / reflection APIs.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  hexLine,
  hexDistance,
  rotateRight,
  rotateLeft,
  rotateAround,
  reflect,
  createAxial,
  hexEquals,
  hexInArray,
  axialToCube,
  type AxialCoord,
} from '../../src/core/hex';

describe('Wave 29 hex-line — endpoints and length', () => {
  it('singleton when a === b', () => {
    const a = createAxial(3, -1);
    expect(hexLine(a, a)).toEqual([a]);
    expect(hexLine(a, createAxial(3, -1))).toEqual([a]);
  });

  it('includes both endpoints and has distance+1 cells', () => {
    const pairs: Array<[AxialCoord, AxialCoord]> = [
      [createAxial(0, 0), createAxial(3, 0)],
      [createAxial(0, 0), createAxial(0, 4)],
      [createAxial(0, 0), createAxial(2, -2)],
      [createAxial(-2, 1), createAxial(3, -2)],
      [createAxial(5, 5), createAxial(-1, -2)],
      [createAxial(1, -1), createAxial(-3, 4)],
    ];
    for (const [a, b] of pairs) {
      const line = hexLine(a, b);
      const d = hexDistance(a, b);
      expect(line).toHaveLength(d + 1);
      expect(hexEquals(line[0], a)).toBe(true);
      expect(hexEquals(line[line.length - 1], b)).toBe(true);
    }
  });

  it('consecutive cells are neighbors (distance 1)', () => {
    const a = createAxial(-3, 2);
    const b = createAxial(4, -1);
    const line = hexLine(a, b);
    for (let i = 1; i < line.length; i++) {
      expect(hexDistance(line[i - 1], line[i])).toBe(1);
    }
  });

  it('every cell on the line is within bounding distance of endpoints', () => {
    const a = createAxial(0, 0);
    const b = createAxial(5, -3);
    const d = hexDistance(a, b);
    for (const h of hexLine(a, b)) {
      expect(hexDistance(a, h) + hexDistance(h, b)).toBe(d);
    }
  });

  it('reverse line visits the same set (order reversed)', () => {
    const a = createAxial(-1, 3);
    const b = createAxial(2, -2);
    const ab = hexLine(a, b);
    const ba = hexLine(b, a);
    expect(ba).toHaveLength(ab.length);
    for (let i = 0; i < ab.length; i++) {
      expect(hexEquals(ab[i], ba[ba.length - 1 - i])).toBe(true);
    }
  });
});

describe('Wave 29 hex-rotate — left/right inverses around origin', () => {
  const samples: AxialCoord[] = [
    { q: 1, r: 0 },
    { q: 0, r: 1 },
    { q: -2, r: 3 },
    { q: 4, r: -1 },
    { q: -3, r: -2 },
    { q: 5, r: 5 },
  ];

  it('rotateRight and rotateLeft are inverses', () => {
    for (const h of samples) {
      expect(hexEquals(rotateLeft(rotateRight(h)), h)).toBe(true);
      expect(hexEquals(rotateRight(rotateLeft(h)), h)).toBe(true);
    }
  });

  it('six rotateRight steps return to start (order 6)', () => {
    for (const h of samples) {
      let cur = h;
      for (let i = 0; i < 6; i++) {
        cur = rotateRight(cur);
      }
      expect(hexEquals(cur, h)).toBe(true);
    }
  });

  it('six rotateLeft steps return to start', () => {
    for (const h of samples) {
      let cur = h;
      for (let i = 0; i < 6; i++) {
        cur = rotateLeft(cur);
      }
      expect(hexEquals(cur, h)).toBe(true);
    }
  });

  it('rotation preserves distance from origin', () => {
    const o = createAxial(0, 0);
    for (const h of samples) {
      const d = hexDistance(o, h);
      expect(hexDistance(o, rotateRight(h))).toBe(d);
      expect(hexDistance(o, rotateLeft(h))).toBe(d);
    }
  });

  it('cube constraint preserved after rotation', () => {
    for (const h of samples) {
      const c = axialToCube(rotateRight(h));
      expect(c.x + c.y + c.z).toBe(0);
    }
  });
});

describe('Wave 29 hex-rotate — rotateAround center', () => {
  it('steps 0 and multiples of 6 are identity', () => {
    const c = createAxial(2, -1);
    const h = createAxial(4, 0);
    expect(rotateAround(h, c, 0)).toEqual(h);
    expect(rotateAround(h, c, 6)).toEqual(h);
    expect(rotateAround(h, c, 12)).toEqual(h);
    expect(rotateAround(h, c, -6)).toEqual(h);
  });

  it('negative steps normalize via ((steps%6)+6)%6', () => {
    const c = createAxial(0, 0);
    const h = createAxial(2, -1);
    expect(rotateAround(h, c, -1)).toEqual(rotateAround(h, c, 5));
    expect(rotateAround(h, c, -2)).toEqual(rotateAround(h, c, 4));
  });

  it('preserves distance from the rotation center', () => {
    const center = createAxial(3, -2);
    const points = [
      createAxial(3, -2),
      createAxial(5, -2),
      createAxial(1, 0),
      createAxial(4, -4),
    ];
    for (const p of points) {
      const d = hexDistance(center, p);
      for (let s = 0; s < 6; s++) {
        expect(hexDistance(center, rotateAround(p, center, s))).toBe(d);
      }
    }
  });

  it('rotating the center around itself stays put', () => {
    const c = createAxial(-4, 7);
    for (let s = 0; s < 6; s++) {
      expect(rotateAround(c, c, s)).toEqual(c);
    }
  });

  it('full orbit has 6 distinct images for off-center points', () => {
    const center = createAxial(0, 0);
    const p = createAxial(2, 0);
    const orbit = Array.from({ length: 6 }, (_, s) =>
      rotateAround(p, center, s)
    );
    const keys = new Set(orbit.map((h) => `${h.q},${h.r}`));
    expect(keys.size).toBe(6);
  });
});

describe('Wave 29 hex-reflect — axis involutions', () => {
  const samples: AxialCoord[] = [
    { q: 0, r: 0 },
    { q: 1, r: 0 },
    { q: 0, r: 1 },
    { q: 2, r: -3 },
    { q: -4, r: 1 },
    { q: 3, r: 3 },
  ];

  it('reflect twice is identity for q/r/s', () => {
    for (const axis of ['q', 'r', 's'] as const) {
      for (const h of samples) {
        expect(reflect(reflect(h, axis), axis)).toEqual(h);
      }
    }
  });

  it('preserves distance from origin', () => {
    const o = createAxial(0, 0);
    for (const axis of ['q', 'r', 's'] as const) {
      for (const h of samples) {
        expect(hexDistance(o, reflect(h, axis))).toBe(hexDistance(o, h));
      }
    }
  });

  it('spot-checks cube-axis swaps', () => {
    const h = createAxial(2, -1); // cube (2, -1, -1)
    // q-reflect: swap y/z → (2, -1, -1) stays
    expect(reflect(h, 'q')).toEqual(createAxial(2, -1));
    // r-reflect: swap x/z → cube (-1,-1,2) → axial (-1, 2)
    expect(reflect(h, 'r')).toEqual(createAxial(-1, 2));
    // s-reflect: swap x/y → cube (-1, 2, -1) → axial (-1, -1)
    expect(reflect(h, 's')).toEqual(createAxial(-1, -1));
  });

  it('reflected cubes remain on the plane', () => {
    for (const axis of ['q', 'r', 's'] as const) {
      for (const h of samples) {
        const c = axialToCube(reflect(h, axis));
        expect(c.x + c.y + c.z).toBe(0);
      }
    }
  });
});

describe('Wave 29 hex-line — axis-aligned short segments', () => {
  it('east walk is contiguous +q steps', () => {
    const line = hexLine(createAxial(0, 0), createAxial(3, 0));
    expect(line.map((h) => h.q)).toEqual([0, 1, 2, 3]);
    expect(line.every((h) => h.r === 0)).toBe(true);
  });

  it('southeast walk is contiguous +r steps', () => {
    const line = hexLine(createAxial(0, 0), createAxial(0, 3));
    expect(line.map((h) => h.r)).toEqual([0, 1, 2, 3]);
    expect(line.every((h) => h.q === 0)).toBe(true);
  });

  it('northeast diagonal stays on q+r constant line', () => {
    const a = createAxial(0, 0);
    const b = createAxial(3, -3);
    const line = hexLine(a, b);
    for (const h of line) {
      expect(h.q + h.r).toBe(0);
    }
    expect(hexInArray(createAxial(1, -1), line)).toBe(true);
    expect(hexInArray(createAxial(2, -2), line)).toBe(true);
  });
});
