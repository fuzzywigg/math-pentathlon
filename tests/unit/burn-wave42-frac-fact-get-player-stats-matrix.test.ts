/** Wave 42 — Frac Fact getPlayerStats seat matrix. Tests-only. */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getPlayerStats,
} from '../../src/games/frac-fact/types';

describe('Wave 42 Frac Fact — getPlayerStats matrix', () => {
  it('returns player1Stats for player1', () => {
    const state = createInitialState('easy');
    const stats = getPlayerStats(state, 'player1');
    expect(stats).toBe(state.player1Stats);
    expect(stats.score).toBe(0);
    expect(stats.correctAnswers).toBe(0);
    expect(stats.wrongAnswers).toBe(0);
    expect(stats.currentStreak).toBe(0);
    expect(stats.bestStreak).toBe(0);
  });

  it('returns player2Stats for player2', () => {
    const state = createInitialState('medium');
    const stats = getPlayerStats(state, 'player2');
    expect(stats).toBe(state.player2Stats);
  });

  it('reflects mutated score on the matching seat only', () => {
    const base = createInitialState('hard');
    const state = {
      ...base,
      player1Stats: { ...base.player1Stats, score: 25, bestStreak: 2 },
      player2Stats: { ...base.player2Stats, score: 40, wrongAnswers: 3 },
    };
    expect(getPlayerStats(state, 'player1').score).toBe(25);
    expect(getPlayerStats(state, 'player1').bestStreak).toBe(2);
    expect(getPlayerStats(state, 'player2').score).toBe(40);
    expect(getPlayerStats(state, 'player2').wrongAnswers).toBe(3);
    expect(getPlayerStats(state, 'player1').wrongAnswers).toBe(0);
  });

  it('initial seats are independent objects', () => {
    const state = createInitialState();
    expect(getPlayerStats(state, 'player1')).not.toBe(
      getPlayerStats(state, 'player2')
    );
  });
});
