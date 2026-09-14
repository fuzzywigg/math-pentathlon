/**
 * Wave 49 — Frac-fact correct answer box class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderProblem } from '../../src/games/frac-fact/board-ui';

describe('Wave 49 frac-fact — correct class', () => {
  it('adds correct class on showingResult', () => {
    const problem = {
  id: 'p1',
  operand1: { numerator: 1, denominator: 2 },
  operand2: { numerator: 1, denominator: 3 },
  operation: 'add' as const,
  correctAnswer: { numerator: 5, denominator: 6 },
  answerChoices: [
    { numerator: 5, denominator: 6 },
    { numerator: 2, denominator: 5 },
    { numerator: 1, denominator: 6 },
    { numerator: 4, denominator: 5 },
  ],
};
    const el = renderProblem({
      ...createInitialState(),
      currentProblem: problem,
      phase: 'showingResult',
      selectedAnswer: problem.correctAnswer,
      isCorrect: true,
    });
    expect(el.querySelector('.frac-answer-box')?.classList.contains('correct')).toBe(true);
  });
});
