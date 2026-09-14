/**
 * Wave 42 — Kings isDrawCondition when both kings trapped. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  isDrawCondition,
  getValidKingMoves,
  findKingPosition,
  checkWinCondition,
} from '../../src/games/kings-quadraphages/rules';
import {
  createInitialGameState,
  type GameState,
} from '../../src/games/kings-quadraphages/game-state';

function surroundBoth(state: GameState): GameState {
  const board = state.board.map((row) => row.map((c) => (c ? { ...c } : null)));
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c]?.type === 'king') continue;
      board[r][c] = { type: 'quadraphage', owner: 'player1' };
    }
  }
  return { ...state, board, player1Supply: 0, player2Supply: 0 };
}

function trapOne(state: GameState, victim: 'player1' | 'player2'): GameState {
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

describe('Wave 42 kings — draw both trapped', () => {
  it('opening is not a draw', () => {
    const state = createInitialGameState();
    expect(isDrawCondition(state)).toBe(false);
  });

  it('both kings zero moves → isDrawCondition true', () => {
    const trapped = surroundBoth(createInitialGameState());
    expect(getValidKingMoves(trapped, 'player1')).toHaveLength(0);
    expect(getValidKingMoves(trapped, 'player2')).toHaveLength(0);
    expect(isDrawCondition(trapped)).toBe(true);
  });

  it('single king trapped is not a draw', () => {
    const one = trapOne(createInitialGameState(), 'player2');
    expect(getValidKingMoves(one, 'player2')).toHaveLength(0);
    expect(getValidKingMoves(one, 'player1').length).toBeGreaterThan(0);
    expect(isDrawCondition(one)).toBe(false);
    expect(checkWinCondition(one)).toBe('player1');
  });

  it('both trapped still reports a win via checkWinCondition preference', () => {
    const both = surroundBoth(createInitialGameState());
    expect(isDrawCondition(both)).toBe(true);
    // checkWinCondition checks player2 first → player1 wins
    expect(checkWinCondition(both)).toBe('player1');
  });
});
