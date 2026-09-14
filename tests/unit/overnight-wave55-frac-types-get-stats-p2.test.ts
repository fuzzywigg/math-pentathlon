/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact getPlayerStats player2.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getPlayerStats } from '../../src/games/frac-fact/types';

describe('Wave 55 frac types — getPlayerStats p2', () => {
  it('returns player2Stats object identity', () => {
    const state = createInitialState('easy');
    const mutated = {
      ...state,
      player2Stats: { ...state.player2Stats, score: 42, bestStreak: 3 },
    };
    expect(getPlayerStats(mutated, 'player2')).toBe(mutated.player2Stats);
    expect(getPlayerStats(mutated, 'player2').score).toBe(42);
    expect(getPlayerStats(mutated, 'player1').score).toBe(0);
  });
});
