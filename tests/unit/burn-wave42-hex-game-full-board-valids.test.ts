/**
 * Wave 42 — Hex full board getValidMoves empty. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getValidMoves, isValidMove } from '../../src/games/hex/rules';
import { createInitialState, createEmptyBoard } from '../../src/games/hex/types';

describe('Wave 42 hex-game — full board', () => {
  it('filled board has zero valids', () => {
    const size = 3;
    const board = createEmptyBoard(size);
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        board[r][c] = (r + c) % 2 === 0 ? 'player1' : 'player2';
      }
    }
    const s = { ...createInitialState(size), board };
    expect(getValidMoves(s)).toEqual([]);
    expect(isValidMove(s, { row: 1, col: 1 })).toBe(false);
  });
});
