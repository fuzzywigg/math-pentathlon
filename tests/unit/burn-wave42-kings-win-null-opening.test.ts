/**
 * Wave 42 — Kings checkWinCondition null opening; trapped king win leftover.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  checkWinCondition,
  getValidKingMoves,
  findKingPosition,
} from '../../src/games/kings-quadraphages/rules';
import {
  createInitialGameState,
  type GameState,
} from '../../src/games/kings-quadraphages/game-state';

function surroundKing(
  state: GameState,
  victim: 'player1' | 'player2'
): GameState {
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

describe('Wave 42 kings — checkWinCondition leftovers', () => {
  it('opening returns null for both mobility', () => {
    const state = createInitialGameState();
    expect(getValidKingMoves(state, 'player1').length).toBeGreaterThan(0);
    expect(getValidKingMoves(state, 'player2').length).toBeGreaterThan(0);
    expect(checkWinCondition(state)).toBeNull();
  });

  it('only player2 trapped → player1 wins; p1 still mobile', () => {
    const trapped = surroundKing(createInitialGameState(), 'player2');
    expect(getValidKingMoves(trapped, 'player2')).toHaveLength(0);
    expect(getValidKingMoves(trapped, 'player1').length).toBeGreaterThan(0);
    expect(checkWinCondition(trapped)).toBe('player1');
  });

  it('only player1 trapped → player2 wins', () => {
    const trapped = surroundKing(createInitialGameState(), 'player1');
    expect(checkWinCondition(trapped)).toBe('player2');
  });
});
