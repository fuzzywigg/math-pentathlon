/**
 * Wave 45 TOKENMAXX — Kings evaluatePosition ±10000 trap/missing leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { findKingPosition } from '../../src/games/kings-quadraphages/rules';
import { evaluatePosition } from '../../src/games/kings-quadraphages/ai';
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

function stripKing(state: GameState, player: 'player1' | 'player2'): GameState {
  const board = state.board.map((row) => row.map((c) => (c ? { ...c } : null)));
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const p = board[r][c];
      if (p?.type === 'king' && p.owner === player) board[r][c] = null;
    }
  }
  return { ...state, board };
}

describe('Wave 45 kings — evaluatePosition extremes', () => {
  it('±10000 when opponent/self trapped', () => {
    const base = createInitialGameState();
    expect(evaluatePosition(trap(base, 'player2'), 'player1')).toBe(10000);
    expect(evaluatePosition(trap(base, 'player1'), 'player1')).toBe(-10000);
  });

  it('±10000 when king missing', () => {
    const base = createInitialGameState();
    expect(evaluatePosition(stripKing(base, 'player2'), 'player1')).toBe(10000);
    expect(evaluatePosition(stripKing(base, 'player1'), 'player1')).toBe(-10000);
  });

  it('opening score finite and smaller than win', () => {
    const score = evaluatePosition(createInitialGameState(), 'player1');
    expect(Number.isFinite(score)).toBe(true);
    expect(Math.abs(score)).toBeLessThan(10000);
  });
});
