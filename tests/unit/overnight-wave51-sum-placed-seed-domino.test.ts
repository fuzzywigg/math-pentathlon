/**
 * Overnight HEAVY leftovers after #234 — Sum Dominoes seed placed domino chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { CONFIG } from '../../src/games/sum-dominoes/types';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 51 sum — seed placed domino', () => {
  it('renders center seed as sd-domino-horizontal', () => {
    const state = createInitialState();
    const el = renderBoard(state, () => undefined);
    expect(el.classList.contains('sd-board')).toBe(true);
    expect(el.querySelector('.sd-domino-horizontal')).toBeTruthy();
    expect(state.board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL]).toBeTruthy();
  });
});
