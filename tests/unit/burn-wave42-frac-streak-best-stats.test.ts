/**
 * Wave 42 leftovers B — Frac getPlayerStats bestStreak after correct.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  getPlayerStats,
} from '../../src/games/frac-fact/types';
import { startGame, submitAnswer } from '../../src/games/frac-fact/rules';

describe('Wave 42 frac-fact — streak/bestStreak via getPlayerStats', () => {
  it('correct answer bumps currentStreak and bestStreak', () => {
    let state = startGame(createInitialState('easy'));
    state = submitAnswer(state, state.currentProblem!.correctAnswer);
    const stats = getPlayerStats(state, 'player1');
    expect(stats.currentStreak).toBeGreaterThanOrEqual(1);
    expect(stats.bestStreak).toBeGreaterThanOrEqual(stats.currentStreak);
    expect(stats.correctAnswers).toBe(1);
  });
});
