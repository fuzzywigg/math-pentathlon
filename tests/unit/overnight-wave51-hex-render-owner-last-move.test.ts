/**
 * Wave 51 leftover after #233 — classic Hex owner + last-move classes. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove } from '../../src/games/hex/rules';
import { renderBoard } from '../../src/games/hex/board-ui';

describe('Wave 51 hex — owner last-move', () => {
  it('marks p1 cell and last-move after makeMove', () => {
    let state = createInitialState(5);
    state = makeMove(state, { row: 2, col: 2 });
    const container = document.createElement('div');
    renderBoard(state, container);
    const cell = container.querySelector('[data-row="2"][data-col="2"] .hex-cell');
    expect(cell?.classList.contains('hex-cell-p1')).toBe(true);
    expect(cell?.classList.contains('hex-cell-last-move')).toBe(true);
  });
});
