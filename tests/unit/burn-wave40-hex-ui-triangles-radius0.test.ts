/**
 * Wave 40 — hex-ui triangles + radius-0 grid leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  getHexTriangles,
  renderHexWithTriangles,
  renderHexGrid,
  renderRectHexGrid,
  type HexLayout,
} from '../../src/core/hex';

const layout: HexLayout = {
  orientation: 'pointy',
  size: 24,
  origin: { x: 50, y: 50 },
};

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 40 hex-ui — triangles + radius0', () => {
  it('getHexTriangles returns 6 centroids; flat vs pointy differ', () => {
    const center = { x: 0, y: 0 };
    const pointy = getHexTriangles(center, 30, false);
    const flat = getHexTriangles(center, 30, true);
    expect(pointy).toHaveLength(6);
    expect(flat).toHaveLength(6);
    expect(pointy[0].x).not.toBeCloseTo(flat[0].x, 5);
    for (const t of pointy) {
      expect(Math.hypot(t.x, t.y)).toBeLessThan(30);
    }
  });

  it('renderHexWithTriangles draws 6 paths and wires triangle clicks', () => {
    const hits: number[] = [];
    const g = renderHexWithTriangles({ q: 1, r: -1 }, layout, (_c, i) => ({
      fill: i % 2 === 0 ? '#aaa' : '#bbb',
      onClick: () => hits.push(i),
    }));
    expect(g.dataset.coord).toBe('1,-1');
    const tris = g.querySelectorAll('.hex-triangle');
    expect(tris).toHaveLength(6);
    (tris[2] as SVGElement).dispatchEvent(new Event('click'));
    expect(hits).toEqual([2]);
    expect(tris[0].getAttribute('fill')).toBe('#aaa');
    expect(tris[1].getAttribute('fill')).toBe('#bbb');
  });

  it('radius 0 hexagonal grid is a single center cell', () => {
    const svg = renderHexGrid(0, layout, { showCoords: true });
    expect(svg.querySelectorAll('.hex-cell')).toHaveLength(1);
    expect(svg.querySelector('.hex-label')?.textContent).toBe('0,0');
  });

  it('renderRectHexGrid 1x1 still emits one cell', () => {
    const svg = renderRectHexGrid(1, 1, layout);
    expect(svg.querySelectorAll('.hex-cell')).toHaveLength(1);
  });

  it('triangle default fill is #e0e0e0 when options omitted', () => {
    const g = renderHexWithTriangles({ q: 0, r: 0 }, layout);
    expect(g.querySelector('.hex-triangle')?.getAttribute('fill')).toBe(
      '#e0e0e0'
    );
  });
});
