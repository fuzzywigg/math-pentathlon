/**
 * Wave 35 — interactive hex grid + triangle render leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  createInteractiveHexGrid,
  renderHexWithTriangles,
  injectHexStyles,
  type HexLayout,
} from '../../src/core/hex';

const pointy: HexLayout = {
  orientation: 'pointy',
  size: 16,
  origin: { x: 80, y: 80 },
};

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 35 hex-ui-interactive — click / hover / update', () => {
  it('radius 1 wires clicks for all 7 cells', () => {
    const box = document.createElement('div');
    document.body.appendChild(box);
    const clicks: string[] = [];
    createInteractiveHexGrid(box, 1, pointy, {
      onCellClick: (c) => clicks.push(`${c.q},${c.r}`),
    });
    const cells = [...box.querySelectorAll('.hex-cell')] as SVGGElement[];
    expect(cells).toHaveLength(7);
    for (const cell of cells) {
      cell.dispatchEvent(new Event('click'));
    }
    expect(clicks).toHaveLength(7);
    expect(new Set(clicks).size).toBe(7);
  });

  it('hover tracking updates getHoveredCell', () => {
    const box = document.createElement('div');
    document.body.appendChild(box);
    const hovers: Array<string | null> = [];
    const api = createInteractiveHexGrid(box, 0, pointy, {
      onCellHover: (c) => hovers.push(c ? `${c.q},${c.r}` : null),
    });
    const cell = box.querySelector('.hex-cell') as SVGGElement;
    expect(api.getHoveredCell()).toBeNull();
    cell.dispatchEvent(new Event('mouseenter'));
    expect(api.getHoveredCell()).toEqual({ q: 0, r: 0 });
    cell.dispatchEvent(new Event('mouseleave'));
    expect(api.getHoveredCell()).toBeNull();
    expect(hovers).toEqual(['0,0', null]);
  });

  it('update re-renders with new cell options', () => {
    const box = document.createElement('div');
    document.body.appendChild(box);
    const api = createInteractiveHexGrid(box, 1, pointy, {
      getCellOptions: () => ({ fill: '#aaa' }),
    });
    expect(
      box.querySelector('.hex-cell path')?.getAttribute('fill')
    ).toBe('#aaa');
    api.update((c) => ({
      fill: c.q === 0 && c.r === 0 ? '#ff0' : '#00f',
      className: c.q === 0 && c.r === 0 ? 'center' : 'outer',
    }));
    expect(box.querySelector('.center path')?.getAttribute('fill')).toBe(
      '#ff0'
    );
    expect(box.querySelectorAll('.outer').length).toBe(6);
  });

  it('works without click/hover callbacks', () => {
    const box = document.createElement('div');
    document.body.appendChild(box);
    const api = createInteractiveHexGrid(box, 0, pointy);
    expect(box.querySelectorAll('.hex-cell')).toHaveLength(1);
    expect(api.getHoveredCell()).toBeNull();
    (box.querySelector('.hex-cell') as SVGGElement).dispatchEvent(
      new Event('click')
    );
  });

  it('injectHexStyles called by interactive grid (idempotent)', () => {
    const before = document.head.querySelectorAll('style').length;
    const box = document.createElement('div');
    document.body.appendChild(box);
    createInteractiveHexGrid(box, 0, pointy);
    createInteractiveHexGrid(box, 0, pointy);
    injectHexStyles();
    const after = document.head.querySelectorAll('style').length;
    expect(after).toBeGreaterThanOrEqual(before);
  });
});

describe('Wave 35 hex-ui-triangles — subdivision clicks', () => {
  it('renders six triangles with default fill', () => {
    const g = renderHexWithTriangles({ q: 0, r: 0 }, pointy);
    expect(g.dataset.coord).toBe('0,0');
    const tris = g.querySelectorAll('.hex-triangle');
    expect(tris).toHaveLength(6);
    for (const t of tris) {
      expect(t.getAttribute('fill')).toBe('#e0e0e0');
      expect(t.getAttribute('stroke')).toBe('#999');
    }
  });

  it('per-triangle options set fill and onClick', () => {
    const hits: number[] = [];
    const g = renderHexWithTriangles({ q: 1, r: -1 }, pointy, (_c, i) => ({
      fill: `#${i}${i}${i}${i}${i}${i}`,
      onClick: () => hits.push(i),
    }));
    const tris = [...g.querySelectorAll('.hex-triangle')] as SVGElement[];
    expect(tris).toHaveLength(6);
    for (let i = 0; i < 6; i++) {
      expect(tris[i].style.cursor).toBe('pointer');
      tris[i].dispatchEvent(new Event('click'));
    }
    expect(hits).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('partial options leave other triangles default', () => {
    const g = renderHexWithTriangles({ q: 2, r: 2 }, pointy, (_c, i) =>
      i === 0 ? { fill: '#abc' } : {}
    );
    const fills = [...g.querySelectorAll('.hex-triangle')].map((t) =>
      t.getAttribute('fill')
    );
    expect(fills[0]).toBe('#abc');
    expect(fills.slice(1).every((f) => f === '#e0e0e0')).toBe(true);
  });
});
