/**
 * Wave 42 — Hex getWinningPath empty when no connection. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getWinningPath, checkWinner, makeMove } from '../../src/games/hex/rules';
import { createInitialState } from '../../src/games/hex/types';

describe('Wave 42 hex-game — no-winner path', () => {
  it('scattered stones do not win; path empty', () => {
    let s = createInitialState(5);
    s = makeMove(s, { row: 0, col: 0 });
    s = makeMove(s, { row: 2, col: 2 });
    s = makeMove(s, { row: 4, col: 4 });
    expect(checkWinner(s.board, 'player1', 5)).toBe(false);
    expect(getWinningPath(s.board, 'player1', 5)).toEqual([]);
    expect(s.winner).toBeNull();
  });
});
