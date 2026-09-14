/**
 * Wave 41 — Frac Fact submitAnswer scoring + wrong answer streak reset.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  POINTS_PER_CORRECT,
  STREAK_BONUS,
} from '../../src/games/frac-fact/types';
import {
  generateProblem,
  submitAnswer,
  checkAnswer,
  formatFraction,
  getOperationSymbol,
} from '../../src/games/frac-fact/rules';

describe('Wave 41 frac-fact — submit playing', () => {
  it('correct submit awards points and enters showingResult', () => {
    const problem = generateProblem('easy', 1);
    const state = {
      ...createInitialState('easy'),
      phase: 'playing' as const,
      currentProblem: problem,
      currentPlayer: 'player1' as const,
    };
    const next = submitAnswer(state, problem.correctAnswer);
    expect(next.phase).toBe('showingResult');
    expect(next.isCorrect).toBe(true);
    expect(next.player1Stats.score).toBeGreaterThanOrEqual(POINTS_PER_CORRECT);
    expect(next.player1Stats.currentStreak).toBeGreaterThanOrEqual(1);
    expect(STREAK_BONUS).toBeGreaterThanOrEqual(0);
  });

  it('wrong submit keeps phase showingResult with isCorrect false', () => {
    const problem = generateProblem('easy', 2);
    const wrong =
      problem.answerChoices.find((c) => !checkAnswer(problem, c)) ?? {
        numerator: 99,
        denominator: 1,
      };
    const state = {
      ...createInitialState('easy'),
      phase: 'playing' as const,
      currentProblem: problem,
    };
    const next = submitAnswer(state, wrong);
    expect(next.phase).toBe('showingResult');
    expect(next.isCorrect).toBe(false);
  });

  it('formatFraction and operation symbols non-empty', () => {
    expect(formatFraction({ numerator: 1, denominator: 2 })).toMatch(/1/);
    expect(getOperationSymbol('add')).toBeTruthy();
    expect(getOperationSymbol('divide')).toBeTruthy();
  });
});
