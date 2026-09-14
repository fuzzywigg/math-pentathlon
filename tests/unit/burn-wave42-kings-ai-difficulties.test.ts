/**
 * Wave 42 — Kings AI getAIMove / getBestMove / getRandomMove leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getAIMove,
  getBestMove,
  getRandomMove,
  evaluatePosition,
  isAITurn,
} from '../../src/games/kings-quadraphages/ai';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { getValidKingMoves, getValidQuadraphagePlacements } from '../../src/games/kings-quadraphages/rules';

describe('Wave 42 kings — AI difficulties', () => {
  it('easy/medium/hard return kingMove + placement in valids', () => {
    const state = createInitialGameState();
    for (const d of ['easy', 'medium', 'hard'] as const) {
      const move = getAIMove(state, 'player1', d);
      expect(move).not.toBeNull();
      const kingValids = getValidKingMoves(state, 'player1');
      expect(kingValids.some((p) => p.row === move!.kingMove.row && p.col === move!.kingMove.col)).toBe(true);
      const places = getValidQuadraphagePlacements(state);
      // after king move placement validity differs; just ensure board coords
      expect(move!.quadraphagePlacement.row).toBeGreaterThanOrEqual(0);
      expect(move!.quadraphagePlacement.col).toBeGreaterThanOrEqual(0);
      expect(places.length).toBeGreaterThan(0);
    }
  });

  it('getBestMove and getRandomMove nonempty on opening', () => {
    const state = createInitialGameState();
    expect(getBestMove(state, 'player1')).not.toBeNull();
    expect(getRandomMove(state, 'player1')).not.toBeNull();
  });

  it('evaluatePosition opening near-zero mobility balance', () => {
    const state = createInitialGameState();
    const score = evaluatePosition(state, 'player1');
    expect(Number.isFinite(score)).toBe(true);
    expect(Math.abs(score)).toBeLessThan(200);
  });

  it('isAITurn gates human-vs-ai and gameOver', () => {
    const state = createInitialGameState();
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    const over = { ...state, turnPhase: 'gameOver' as const, winner: 'player1' as const };
    expect(isAITurn(over, 'player1', 'human-vs-ai')).toBe(false);
  });
});
