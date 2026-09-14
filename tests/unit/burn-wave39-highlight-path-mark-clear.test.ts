/**
 * Wave 39 — highlight path/mark/clear leftovers.
 * Beyond wave 22 highlight. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  createPathHighlight,
  markCellsForHighlight,
  clearHighlights,
  createRegionHighlight,
} from '../../src/core/alignment';

describe('Wave 39 highlight — path mark clear', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        const cell = document.createElement('div');
        cell.dataset.row = String(r);
        cell.dataset.col = String(c);
        container.appendChild(cell);
      }
    }
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('path shorter than 2 yields empty d', () => {
    const el = createPathHighlight([{ row: 0, col: 0 }], (r, c) => ({
      x: c * 10,
      y: r * 10,
    }));
    expect(el.getAttribute('d')).toBe('');
  });

  it('path of 2+ builds M/L commands', () => {
    const el = createPathHighlight(
      [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 1, col: 1 },
      ],
      (r, c) => ({ x: c * 10, y: r * 10 })
    );
    const d = el.getAttribute('d')!;
    expect(d.startsWith('M')).toBe(true);
    expect(d.includes('L')).toBe(true);
  });

  it('mark then clear toggles classes', () => {
    markCellsForHighlight(container, [{ row: 0, col: 1 }], 'highlight-path');
    expect(
      container.querySelector('[data-row="0"][data-col="1"]')!.classList.contains(
        'highlight-path'
      )
    ).toBe(true);
    clearHighlights(container);
    expect(
      container.querySelector('[data-row="0"][data-col="1"]')!.classList.contains(
        'highlight-path'
      )
    ).toBe(false);
  });

  it('createRegionHighlight returns SVG group', () => {
    const g = createRegionHighlight(
      {
        value: 'X',
        size: 2,
        positions: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
        ],
      },
      (r, c) => ({ x: c * 20, y: r * 20 }),
      { width: 18, height: 18 }
    );
    expect(g.tagName.toLowerCase()).toBe('g');
  });
});
