/**
 * Wave 35 — getHexCorners / hexPath / triangle geometry leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  getHexCorners,
  hexPath,
  getHexTriangles,
} from '../../src/core/hex';

describe('Wave 35 hex-ui-geom — corners matrix', () => {
  it.each([5, 10, 16, 20, 32])('pointy size %i: all corners on circle', (size) => {
    const center = { x: 3, y: -4 };
    const corners = getHexCorners(center, size, false);
    expect(corners).toHaveLength(6);
    for (const c of corners) {
      expect(Math.hypot(c.x - center.x, c.y - center.y)).toBeCloseTo(size, 8);
    }
  });

  it('pointy first corner is at 30°; flat at 0°', () => {
    const c = { x: 0, y: 0 };
    const pointy = getHexCorners(c, 10, false);
    const flat = getHexCorners(c, 10, true);
    expect(pointy[0].x).toBeCloseTo(10 * Math.cos((Math.PI / 180) * 30), 8);
    expect(pointy[0].y).toBeCloseTo(10 * Math.sin((Math.PI / 180) * 30), 8);
    expect(flat[0].x).toBeCloseTo(10, 8);
    expect(flat[0].y).toBeCloseTo(0, 8);
  });

  it('adjacent corners are 60° apart', () => {
    const corners = getHexCorners({ x: 0, y: 0 }, 1, true);
    for (let i = 0; i < 6; i++) {
      const a = corners[i];
      const b = corners[(i + 1) % 6];
      const dot = a.x * b.x + a.y * b.y;
      expect(dot).toBeCloseTo(0.5, 8);
    }
  });
});

describe('Wave 35 hex-ui-geom — path string', () => {
  it('path starts at first corner and closes with Z', () => {
    const center = { x: 12, y: 8 };
    const corners = getHexCorners(center, 15, false);
    const d = hexPath(center, 15, false);
    expect(d.startsWith(`M ${corners[0].x} ${corners[0].y}`)).toBe(true);
    expect(d.endsWith(' Z')).toBe(true);
    expect((d.match(/L /g) || []).length).toBe(5);
  });

  it('flat vs pointy paths differ', () => {
    const c = { x: 0, y: 0 };
    expect(hexPath(c, 10, false)).not.toBe(hexPath(c, 10, true));
  });
});

describe('Wave 35 hex-ui-geom — triangle centroids', () => {
  it('centroids average center + two corners', () => {
    const center = { x: 5, y: 5 };
    const size = 12;
    const corners = getHexCorners(center, size, false);
    const tris = getHexTriangles(center, size, false);
    expect(tris).toHaveLength(6);
    for (let i = 0; i < 6; i++) {
      const c1 = corners[i];
      const c2 = corners[(i + 1) % 6];
      expect(tris[i].x).toBeCloseTo((center.x + c1.x + c2.x) / 3, 8);
      expect(tris[i].y).toBeCloseTo((center.y + c1.y + c2.y) / 3, 8);
    }
  });

  it('flat triangles stay inside circumradius', () => {
    const tris = getHexTriangles({ x: 0, y: 0 }, 40, true);
    for (const t of tris) {
      expect(Math.hypot(t.x, t.y)).toBeLessThan(40);
    }
  });
});
