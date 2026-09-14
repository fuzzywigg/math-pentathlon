/**
 * Wave 42 leftovers B — Frac getPlayerStats after wrong then correct seats.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  getPlayerStats,
} from '../../src/games/frac-fact/types';
import { startGame, submitAnswer, nextProblem } from '../../src/games/frac-fact/rules';

describe('Wave 42 frac-fact — stats across seats', () => {
  it('p1 wrong then nextProblem hands p2; p2 correct bumps only p2', () => {
    let state = startGame(createInitialState('easy'));
    const wrong = {
      numerator: state.currentProblem!.correctAnswer.numerator + 11,
      denominator: Math.max(
        1,
        state.currentProblem!.correctAnswer.denominator + 5
      ),
    };
    state = submitAnswer(state, wrong);
    expect(getPlayerStats(state, 'player1').wrongAnswers).toBe(1);
    state = nextProblem(state);
    expect(state.currentPlayer).toBe('player2');
    expect(state.currentProblem).not.toBeNull();
    state = submitAnswer(state, state.currentProblem!.correctAnswer);
    expect(getPlayerStats(state, 'player2').correctAnswers).toBe(1);
    expect(getPlayerStats(state, 'player2').score).toBeGreaterThan(0);
    expect(getPlayerStats(state, 'player1').correctAnswers).toBe(0);
  });
});
