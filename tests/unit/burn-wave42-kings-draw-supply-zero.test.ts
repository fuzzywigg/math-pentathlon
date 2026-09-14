/**
 * Wave 42 — Kings canCompleteTurn supply-zero + isDrawCondition both trapped. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  canCompleteTurn,
  isDrawCondition,
  checkWinCondition,
  getValidKingMoves,
  findKingPosition,
} from '../../src/games/kings-quadraphages/rules';
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

describe('Wave 42 kings — supply / draw', () => {
  it('zero supply blocks canCompleteTurn even with mobility', () => {
    const state = { ...createInitialGameState(), player1Supply: 0 };
    expect(getValidKingMoves(state, 'player1').length).toBeGreaterThan(0);
    expect(canCompleteTurn(state, 'player1')).toBe(false);
    expect(canCompleteTurn(state, 'player2')).toBe(true);
  });

  it('both kings trapped → draw; checkWin prefers player1 when only p2 trapped', () => {
    const base = createInitialGameState();
    const both = trap(trap(base, 'player1'), 'player2');
    expect(isDrawCondition(both)).toBe(true);
    // checkWin returns player1 first when p2 has zero moves
    expect(checkWinCondition(trap(base, 'player2'))).toBe('player1');
  });

  it('opening not draw and no winner', () => {
    const s = createInitialGameState();
    expect(isDrawCondition(s)).toBe(false);
    expect(checkWinCondition(s)).toBeNull();
  });
});
