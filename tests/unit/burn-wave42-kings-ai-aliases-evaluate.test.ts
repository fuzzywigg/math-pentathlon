/**
 * Wave 42 leftovers B — Kings AI aliases + evaluatePosition extremes.
 * Beyond wave41 phase/move traps. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getAIMove,
  getBestMove,
  getRandomMove,
  evaluatePosition,
  isAITurn,
} from '../../src/games/kings-quadraphages/ai';
import {
  createInitialGameState,
  type GameState,
} from '../../src/games/kings-quadraphages/game-state';
import {
  findKingPosition,
  getValidKingMoves,
} from '../../src/games/kings-quadraphages/rules';

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

describe('Wave 42 kings — AI aliases / evaluate', () => {
  it('getRandomMove / easy / hard return legal king+quad on opening', () => {
    const state = createInitialGameState();
    const easy = getAIMove(state, 'player1', 'easy');
    const hard = getAIMove(state, 'player1', 'hard');
    const random = getRandomMove(state, 'player1');
    const best = getBestMove(state, 'player1', 'easy');
    for (const move of [easy, hard, random, best]) {
      expect(move).not.toBeNull();
      const legal = getValidKingMoves(state, 'player1');
      expect(
        legal.some(
          (m) => m.row === move!.kingMove.row && m.col === move!.kingMove.col
        )
      ).toBe(true);
      expect(move!.quadraphagePlacement.row).toBeGreaterThanOrEqual(0);
      expect(move!.quadraphagePlacement.col).toBeLessThan(9);
    }
  });

  it('evaluatePosition ±10000 when king trapped', () => {
    const base = createInitialGameState();
    const p2Trapped = trapKing(base, 'player2');
    expect(evaluatePosition(p2Trapped, 'player1')).toBe(10000);
    expect(evaluatePosition(p2Trapped, 'player2')).toBe(-10000);
    const p1Trapped = trapKing(base, 'player1');
    expect(evaluatePosition(p1Trapped, 'player1')).toBe(-10000);
    expect(evaluatePosition(p1Trapped, 'player2')).toBe(10000);
  });

  it('evaluatePosition opening is finite heuristic', () => {
    const score = evaluatePosition(createInitialGameState(), 'player1');
    expect(Number.isFinite(score)).toBe(true);
    expect(Math.abs(score)).toBeLessThan(10000);
  });

  it('isAITurn gates hvh / null / gameOver / seat', () => {
    const state = createInitialGameState();
    expect(isAITurn(state, 'player2', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    const over = { ...state, turnPhase: 'gameOver' as const };
    expect(isAITurn(over, 'player1', 'human-vs-ai')).toBe(false);
  });
});
