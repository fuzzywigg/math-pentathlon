/**
 * Overnight TOKENMAXX — Hex disconnected path leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { checkWinner, getWinningPath } from '../../src/games/hex/rules';

describe('Overnight hex — disconnected false', () => {
  it('top+bottom stones without path are not a win', () => {
    const s = createInitialState(4);
    s.board[0][0] = 'player1';
    s.board[3][3] = 'player1';
    expect(checkWinner(s.board, 'player1', 4)).toBe(false);
    expect(getWinningPath(s.board, 'player1', 4)).toEqual([]);
  });
});
