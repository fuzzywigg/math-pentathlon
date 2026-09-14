/**
 * Wave 45 TOKENMAXX — Kings isDrawCondition full-board branch leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  isDrawCondition,
  getValidKingMoves,
  getValidQuadraphagePlacements,
  findKingPosition,
} from '../../src/games/kings-quadraphages/rules';
import { createInitialGameState, type GameState } from '../../src/games/kings-quadraphages/game-state';

function fillExceptKings(state: GameState): GameState {
  const board = state.board.map((row) => row.map((c) => (c ? { ...c } : null)));
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c]?.type === 'king') continue;
      board[r][c] = { type: 'quadraphage', owner: 'player1' };
    }
  }
  return { ...state, board };
}

describe('Wave 45 kings — full-board draw branch', () => {
  it('full board traps both kings → draw via both-zero-moves branch', () => {
    const full = fillExceptKings(createInitialGameState());
    expect(getValidQuadraphagePlacements(full).length).toBe(0);
    expect(getValidKingMoves(full, 'player1').length).toBe(0);
    expect(getValidKingMoves(full, 'player2').length).toBe(0);
    expect(isDrawCondition(full)).toBe(true);
  });

  it('kings remain findable on filled board', () => {
    const full = fillExceptKings(createInitialGameState());
    expect(findKingPosition(full.board, 'player1')).toEqual({ row: 0, col: 4 });
    expect(findKingPosition(full.board, 'player2')).toEqual({ row: 8, col: 4 });
  });
});
