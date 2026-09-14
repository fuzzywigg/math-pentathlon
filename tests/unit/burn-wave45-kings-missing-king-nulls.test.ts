/**
 * Wave 45 TOKENMAXX — Kings missing-king null/empty leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  findKingPosition,
  getValidKingMoves,
  isValidKingMove,
} from '../../src/games/kings-quadraphages/rules';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';

function stripKing(player) {
  const state = createInitialGameState();
  const board = state.board.map((row) => row.map((c) => (c ? { ...c } : null)));
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const p = board[r][c];
      if (p?.type === 'king' && p.owner === player) board[r][c] = null;
    }
  }
  return { ...state, board };
}

describe('Wave 45 kings — missing king nulls', () => {
  it('findKingPosition returns null when king removed', () => {
    expect(findKingPosition(stripKing('player1').board, 'player1')).toBeNull();
    expect(findKingPosition(stripKing('player2').board, 'player2')).toBeNull();
  });

  it('getValidKingMoves empty and isValidKingMove false without king', () => {
    const s = stripKing('player1');
    expect(getValidKingMoves(s, 'player1')).toEqual([]);
    expect(isValidKingMove(s, 'player1', { row: 1, col: 4 })).toBe(false);
  });
});
