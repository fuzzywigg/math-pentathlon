/**
 * Wave 40 — hex UI corners/triangles leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getHexCorners, getHexTriangles } from '../../src/core/hex';

describe('Wave 40 hex UI — corners / triangles', () => {
  const center = { x: 50, y: 40 };
  const size = 20;

  it('getHexCorners returns 6 points; flat vs pointy differ', () => {
    const pointy = getHexCorners(center, size, false);
    const flat = getHexCorners(center, size, true);
    expect(pointy).toHaveLength(6);
    expect(flat).toHaveLength(6);
    expect(pointy[0].x).not.toBeCloseTo(flat[0].x, 3);
  });

  it('getHexTriangles yields 6 centroids near center', () => {
    const tris = getHexTriangles(center, size, false);
    expect(tris).toHaveLength(6);
    for (const t of tris) {
      expect(Math.hypot(t.x - center.x, t.y - center.y)).toBeLessThan(size);
    }
  });
});
