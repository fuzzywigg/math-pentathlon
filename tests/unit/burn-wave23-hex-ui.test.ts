/**
 * Wave 23 — hex-ui corners / path / render / grids / interactive / triangles.
 * Distinct from wave 21 hex-region contiguous math and wave 22 graph/highlight UI.
 * Used by Hex / Hex-a-Gone demos. Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  getHexCorners,
  hexPath,
  renderHex,
  renderHexGrid,
  renderRectHexGrid,
  createInteractiveHexGrid,
  getHexTriangles,
  renderHexWithTriangles,
  injectHexStyles,
  type HexLayout,
} from '../../src/core/hex';

const pointy: HexLayout = {
  orientation: 'pointy',
  size: 20,
  origin: { x: 100, y: 100 },
};

const flat: HexLayout = {
  orientation: 'flat',
  size: 16,
  origin: { x: 50, y: 50 },
};

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 23 hex-ui — corners / path / triangles', () => {
  it('getHexCorners returns 6 vertices; flat vs pointy differ', () => {
    const center = { x: 0, y: 0 };
    const pointyCorners = getHexCorners(center, 10, false);
    const flatCorners = getHexCorners(center, 10, true);
    expect(pointyCorners).toHaveLength(6);
    expect(flatCorners).toHaveLength(6);
    // Pointy starts at 30°, flat at 0° — first vertices diverge
    expect(pointyCorners[0].x).not.toBeCloseTo(flatCorners[0].x, 5);
    for (const c of pointyCorners) {
      expect(Math.hypot(c.x, c.y)).toBeCloseTo(10, 5);
    }
  });

  it('hexPath is a closed SVG path with 6 segments', () => {
    const d = hexPath({ x: 5, y: 5 }, 12, false);
    expect(d.startsWith('M ')).toBe(true);
    expect(d.endsWith(' Z')).toBe(true);
    expect(d.match(/L /g)?.length).toBe(5);
  });

  it('getHexTriangles yields 6 centroids inside the hex', () => {
    const tris = getHexTriangles({ x: 0, y: 0 }, 30, true);
    expect(tris).toHaveLength(6);
    for (const t of tris) {
      expect(Math.hypot(t.x, t.y)).toBeLessThan(30);
    }
  });
});

describe('Wave 23 hex-ui — renderHex + styles', () => {
  it('renderHex sets data-coord, fill, optional label and click', () => {
    const clicks: string[] = [];
    const g = renderHex(
      { q: 1, r: -1 },
      pointy,
      {
        fill: '#abc',
        stroke: '#000',
        label: 'A',
        className: 'selected',
        onClick: (c) => clicks.push(`${c.q},${c.r}`),
      }
    );
    expect(g.dataset.coord).toBe('1,-1');
    expect(g.classList.contains('hex-cell')).toBe(true);
    expect(g.classList.contains('selected')).toBe(true);
    expect(g.querySelector('path')?.getAttribute('fill')).toBe('#abc');
    expect(g.querySelector('.hex-label')?.textContent).toBe('A');
    g.dispatchEvent(new Event('click'));
    expect(clicks).toEqual(['1,-1']);
  });

  it('renderHex hover callbacks fire enter/leave', () => {
    const events: Array<[number, number, boolean]> = [];
    const g = renderHex({ q: 0, r: 0 }, flat, {
      onHover: (c, entering) => events.push([c.q, c.r, entering]),
    });
    g.dispatchEvent(new Event('mouseenter'));
    g.dispatchEvent(new Event('mouseleave'));
    expect(events).toEqual([
      [0, 0, true],
      [0, 0, false],
    ]);
  });

  it('injectHexStyles is idempotent', () => {
    const before = document.head.querySelectorAll('style').length;
    injectHexStyles();
    injectHexStyles();
    const after = document.head.querySelectorAll('style').length;
    expect(after).toBeGreaterThanOrEqual(before);
    expect(after - before).toBeLessThanOrEqual(1);
  });
});

describe('Wave 23 hex-ui — grids + interactive', () => {
  it('renderHexGrid radius 1 has 7 cells and optional coords/bg', () => {
    const svg = renderHexGrid(1, pointy, {
      showCoords: true,
      background: '#f0f0f0',
      getCellOptions: (c) =>
        c.q === 0 && c.r === 0 ? { fill: '#ff0', className: 'center' } : {},
    });
    expect(svg.querySelectorAll('.hex-cell')).toHaveLength(7);
    expect(svg.querySelector('rect')?.getAttribute('fill')).toBe('#f0f0f0');
    const center = svg.querySelector('.center');
    expect(center).toBeTruthy();
    expect(center?.querySelector('.hex-label')).toBeTruthy();
  });

  it('renderRectHexGrid cols×rows cell count', () => {
    const svg = renderRectHexGrid(3, 2, flat, { showCoords: true });
    expect(svg.querySelectorAll('.hex-cell')).toHaveLength(6);
    expect(svg.getAttribute('viewBox')).toBeTruthy();
  });

  it('createInteractiveHexGrid click/hover/update/getHoveredCell', () => {
    const box = document.createElement('div');
    document.body.appendChild(box);
    const clicks: string[] = [];
    const hovers: Array<string | null> = [];
    const api = createInteractiveHexGrid(box, 0, pointy, {
      onCellClick: (c) => clicks.push(`${c.q},${c.r}`),
      onCellHover: (c) => hovers.push(c ? `${c.q},${c.r}` : null),
    });
    expect(box.querySelectorAll('.hex-cell')).toHaveLength(1);
    const cell = box.querySelector('.hex-cell') as SVGGElement;
    cell.dispatchEvent(new Event('click'));
    expect(clicks).toEqual(['0,0']);
    cell.dispatchEvent(new Event('mouseenter'));
    expect(api.getHoveredCell()).toEqual({ q: 0, r: 0 });
    expect(hovers).toContain('0,0');
    cell.dispatchEvent(new Event('mouseleave'));
    expect(api.getHoveredCell()).toBeNull();

    api.update((c) => ({
      fill: c.q === 0 ? '#0f0' : '#ccc',
      className: 'upd',
    }));
    expect(box.querySelector('.upd')).toBeTruthy();
    expect(box.querySelector('.upd path')?.getAttribute('fill')).toBe('#0f0');
  });

  it('renderHexWithTriangles draws 6 triangles and wires click', () => {
    const clicked: number[] = [];
    const g = renderHexWithTriangles({ q: 2, r: 0 }, pointy, (_c, i) => ({
      fill: i % 2 === 0 ? '#a00' : '#0a0',
      onClick: () => clicked.push(i),
    }));
    expect(g.dataset.coord).toBe('2,0');
    const tris = g.querySelectorAll('.hex-triangle');
    expect(tris).toHaveLength(6);
    (tris[3] as SVGElement).dispatchEvent(new Event('click'));
    expect(clicked).toEqual([3]);
  });
});
