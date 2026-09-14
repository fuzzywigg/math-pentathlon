/**
 * Wave 40 — handshake: highlight overlay ↔ alignment result positions.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createAlignmentHighlight,
  createHighlightOverlay,
  clearHighlights,
  markCellsForHighlight,
  HIGHLIGHT_STYLES,
} from '../../src/core/alignment';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 40 handshake — highlight ↔ align positions', () => {
  it('alignment highlight rect count matches positions length', () => {
    const positions = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
    ];
    const alignment = {
      value: 'A',
      length: positions.length,
      direction: 'horizontal' as const,
      start: positions[0],
      end: positions[positions.length - 1],
      positions,
    };
    const g = createAlignmentHighlight(
      alignment,
      (r, c) => ({ x: c * 10, y: r * 10 }),
      { width: 8, height: 8 },
      HIGHLIGHT_STYLES.winning
    );
    expect(g.querySelectorAll('rect')).toHaveLength(positions.length);
    expect(g.querySelector('line')).toBeTruthy();
  });

  it('overlay + markCells share the same position set', () => {
    const positions = [
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ];
    const overlay = createHighlightOverlay(
      positions,
      (r, c) => ({ x: c * 12, y: r * 12 }),
      { width: 10, height: 10 },
      HIGHLIGHT_STYLES.path
    );
    expect(overlay.querySelectorAll('rect')).toHaveLength(2);

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
    markCellsForHighlight(board, positions, 'highlight-path');
    expect(
      board.querySelectorAll('.highlight-path')
    ).toHaveLength(2);
    clearHighlights(board);
    expect(board.querySelectorAll('.highlight-path')).toHaveLength(0);
  });

  it('threat style className appears on handshake group', () => {
    const g = createAlignmentHighlight(
      {
        value: 'T',
        length: 2,
        direction: 'diagonal',
        start: { row: 0, col: 0 },
        end: { row: 1, col: 1 },
        positions: [
          { row: 0, col: 0 },
          { row: 1, col: 1 },
        ],
      },
      (r, c) => ({ x: c * 5, y: r * 5 }),
      { width: 4, height: 4 },
      HIGHLIGHT_STYLES.threat
    );
    expect(g.classList.contains('highlight-threat')).toBe(true);
  });
});
