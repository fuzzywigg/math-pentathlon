/**
 * Wave 40 — hex-ui inject idempotent + disabled/selected/highlighted/showCoords leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  injectHexStyles,
  renderHex,
  renderHexGrid,
  type HexLayout,
} from '../../src/core/hex';

const layout: HexLayout = {
  orientation: 'pointy',
  size: 18,
  origin: { x: 40, y: 40 },
};

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 40 hex-ui — inject + class/coord leftovers', () => {
  it('injectHexStyles is idempotent across repeated calls', () => {
    const before = document.head.querySelectorAll('style').length;
    injectHexStyles();
    injectHexStyles();
    injectHexStyles();
    const after = document.head.querySelectorAll('style').length;
    expect(after).toBeGreaterThanOrEqual(before);
    expect(after - before).toBeLessThanOrEqual(1);
  });

  it('disabled + selected + highlighted classNames compose on hex-cell', () => {
    const g = renderHex({ q: 0, r: 0 }, layout, {
      className: 'disabled selected highlighted',
    });
    expect(g.classList.contains('hex-cell')).toBe(true);
    expect(g.classList.contains('disabled')).toBe(true);
    expect(g.classList.contains('selected')).toBe(true);
    expect(g.classList.contains('highlighted')).toBe(true);
  });

  it('showCoords labels unlabeled cells as q,r', () => {
    const svg = renderHexGrid(1, layout, { showCoords: true });
    const labels = [...svg.querySelectorAll('.hex-label')].map(
      (t) => t.textContent
    );
    expect(labels.length).toBeGreaterThanOrEqual(7);
    expect(labels).toEqual(
      expect.arrayContaining(['0,0', '1,0', '0,1', '-1,0', '0,-1'])
    );
  });

  it('showCoords does not override an explicit cell label', () => {
    const svg = renderHexGrid(0, layout, {
      showCoords: true,
      getCellOptions: () => ({ label: 'CENTER' }),
    });
    expect(svg.querySelector('.hex-label')?.textContent).toBe('CENTER');
  });

  it('inject styles text includes disabled/selected/highlighted selectors', () => {
    injectHexStyles();
    const css = [...document.head.querySelectorAll('style')]
      .map((s) => s.textContent ?? '')
      .join('\n');
    expect(css).toContain('.hex-cell.disabled');
    expect(css).toContain('.hex-cell.selected');
    expect(css).toContain('.hex-cell.highlighted');
  });
});
