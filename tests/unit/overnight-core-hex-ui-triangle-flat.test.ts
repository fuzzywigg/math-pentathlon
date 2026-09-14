/**
 * Overnight TOKENMAXX — renderHexWithTriangles flat orientation + centroids.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  renderHexWithTriangles,
  getHexTriangles,
  getHexCorners,
} from '../../src/core/hex/hex-ui';
import { createLayout, createAxial } from '../../src/core/hex/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Overnight core hex-ui — triangle flat', () => {
  it('flat layout draws 6 triangles with dataset coord', () => {
    const layout = createLayout('flat', 30, 10, 10);
    const g = renderHexWithTriangles(createAxial(2, -1), layout, (_c, i) => ({
      fill: `#${i}${i}${i}${i}${i}${i}`,
    }));
    expect(g.dataset.coord).toBe('2,-1');
    expect(g.querySelectorAll('.hex-triangle')).toHaveLength(6);
  });

  it('getHexTriangles centroids lie inside corner radius', () => {
    const center = { x: 0, y: 0 };
    const size = 40;
    const tris = getHexTriangles(center, size, true);
    const corners = getHexCorners(center, size, true);
    expect(tris).toHaveLength(6);
    expect(corners).toHaveLength(6);
    for (const t of tris) {
      expect(Math.hypot(t.x, t.y)).toBeLessThan(size);
    }
  });
});
