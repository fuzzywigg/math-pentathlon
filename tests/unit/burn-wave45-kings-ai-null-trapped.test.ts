/**
 * Wave 45 TOKENMAXX — Kings getAIMove null when AI king trapped. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { findKingPosition } from '../../src/games/kings-quadraphages/rules';
import { getAIMove } from '../../src/games/kings-quadraphages/ai';
import { createInitialGameState, type GameState } from '../../src/games/kings-quadraphages/game-state';

function trap(state: GameState, victim: 'player1' | 'player2'): GameState {
  const board = state.board.map((row) => row.map((c) => (c ? { ...c } : null)));
  const king = findKingPosition(board, victim)!;
  for (const dr of [-1, 0, 1]) {
    for (const dc of [-1, 0, 1]) {
      if (dr === 0 && dc === 0) continue;
      const r = king.row + dr;
      const c = king.col + dc;
      if (r < 0 || r > 8 || c < 0 || c > 8) continue;
      if (board[r][c]?.type === 'king') continue;
      board[r][c] = { type: 'quadraphage', owner: 'player1' };
    }
  }
  return { ...state, board };
}

describe('Wave 45 kings — AI null when trapped', () => {
  it('getAIMove null for all difficulties when AI king has zero moves', () => {
    const trapped = trap(createInitialGameState(), 'player1');
    for (const d of ['easy', 'medium', 'hard'] as const) {
      expect(getAIMove(trapped, 'player1', d)).toBeNull();
    }
  });

  it('opening AI still returns a move for player1', () => {
    expect(getAIMove(createInitialGameState(), 'player1', 'easy')).not.toBeNull();
  });
});
