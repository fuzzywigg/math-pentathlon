/**
 * Wave 29 — hex pixel conversions + cube/hex rounding boundaries.
 * Distinct from #143–#145 and hex-ui render paths (wave 23).
 * Tests-only. No product inventing.
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
  hexEquals,
  hexDistance,
  createAxial,
  createLayout,
  type AxialCoord,
} from '../../src/core/hex';

function expectSameHex(a: AxialCoord, b: AxialCoord): void {
  expect(hexEquals(a, b)).toBe(true);
}

const COORDS: AxialCoord[] = [];
for (let q = -3; q <= 3; q++) {
  for (let r = -3; r <= 3; r++) {
    COORDS.push(createAxial(q, r));
  }
}

describe('Wave 29 hex-pixel — layout dispatch', () => {
  const pointy = createLayout('pointy', 24, 10, 20);
  const flat = createLayout('flat', 18, -5, 7);

  it('axialToPixel delegates to pointy/flat helpers', () => {
    for (const c of COORDS) {
      expect(axialToPixel(c, pointy)).toEqual(axialToPixelPointy(c, pointy));
      expect(axialToPixel(c, flat)).toEqual(axialToPixelFlat(c, flat));
    }
  });

  it('pixelToAxial delegates to pointy/flat helpers', () => {
    for (const c of COORDS) {
      const pp = axialToPixelPointy(c, pointy);
      const pf = axialToPixelFlat(c, flat);
      expect(pixelToAxial(pp, pointy)).toEqual(pixelToAxialPointy(pp, pointy));
      expect(pixelToAxial(pf, flat)).toEqual(pixelToAxialFlat(pf, flat));
    }
  });
});

describe('Wave 29 hex-pixel — round-trip matrices', () => {
  it('pointy: every sample hex survives pixel round-trip', () => {
    const layout = createLayout('pointy', 30, 100, 50);
    for (const c of COORDS) {
      expectSameHex(pixelToAxial(axialToPixel(c, layout), layout), c);
    }
  });

  it('flat: every sample hex survives pixel round-trip', () => {
    const layout = createLayout('flat', 25, -40, 12);
    for (const c of COORDS) {
      expectSameHex(pixelToAxial(axialToPixel(c, layout), layout), c);
    }
  });

  it('origin hex maps to layout origin for both orientations', () => {
    const pointy = createLayout('pointy', 16, 42, 17);
    const flat = createLayout('flat', 16, 42, 17);
    const o = createAxial(0, 0);
    expect(axialToPixel(o, pointy)).toEqual({ x: 42, y: 17 });
    expect(axialToPixel(o, flat)).toEqual({ x: 42, y: 17 });
  });

  it('size scales pixel distance from origin linearly', () => {
    const small = createLayout('pointy', 10, 0, 0);
    const large = createLayout('pointy', 20, 0, 0);
    const cell = createAxial(2, -1);
    const pSmall = axialToPixel(cell, small);
    const pLarge = axialToPixel(cell, large);
    expect(pLarge.x).toBeCloseTo(pSmall.x * 2, 10);
    expect(pLarge.y).toBeCloseTo(pSmall.y * 2, 10);
  });
});

describe('Wave 29 hex-pixel — Voronoi / boundary snap', () => {
  const layout = createLayout('pointy', 40, 0, 0);

  it('pixels near a hex center snap back to that hex', () => {
    for (const c of [
      createAxial(0, 0),
      createAxial(1, 0),
      createAxial(0, 1),
      createAxial(-1, 1),
    ]) {
      const center = axialToPixel(c, layout);
      for (const [dx, dy] of [
        [0, 0],
        [1, 1],
        [-2, 3],
        [4, -1],
        [-3, -3],
      ] as const) {
        expectSameHex(
          pixelToAxial({ x: center.x + dx, y: center.y + dy }, layout),
          c
        );
      }
    }
  });

  it('midpoint between two adjacent hexes snaps to one of them (no third)', () => {
    const a = createAxial(0, 0);
    const b = createAxial(1, 0);
    const pa = axialToPixel(a, layout);
    const pb = axialToPixel(b, layout);
    const mid = { x: (pa.x + pb.x) / 2, y: (pa.y + pb.y) / 2 };
    const snapped = pixelToAxial(mid, layout);
    expect(hexEquals(snapped, a) || hexEquals(snapped, b)).toBe(true);
  });

  it('far pixels land on hexes whose distance grows with offset', () => {
    const origin = createAxial(0, 0);
    const p0 = axialToPixel(origin, layout);
    const near = pixelToAxial({ x: p0.x + layout.size * 0.5, y: p0.y }, layout);
    const far = pixelToAxial({ x: p0.x + layout.size * 5, y: p0.y }, layout);
    expect(hexDistance(origin, near)).toBeLessThanOrEqual(1);
    expect(hexDistance(origin, far)).toBeGreaterThanOrEqual(3);
  });
});

describe('Wave 29 hex-pixel — cubeRound / hexRound edges', () => {
  it('cubeRound always restores x+y+z=0', () => {
    const samples = [
      { x: 0.1, y: -0.05, z: -0.05 },
      { x: 1.4, y: -0.7, z: -0.7 },
      { x: -0.9, y: 0.4, z: 0.5 },
      { x: 2.2, y: -1.1, z: -1.1 },
      { x: 0.5, y: 0.5, z: -1 },
      { x: 0.49, y: 0.49, z: -0.98 },
    ];
    for (const s of samples) {
      const r = cubeRound(s);
      expect(r.x + r.y + r.z).toBe(0);
      expect(Number.isInteger(r.x)).toBe(true);
      expect(Number.isInteger(r.y)).toBe(true);
      expect(Number.isInteger(r.z)).toBe(true);
    }
  });

  it('cubeRound is idempotent on integer cubes', () => {
    for (const [q, r] of [
      [0, 0],
      [2, -1],
      [-3, 4],
      [5, -2],
    ] as const) {
      const cube = { x: q, y: -q - r, z: r };
      expect(cubeRound(cube)).toEqual(cube);
    }
  });

  it('hexRound snaps fractional axial via cubeRound', () => {
    expectSameHex(hexRound({ q: 0, r: 0 }), createAxial(0, 0));
    expectSameHex(hexRound({ q: 0.9, r: 0 }), createAxial(1, 0));
    const nearOrigin = hexRound({ q: 0.1, r: -0.05 });
    expect(nearOrigin.q === 0 && nearOrigin.r === 0).toBe(true);
    const snapped = hexRound({ q: 1.2, r: -0.3 });
    expect(Number.isInteger(snapped.q)).toBe(true);
    expect(Number.isInteger(snapped.r)).toBe(true);
  });

  it('hexRound near a known hex stays on that hex for small noise', () => {
    const target = createAxial(2, -1);
    for (const noise of [0, 0.05, -0.05, 0.1, -0.1]) {
      expectSameHex(
        hexRound({ q: target.q + noise, r: target.r + noise }),
        target
      );
    }
  });
});
