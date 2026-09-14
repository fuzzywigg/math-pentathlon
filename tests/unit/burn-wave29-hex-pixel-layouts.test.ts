/**
 * Wave 29 — pointy/flat pixel ↔ axial round-trips across sizes/origins.
 * Deepens existing hex-coordinates pixel converters.
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
  createAxial,
  createLayout,
  hexEquals,
  hexDistance,
  type HexLayout,
  type AxialCoord,
} from '../../src/core/hex';

const HEXES: AxialCoord[] = [
  { q: 0, r: 0 },
  { q: 1, r: 0 },
  { q: 0, r: 1 },
  { q: -2, r: 3 },
  { q: 4, r: -1 },
  { q: -3, r: -2 },
  { q: 2, r: 2 },
];

function layouts(): HexLayout[] {
  return [
    createLayout('pointy', 20, 0, 0),
    createLayout('flat', 20, 0, 0),
    createLayout('pointy', 32, 100, 50),
    createLayout('flat', 15, -40, 80),
    createLayout('pointy', 8, 0, 0),
    createLayout('flat', 48, 12, -12),
  ];
}

describe('Wave 29 hex-pixel — layout dispatcher', () => {
  it('axialToPixel delegates to pointy vs flat by orientation', () => {
    const pointy = createLayout('pointy', 25, 10, 10);
    const flat = createLayout('flat', 25, 10, 10);
    const a = createAxial(2, -1);
    expect(axialToPixel(a, pointy)).toEqual(axialToPixelPointy(a, pointy));
    expect(axialToPixel(a, flat)).toEqual(axialToPixelFlat(a, flat));
    expect(axialToPixel(a, pointy)).not.toEqual(axialToPixel(a, flat));
  });

  it('pixelToAxial delegates to pointy vs flat by orientation', () => {
    const pointy = createLayout('pointy', 30, 0, 0);
    const flat = createLayout('flat', 30, 0, 0);
    const px = { x: 45, y: 12 };
    expect(pixelToAxial(px, pointy)).toEqual(pixelToAxialPointy(px, pointy));
    expect(pixelToAxial(px, flat)).toEqual(pixelToAxialFlat(px, flat));
  });
});

describe('Wave 29 hex-pixel — round-trips through centers', () => {
  it('axial → pixel → axial recovers every sample hex for all layouts', () => {
    for (const layout of layouts()) {
      for (const h of HEXES) {
        const px = axialToPixel(h, layout);
        const back = pixelToAxial(px, layout);
        expect(hexEquals(back, h)).toBe(true);
      }
    }
  });

  it('dense axial grid round-trips for pointy and flat size=24', () => {
    for (const orientation of ['pointy', 'flat'] as const) {
      const layout = createLayout(orientation, 24, 7, -3);
      for (let q = -4; q <= 4; q++) {
        for (let r = -4; r <= 4; r++) {
          const a = createAxial(q, r);
          expect(
            hexEquals(pixelToAxial(axialToPixel(a, layout), layout), a)
          ).toBe(true);
        }
      }
    }
  });
});

describe('Wave 29 hex-pixel — origin and size scaling', () => {
  it('origin shifts pixel coords without changing recovered hex', () => {
    const base = createLayout('pointy', 20, 0, 0);
    const shifted = createLayout('pointy', 20, 200, -150);
    const a = createAxial(1, -2);
    const p0 = axialToPixel(a, base);
    const p1 = axialToPixel(a, shifted);
    expect(p1.x - p0.x).toBeCloseTo(200, 10);
    expect(p1.y - p0.y).toBeCloseTo(-150, 10);
    expect(pixelToAxial(p1, shifted)).toEqual(a);
  });

  it('doubling size doubles center offsets from origin', () => {
    const small = createLayout('flat', 10, 0, 0);
    const big = createLayout('flat', 20, 0, 0);
    const a = createAxial(3, -1);
    const ps = axialToPixel(a, small);
    const pb = axialToPixel(a, big);
    expect(pb.x).toBeCloseTo(ps.x * 2, 8);
    expect(pb.y).toBeCloseTo(ps.y * 2, 8);
  });

  it('createLayout defaults are pointy/size=30/origin=0,0', () => {
    const d = createLayout();
    expect(d.orientation).toBe('pointy');
    expect(d.size).toBe(30);
    expect(d.origin).toEqual({ x: 0, y: 0 });
  });
});

describe('Wave 29 hex-pixel — near-center vs far-edge snap', () => {
  it('pixels near a hex center snap back to that hex', () => {
    const layout = createLayout('pointy', 40, 0, 0);
    const a = createAxial(2, 1);
    const c = axialToPixel(a, layout);
    for (const [dx, dy] of [
      [0, 0],
      [1, 0],
      [0, 1],
      [-2, 1],
      [3, -2],
    ] as const) {
      expect(pixelToAxial({ x: c.x + dx, y: c.y + dy }, layout)).toEqual(a);
    }
  });

  it('a pixel far toward a neighbor can land on that neighbor', () => {
    const layout = createLayout('pointy', 40, 0, 0);
    const a = createAxial(0, 0);
    const east = createAxial(1, 0);
    const ca = axialToPixel(a, layout);
    const ce = axialToPixel(east, layout);
    const midFar = {
      x: ca.x + (ce.x - ca.x) * 0.85,
      y: ca.y + (ce.y - ca.y) * 0.85,
    };
    const snapped = pixelToAxial(midFar, layout);
    expect(
      hexDistance(snapped, a) + hexDistance(snapped, east)
    ).toBeLessThanOrEqual(1);
    expect([0, 1]).toContain(hexDistance(snapped, a));
  });
});
