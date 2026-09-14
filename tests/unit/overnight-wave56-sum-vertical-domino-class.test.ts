/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Sum vertical domino class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { CONFIG } from '../../src/games/sum-dominoes/types';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 56 sum — vertical domino class', () => {
  it('forged vertical placed domino uses vertical class leftover', () => {
    const base = createInitialState();
    const board = base.board.map((row) => row.slice());
    const seed = board[CONFIG.CENTER_ROW]![CONFIG.CENTER_COL]!;
    board[CONFIG.CENTER_ROW]![CONFIG.CENTER_COL] = {
      ...seed,
      orientation: 'vertical',
    };
    // clear adjacent horizontal spill cell if any — vertical occupies row+1
    const el = renderBoard({ ...base, board }, () => undefined);
    expect(el.querySelector('.sd-domino-vertical')).toBeTruthy();
  });
});
