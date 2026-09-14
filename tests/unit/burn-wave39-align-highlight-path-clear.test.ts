/**
 * Wave 39 — alignment highlight path/region/clear leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  createPathHighlight,
  createRegionHighlight,
  createAlignmentHighlight,
  clearHighlights,
  injectHighlightStyles,
  markCellsForHighlight,
} from '../../src/core/alignment';

describe('Wave 39 alignment — highlight UI', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('alignment-highlight-styles')?.remove();
  });

  it('injectHighlightStyles idempotent', () => {
    injectHighlightStyles();
    injectHighlightStyles();
    expect(document.getElementById('alignment-highlight-styles')).toBeTruthy();
  });

  it('path / region / alignment highlight elements', () => {
    const px = (row: number, col: number) => ({ x: col * 20, y: row * 20 });
    const cellSize = { width: 18, height: 18 };
    const path = createPathHighlight(
      [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
      ],
      px
    );
    expect(path.tagName.toLowerCase()).toBe('path');

    const region = createRegionHighlight(
      {
        value: 1,
        positions: [
          { row: 1, col: 1 },
          { row: 1, col: 2 },
        ],
        size: 2,
      },
      px,
      cellSize
    );
    expect(region.tagName.toLowerCase()).toBe('g');

    const positions = [
      { row: 2, col: 0 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
    ];
    const align = createAlignmentHighlight(
      {
        positions,
        length: 3,
        direction: { name: 'horizontal', dRow: 0, dCol: 1 },
        value: 1,
        start: positions[0],
        end: positions[2],
      } as never,
      px,
      cellSize
    );
    expect(align.tagName.toLowerCase()).toBe('g');
  });

  it('mark + clear highlights on board cells', () => {
    const board = document.createElement('div');
    board.innerHTML = `
      <div class="cell" data-row="0" data-col="0"></div>
      <div class="cell" data-row="0" data-col="1"></div>
    `;
    document.body.appendChild(board);
    markCellsForHighlight(
      board,
      [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
      ],
      'highlight-path'
    );
    expect(board.querySelectorAll('.highlight-path')).toHaveLength(2);
    clearHighlights(board);
    expect(board.querySelectorAll('.highlight-path')).toHaveLength(0);
  });
});
