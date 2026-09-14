/**
 * Overnight HEAVY — Frac Fact problemHistory.timeSpent always 0 on submit.
 * Distinct leftover vs wave41 history isCorrect only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { submitAnswer } from '../../src/games/frac-fact/rules';
import {
  createInitialState,
  type FractionProblem,
} from '../../src/games/frac-fact/types';

const PROBLEM: FractionProblem = {
  id: 't0',
  operand1: { numerator: 2, denominator: 3 },
  operand2: { numerator: 1, denominator: 3 },
  operation: 'subtract',
  correctAnswer: { numerator: 1, denominator: 3 },
  answerChoices: [
    { numerator: 1, denominator: 3 },
    { numerator: 1, denominator: 1 },
  ],
};

describe('Overnight frac — timeSpent zero', () => {
  it('history entry records timeSpent 0 for right and wrong', () => {
    const base = {
      ...createInitialState('easy'),
      phase: 'playing' as const,
      currentProblem: PROBLEM,
    };
    const right = submitAnswer(base, PROBLEM.correctAnswer);
    expect(right.problemHistory[0].timeSpent).toBe(0);
    const wrong = submitAnswer(base, { numerator: 1, denominator: 1 });
    expect(wrong.problemHistory[0].timeSpent).toBe(0);
  });
});
