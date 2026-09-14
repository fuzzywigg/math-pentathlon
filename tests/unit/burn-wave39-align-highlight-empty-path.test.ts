/**
 * Wave 39 — highlight-ui empty path / missing cells leftovers.
 * Beyond wave 22 highlight smoke. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createPathHighlight,
  createRegionHighlight,
  markCellsForHighlight,
  clearHighlights,
  injectHighlightStyles,
  HIGHLIGHT_STYLES,
} from '../../src/core/alignment/highlight-ui';

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('#alignment-highlight-styles')
    .forEach((el) => el.remove());
});

const toPixel = (row: number, col: number) => ({ x: col * 20, y: row * 20 });

describe('Wave 39 align — highlight empty / miss', () => {
  it('createPathHighlight length < 2 yields empty d path', () => {
    const empty = createPathHighlight([], toPixel);
    expect(empty.getAttribute('d')).toBe('');
    const single = createPathHighlight([{ row: 1, col: 1 }], toPixel);
    expect(single.getAttribute('d')).toBe('');
  });

  it('createPathHighlight long path joins M/L segments', () => {
    const path = createPathHighlight(
      [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 1, col: 1 },
      ],
      toPixel,
      HIGHLIGHT_STYLES.path
    );
    expect(path.getAttribute('d')).toContain('M');
    expect(path.getAttribute('d')).toContain('L');
  });

  it('markCellsForHighlight skips missing cells; clearHighlights removes', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div data-row="0" data-col="0"></div>
      <div data-row="0" data-col="1"></div>
    `;
    document.body.appendChild(container);

    markCellsForHighlight(
      container,
      [
        { row: 0, col: 0 },
        { row: 9, col: 9 },
      ],
      'highlight-path'
    );
    expect(container.querySelector('[data-row="0"][data-col="0"]')!.classList.contains('highlight-path')).toBe(true);
    expect(container.querySelectorAll('.highlight-path')).toHaveLength(1);

    clearHighlights(container);
    expect(container.querySelectorAll('.highlight-path')).toHaveLength(0);
  });

  it('createRegionHighlight wraps positions; inject styles idempotent', () => {
    injectHighlightStyles();
    injectHighlightStyles();
    expect(document.querySelectorAll('#alignment-highlight-styles')).toHaveLength(
      1
    );
    const g = createRegionHighlight(
      {
        value: 'X',
        positions: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
        ],
        size: 2,
      },
      toPixel,
      { width: 18, height: 18 }
    );
    expect(g.querySelectorAll('rect').length).toBeGreaterThanOrEqual(2);
  });
});
