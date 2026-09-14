/**
 * Wave 43 — Calla getAIMove opening difficulties leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getAIMove, isAITurn, analyzeMoves } from '../../src/games/calla/ai';

describe('Wave 43 calla — AI opening difficulties', () => {
  it('easy/medium/hard return legal pit; analyzeMarks one best', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    for (const d of ['easy', 'medium', 'hard'] as const) {
      const move = getAIMove(state, 'player1', d);
      expect(move).not.toBeNull();
      expect(move!.pit).toBeGreaterThanOrEqual(0);
      expect(move!.pit).toBeLessThan(5);
    }
    const analysis = analyzeMoves(state, 'player1');
    expect(analysis.length).toBeGreaterThan(0);
    expect(analysis.filter((a) => a.isBestMove).length).toBe(1);
  });

  it('wrong seat / gameOver / hvh gates', () => {
    const state = createInitialState();
    expect(getAIMove(state, 'player2', 'hard')).toBeNull();
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    const over = { ...state, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(getAIMove(over, 'player1', 'hard')).toBeNull();
  });
});
