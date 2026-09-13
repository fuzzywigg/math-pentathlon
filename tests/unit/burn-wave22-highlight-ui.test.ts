/**
 * Wave 22 — alignment highlight-ui overlays / lines / region-path / inject.
 * Distinct from wave 21 hex-region contiguous math and alignment.test logic.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  HIGHLIGHT_STYLES,
  getHighlightStyles,
  createHighlightOverlay,
  createAlignmentLine,
  createAlignmentHighlight,
  createRegionHighlight,
  createPathHighlight,
  markCellsForHighlight,
  clearHighlights,
  injectHighlightStyles,
} from '../../src/core/alignment/highlight-ui';
import type {
  AlignmentResult,
  GridPosition,
  Region,
} from '../../src/core/alignment/types';

const cellToPixel = (row: number, col: number) => ({
  x: col * 40 + 20,
  y: row * 40 + 20,
});
const cellSize = { width: 36, height: 36 };

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('#alignment-highlight-styles')
    .forEach((el) => el.remove());
  vi.restoreAllMocks();
});

describe('Wave 22 highlight-ui — style catalog', () => {
  it('HIGHLIGHT_STYLES keys and getHighlightStyles CSS contract', () => {
    for (const key of ['winning', 'selected', 'threat', 'path'] as const) {
      const style = HIGHLIGHT_STYLES[key];
      expect(style.fillColor).toBeTruthy();
      expect(style.strokeColor).toBeTruthy();
      expect(style.className).toContain('highlight-');
    }
    expect(HIGHLIGHT_STYLES.winning.animate).toBe(true);
    expect(HIGHLIGHT_STYLES.selected.animate).toBe(false);

    const css = getHighlightStyles();
    expect(css).toContain('.alignment-highlight');
    expect(css).toContain('@keyframes pulse-win');
    expect(css).toContain('.highlight-line');
  });
});

describe('Wave 22 highlight-ui — SVG builders', () => {
  it('createHighlightOverlay rect count matches positions', () => {
    const positions: GridPosition[] = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
    ];
    const group = createHighlightOverlay(
      positions,
      cellToPixel,
      cellSize,
      HIGHLIGHT_STYLES.selected
    );
    expect(group.getAttribute('class')).toContain('highlight-selected');
    expect(group.querySelectorAll('rect')).toHaveLength(3);
  });

  it('createAlignmentLine + createAlignmentHighlight wire endpoints', () => {
    const alignment: AlignmentResult = {
      value: 'X',
      start: { row: 0, col: 0 },
      end: { row: 0, col: 2 },
      positions: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ],
      direction: { name: 'row', dRow: 0, dCol: 1 },
      length: 3,
    };
    const line = createAlignmentLine(
      alignment,
      cellToPixel,
      HIGHLIGHT_STYLES.winning
    );
    expect(line.getAttribute('x1')).toBe('20');
    expect(line.getAttribute('y1')).toBe('20');
    expect(line.getAttribute('x2')).toBe('100');
    expect(line.getAttribute('y2')).toBe('20');
    expect(line.getAttribute('class')).toContain('animated');

    const group = createAlignmentHighlight(
      alignment,
      cellToPixel,
      cellSize,
      HIGHLIGHT_STYLES.winning
    );
    expect(group.querySelectorAll('rect')).toHaveLength(3);
    expect(group.querySelector('line')).toBeTruthy();
    expect(group.getAttribute('class')).toContain('highlight-winning');
  });

  it('createRegionHighlight and createPathHighlight (incl. short path)', () => {
    const region: Region = {
      value: 1,
      size: 2,
      positions: [
        { row: 1, col: 1 },
        { row: 1, col: 2 },
      ],
    };
    const regionEl = createRegionHighlight(
      region,
      cellToPixel,
      cellSize,
      HIGHLIGHT_STYLES.path
    );
    expect(regionEl.querySelectorAll('rect')).toHaveLength(2);

    const emptyPath = createPathHighlight([{ row: 0, col: 0 }], cellToPixel);
    expect(emptyPath.getAttribute('d')).toBe('');

    const path = createPathHighlight(
      [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 1, col: 1 },
      ],
      cellToPixel,
      HIGHLIGHT_STYLES.path
    );
    expect(path.getAttribute('d')).toContain('M');
    expect(path.getAttribute('d')).toContain('L');
    expect(path.getAttribute('fill')).toBe('none');
    expect(path.getAttribute('class')).toContain('highlight-path');
  });
});

describe('Wave 22 highlight-ui — DOM mark / clear / inject', () => {
  it('markCellsForHighlight and clearHighlights on a fake board', () => {
    const board = document.createElement('div');
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        const cell = document.createElement('div');
        cell.dataset.row = String(r);
        cell.dataset.col = String(c);
        board.appendChild(cell);
      }
    }
    document.body.appendChild(board);

    markCellsForHighlight(board, [
      { row: 0, col: 0 },
      { row: 1, col: 1 },
    ], 'highlight-selected');
    expect(
      board.querySelectorAll('.highlight-selected')
    ).toHaveLength(2);

    markCellsForHighlight(board, [{ row: 0, col: 1 }], 'highlight-selected');
    expect(board.querySelectorAll('.highlight-selected')).toHaveLength(1);
    expect(
      board.querySelector('[data-row="0"][data-col="1"]')?.classList.contains(
        'highlight-selected'
      )
    ).toBe(true);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const overlay = createHighlightOverlay(
      [{ row: 0, col: 0 }],
      cellToPixel,
      cellSize
    );
    svg.appendChild(overlay);
    board.appendChild(svg);

    clearHighlights(board);
    expect(board.querySelectorAll('.highlight-selected')).toHaveLength(0);
    expect(board.querySelectorAll('.alignment-highlight')).toHaveLength(0);
  });

  it('injectHighlightStyles is idempotent', () => {
    injectHighlightStyles();
    injectHighlightStyles();
    expect(
      document.querySelectorAll('#alignment-highlight-styles')
    ).toHaveLength(1);
    expect(
      document.getElementById('alignment-highlight-styles')?.textContent
    ).toContain('alignment-highlight');
  });
});
