/**
 * Wave 39 — poly empty board × align empty highlight handshake.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { createBoard, countEmptyCells, isBoardFilled } from '../../src/core/polyomino';
import {
  createPathHighlight,
  markCellsForHighlight,
  clearHighlights,
} from '../../src/core/alignment/highlight-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 39 handshake — poly empty × align highlight', () => {
  it('empty board reports full empty; empty path highlight is blank', () => {
    const board = createBoard(4, 4);
    expect(countEmptyCells(board)).toBe(16);
    expect(isBoardFilled(board)).toBe(false);

    const path = createPathHighlight([], () => ({ x: 0, y: 0 }));
    expect(path.getAttribute('d')).toBe('');

    const container = document.createElement('div');
    markCellsForHighlight(container, [], 'highlight-path');
    clearHighlights(container);
    expect(container.querySelectorAll('.highlight-path')).toHaveLength(0);
  });
});
