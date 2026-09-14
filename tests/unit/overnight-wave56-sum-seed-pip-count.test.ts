/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Sum seed pip count. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { CONFIG } from '../../src/games/sum-dominoes/types';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 56 sum — seed pip count', () => {
  it('center seed face pips match face values leftover', () => {
    const state = createInitialState();
    const placed = state.board[CONFIG.CENTER_ROW]![CONFIG.CENTER_COL]!;
    expect(placed).toBeTruthy();
    const el = renderBoard(state, () => undefined);
    const expected = placed.domino.face1 + placed.domino.face2;
    expect(el.querySelectorAll('.sd-pip').length).toBe(expected);
  });
});
