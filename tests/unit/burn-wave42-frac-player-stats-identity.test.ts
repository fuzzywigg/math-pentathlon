/**
 * Wave 42 leftovers B — Frac-Fact getPlayerStats seat identity after submit.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  getPlayerStats,
} from '../../src/games/frac-fact/types';
import {
  startGame,
  submitAnswer,
  generateProblem,
} from '../../src/games/frac-fact/rules';

describe('Wave 42 frac-fact — getPlayerStats', () => {
  it('returns correct seat object references', () => {
    const state = createInitialState('easy');
    expect(getPlayerStats(state, 'player1')).toBe(state.player1Stats);
    expect(getPlayerStats(state, 'player2')).toBe(state.player2Stats);
    expect(getPlayerStats(state, 'player1').score).toBe(0);
    expect(getPlayerStats(state, 'player2').currentStreak).toBe(0);
  });

  it('submit mutates only current seat stats', () => {
    let state = startGame(createInitialState('easy'));
    expect(state.currentProblem).not.toBeNull();
    const p2Before = { ...getPlayerStats(state, 'player2') };
    const correct = state.currentProblem!.correctAnswer;
    state = submitAnswer(state, correct);
    const p1 = getPlayerStats(state, 'player1');
    const p2 = getPlayerStats(state, 'player2');
    expect(p1.score).toBeGreaterThan(0);
    expect(p1.correctAnswers).toBe(1);
    expect(p2).toEqual(p2Before);
  });

  it('wrong answer bumps incorrect only for current seat', () => {
    let state = startGame(createInitialState('medium'));
    const wrong = {
      numerator: state.currentProblem!.correctAnswer.numerator + 7,
      denominator: state.currentProblem!.correctAnswer.denominator + 3,
    };
    state = submitAnswer(state, wrong);
    expect(getPlayerStats(state, 'player1').wrongAnswers).toBe(1);
    expect(getPlayerStats(state, 'player1').currentStreak).toBe(0);
    expect(getPlayerStats(state, 'player2').wrongAnswers).toBe(0);
  });

  it('generateProblem respects difficulty without changing stats', () => {
    const state = createInitialState('hard');
    const problem = generateProblem('hard');
    expect(problem.operation).toBeTruthy();
    expect(getPlayerStats(state, 'player1').score).toBe(0);
  });
});
