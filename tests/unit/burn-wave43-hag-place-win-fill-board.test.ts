/**
 * Wave 43 — Hex-a-Gone placeBlock wins when opponent stuck. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  placeBlock,
  getValidPlacements,
  canPlayerMove,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hex-a-gone — place wins when opponent stuck', () => {
  it('filling last empty cell ends game for current player', () => {
    let state = createInitialState();
    // fill all but one
    const keep = state.board[0];
    for (const cell of state.board) {
      if (cell !== keep) {
        cell.filled = true;
        cell.filledBy = 'player2';
      }
    }
    state = selectBlock(state, 'triangle');
    state = commitSelection(state);
    expect(getValidPlacements(state)).toEqual([{ q: keep.q, r: keep.r }]);
    const next = placeBlock(state, keep.q, keep.r);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(canPlayerMove({ ...next, currentPlayer: 'player2', phase: 'selectBlocks' })).toBe(false);
  });
});
