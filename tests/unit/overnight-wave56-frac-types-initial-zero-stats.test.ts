/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact initial zero stats matrix.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';

describe('Wave 56 frac types — initial zero stats', () => {
  it('both seats start with all-zero stats leftover', () => {
    const state = createInitialState('hard');
    for (const stats of [state.player1Stats, state.player2Stats]) {
      expect(stats.score).toBe(0);
      expect(stats.correctAnswers).toBe(0);
      expect(stats.wrongAnswers).toBe(0);
      expect(stats.currentStreak).toBe(0);
      expect(stats.bestStreak).toBe(0);
    }
    expect(state.selectedAnswer).toBeNull();
    expect(state.isCorrect).toBeNull();
    expect(state.problemsCompleted).toBe(0);
  });
});
