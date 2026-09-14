/**
 * Wave 41 — Kings checkWinCondition trap + canCompleteTurn / quad placements.
 * Distinct from wave39 draw both-trapped. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  checkWinCondition,
  canCompleteTurn,
  getValidKingMoves,
  getValidQuadraphagePlacements,
  isValidQuadraphagePlacement,
  findKingPosition,
} from '../../src/games/kings-quadraphages/rules';
import {
  createInitialGameState,
  type GameState,
} from '../../src/games/kings-quadraphages/game-state';

function trapKing(state: GameState, victim: 'player1' | 'player2'): GameState {
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

describe('Wave 41 kings — win / placements matrix', () => {
  it('trapping player2 king → player1 wins; reverse flips', () => {
    const base = createInitialGameState();
    const p2Trapped = trapKing(base, 'player2');
    expect(getValidKingMoves(p2Trapped, 'player2')).toHaveLength(0);
    expect(checkWinCondition(p2Trapped)).toBe('player1');
    const p1Trapped = trapKing(base, 'player1');
    expect(checkWinCondition(p1Trapped)).toBe('player2');
  });

  it('canCompleteTurn false when king trapped even with supply', () => {
    const trapped = trapKing(createInitialGameState(), 'player1');
    expect(trapped.player1Supply).toBe(30);
    expect(canCompleteTurn(trapped, 'player1')).toBe(false);
  });

  it('quad placements exclude kings; OOB false', () => {
    const state = createInitialGameState();
    const places = getValidQuadraphagePlacements(state);
    expect(places.length).toBe(9 * 9 - 2);
    const p1 = findKingPosition(state.board, 'player1')!;
    expect(places.some((p) => p.row === p1.row && p.col === p1.col)).toBe(
      false
    );
    expect(isValidQuadraphagePlacement(state, { row: -2, col: 0 })).toBe(false);
    expect(isValidQuadraphagePlacement(state, { row: 4, col: 4 })).toBe(true);
  });
});
