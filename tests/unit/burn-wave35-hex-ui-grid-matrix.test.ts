/**
 * Wave 35 — renderHexGrid / renderRectHexGrid leftover matrices.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  renderHexGrid,
  renderRectHexGrid,
  hexesInRange,
  type HexLayout,
} from '../../src/core/hex';

const pointy: HexLayout = {
  orientation: 'pointy',
  size: 12,
  origin: { x: 0, y: 0 },
};

const flat: HexLayout = {
  orientation: 'flat',
  size: 10,
  origin: { x: 50, y: 50 },
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 35 hex-ui-grid — hexagonal radius counts', () => {
  it.each([0, 1, 2, 3])('radius %i cell count matches hexesInRange', (r) => {
    const expected = hexesInRange({ q: 0, r: 0 }, r).length;
    const svg = renderHexGrid(r, pointy);
    expect(svg.querySelectorAll('.hex-cell')).toHaveLength(expected);
  });

  it('showCoords labels every cell when no custom label', () => {
    const svg = renderHexGrid(1, flat, { showCoords: true });
    const labels = [...svg.querySelectorAll('.hex-label')].map(
      (t) => t.textContent
    );
    expect(labels).toHaveLength(7);
    expect(labels).toContain('0,0');
    expect(labels).toContain('1,-1');
  });

  it('custom label wins over showCoords', () => {
    const svg = renderHexGrid(0, pointy, {
      showCoords: true,
      getCellOptions: () => ({ label: 'C', labelSize: 20 }),
    });
    const label = svg.querySelector('.hex-label')!;
    expect(label.textContent).toBe('C');
    expect(label.getAttribute('font-size')).toBe('20');
  });

  it('background rect only when background set', () => {
    const plain = renderHexGrid(0, pointy);
    expect(plain.querySelector('rect')).toBeNull();
    const withBg = renderHexGrid(0, pointy, { background: '#ddeeff' });
    expect(withBg.querySelector('rect')?.getAttribute('fill')).toBe('#ddeeff');
  });

  it('getCellOptions can style a ring of cells', () => {
    const svg = renderHexGrid(2, pointy, {
      getCellOptions: (c) =>
        Math.max(Math.abs(c.q), Math.abs(c.r), Math.abs(c.q + c.r)) === 2
          ? { fill: '#f00', className: 'ring' }
          : { fill: '#ccc' },
    });
    expect(svg.querySelectorAll('.ring').length).toBeGreaterThan(0);
    for (const el of svg.querySelectorAll('.ring')) {
      expect(el.querySelector('path')?.getAttribute('fill')).toBe('#f00');
    }
  });

  it('padding enlarges viewBox extents', () => {
    const tight = renderHexGrid(1, pointy, { padding: 0 });
    const padded = renderHexGrid(1, pointy, { padding: 40 });
    expect(Number(padded.getAttribute('width'))).toBeGreaterThan(
      Number(tight.getAttribute('width'))
    );
  });
});

describe('Wave 35 hex-ui-grid — rectangular grids', () => {
  it.each([
    [1, 1],
    [2, 3],
    [4, 2],
    [5, 5],
  ] as const)('cols=%i rows=%i → cols*rows cells', (cols, rows) => {
    const svg = renderRectHexGrid(cols, rows, flat);
    expect(svg.querySelectorAll('.hex-cell')).toHaveLength(cols * rows);
  });

  it('odd columns use offset axial conversion uniqueness', () => {
    const svg = renderRectHexGrid(3, 2, pointy, { showCoords: true });
    const keys = [...svg.querySelectorAll('.hex-cell')].map(
      (g) => (g as SVGGElement).dataset.coord
    );
    expect(new Set(keys).size).toBe(6);
  });

  it('background + per-cell options compose', () => {
    const svg = renderRectHexGrid(2, 2, flat, {
      background: '#111',
      getCellOptions: (c) => ({
        fill: c.q === 0 ? '#0f0' : '#00f',
        className: c.q === 0 ? 'left' : 'right',
      }),
    });
    expect(svg.querySelector('rect')?.getAttribute('fill')).toBe('#111');
    expect(svg.querySelectorAll('.left')).toHaveLength(2);
    expect(svg.querySelectorAll('.right')).toHaveLength(2);
  });
});
