/**
 * Wave 40 — Calla analyzeMoves edges + getAIMove when no valids.
 * After #177; tests-only.
 */
import { describe, it, expect } from 'vitest';

import { analyzeMoves, getAIMove } from '../../src/games/calla/ai';
import { createInitialState } from '../../src/games/calla/types';

describe('Wave 40 calla — analyzeMoves / AI leftovers', () => {
  it('analyzeMoves returns ranked entries on opening', () => {
    const state = createInitialState();
    const analyses = analyzeMoves(state, 'player1');
    expect(analyses.length).toBeGreaterThan(0);
    expect(analyses.some((a) => a.isBestMove)).toBe(true);
    expect(analyses[0].reasoning.length).toBeGreaterThan(0);
    expect(typeof analyses[0].score).toBe('number');
  });

  it('analyzeMoves empty when no valid pits', () => {
    const empty = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 0, 0],
      phase: 'selectPit' as const,
    };
    expect(analyzeMoves(empty, 'player1')).toEqual([]);
  });

  it('getAIMove returns null when game over / no pits', () => {
    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(getAIMove(over, 'player1', 'easy')).toBeNull();

    const empty = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 0, 0],
    };
    expect(getAIMove(empty, 'player1', 'medium')).toBeNull();
  });

  it('getAIMove returns a valid pit on opening', () => {
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.pit).toBeGreaterThanOrEqual(0);
    expect(move!.pit).toBeLessThan(5);
  });
});
