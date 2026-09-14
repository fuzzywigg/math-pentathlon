/**
 * Wave 42 — Hex game checkWinner top-bottom / left-right.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createEmptyBoard } from '../../src/games/hex/types';
import { checkWinner, makeMove } from '../../src/games/hex/rules';
import { createInitialState } from '../../src/games/hex/types';

describe('Wave 42 hex game — checkWinner paths', () => {
  it('player1 wins on full top-bottom column', () => {
    const size = 4;
    const board = createEmptyBoard(size);
    for (let r = 0; r < size; r++) board[r][1] = 'player1';
    expect(checkWinner(board, 'player1', size)).toBe(true);
    expect(checkWinner(board, 'player2', size)).toBe(false);
  });

  it('player2 wins on full left-right row', () => {
    const size = 4;
    const board = createEmptyBoard(size);
    for (let c = 0; c < size; c++) board[2][c] = 'player2';
    expect(checkWinner(board, 'player2', size)).toBe(true);
    expect(checkWinner(board, 'player1', size)).toBe(false);
  });

  it('partial bridge is not a win; makeMove can complete it', () => {
    let state = createInitialState(3);
    // Fill column 0 for rows 0 and 1 as player1, then complete
    state = {
      ...state,
      board: state.board.map((row, r) =>
        row.map((cell, c) => (c === 0 && r < 2 ? 'player1' : cell))
      ),
      currentPlayer: 'player1',
    };
    expect(checkWinner(state.board, 'player1', 3)).toBe(false);
    const won = makeMove(state, { row: 2, col: 0 });
    expect(won.winner).toBe('player1');
    expect(won.currentPlayer).toBe('player1');
  });
});
