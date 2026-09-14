/**
 * Wave 39 — hex pixel↔axial round-trips, rings/spirals/lines, diagonals, rotate.
 * Leftovers after waves 29/35–38. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  axialToPixel,
  axialToPixelPointy,
  axialToPixelFlat,
  pixelToAxial,
  pixelToAxialPointy,
  pixelToAxialFlat,
  cubeRound,
  hexRound,
  hexRing,
  hexSpiral,
  hexLine,
  hexDistance,
  getDiagonalNeighbors,
  rotateAround,
  rotateRight,
  rotateLeft,
  createAxial,
  createLayout,
  hexEquals,
  hexInArray,
  type AxialCoord,
} from '../../src/core/hex';

describe('Wave 39 hex — pixel round-trip leftovers', () => {
  it('pointy and flat centers round-trip through pixel', () => {
    const samples: AxialCoord[] = [
      createAxial(0, 0),
      createAxial(3, -2),
      createAxial(-4, 1),
      createAxial(2, 2),
    ];
    for (const orientation of ['pointy', 'flat'] as const) {
      const layout = createLayout(orientation, 28, 11, -7);
      for (const h of samples) {
        const px = axialToPixel(h, layout);
        const back = pixelToAxial(px, layout);
        expect(hexEquals(back, h)).toBe(true);
      }
    }
  });

  it('dispatcher matches dedicated pointy/flat converters', () => {
    const a = createAxial(1, -3);
    const pointy = createLayout('pointy', 16, 0, 0);
    const flat = createLayout('flat', 16, 5, 5);
    expect(axialToPixel(a, pointy)).toEqual(axialToPixelPointy(a, pointy));
    expect(axialToPixel(a, flat)).toEqual(axialToPixelFlat(a, flat));
    const px = { x: 40, y: -12 };
    expect(pixelToAxial(px, pointy)).toEqual(pixelToAxialPointy(px, pointy));
    expect(pixelToAxial(px, flat)).toEqual(pixelToAxialFlat(px, flat));
  });

  it('cubeRound / hexRound snap fractional cubes onto the lattice', () => {
    const rounded = cubeRound({ x: 0.6, y: -0.3, z: -0.3 });
    expect(rounded.x + rounded.y + rounded.z).toBe(0);
    expect(hexEquals(hexRound({ q: 0.4, r: -0.1 }), createAxial(0, 0))).toBe(
      true
    );
    expect(hexEquals(hexRound({ q: 1.7, r: -0.8 }), createAxial(2, -1))).toBe(
      true
    );
  });
});

describe('Wave 39 hex — ring / spiral / line leftovers', () => {
  it('hexRing radius>0 has 6r cells all at distance r', () => {
    const c = createAxial(-2, 3);
    for (let r = 1; r <= 4; r++) {
      const ring = hexRing(c, r);
      expect(ring).toHaveLength(6 * r);
      for (const h of ring) {
        expect(hexDistance(c, h)).toBe(r);
      }
    }
  });

  it('hexSpiral nests rings without duplicates', () => {
    const c = createAxial(0, 0);
    const spiral = hexSpiral(c, 3);
    const keys = spiral.map((h) => `${h.q},${h.r}`);
    expect(new Set(keys).size).toBe(keys.length);
    expect(spiral[0]).toEqual(c);
    expect(spiral.length).toBe(1 + 6 + 12 + 18);
  });

  it('hexLine is symmetric and distance-bounded', () => {
    const a = createAxial(-2, 0);
    const b = createAxial(3, -1);
    const ab = hexLine(a, b);
    const ba = hexLine(b, a);
    expect(ab[0]).toEqual(a);
    expect(ab[ab.length - 1]).toEqual(b);
    expect(ab).toHaveLength(hexDistance(a, b) + 1);
    expect(ba.map((h) => `${h.q},${h.r}`).reverse()).toEqual(
      ab.map((h) => `${h.q},${h.r}`)
    );
  });
});

describe('Wave 39 hex — diagonals and rotateAround leftovers', () => {
  it('getDiagonalNeighbors returns 6 cells at distance 2', () => {
    const c = createAxial(1, 1);
    const diags = getDiagonalNeighbors(c);
    expect(diags).toHaveLength(6);
    for (const d of diags) {
      expect(hexDistance(c, d)).toBe(2);
    }
  });

  it('rotateAround cycles 6 steps back to start; left is inverse of right', () => {
    const center = createAxial(0, 0);
    const p = createAxial(2, -1);
    let cur = p;
    for (let i = 0; i < 6; i++) {
      cur = rotateAround(cur, center, 1);
    }
    expect(hexEquals(cur, p)).toBe(true);
    expect(hexEquals(rotateLeft(rotateRight(p)), p)).toBe(true);
    expect(hexInArray(p, hexRing(center, hexDistance(center, p)))).toBe(true);
  });
});
