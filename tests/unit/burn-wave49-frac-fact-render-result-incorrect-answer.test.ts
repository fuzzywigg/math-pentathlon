/**
 * Wave 49 — Frac-fact incorrect result shows answer. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderResult } from '../../src/games/frac-fact/board-ui';

describe('Wave 49 frac-fact — incorrect result', () => {
  it('shows Incorrect and correct-answer slot', () => {
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
    const el = renderResult(
      {
        ...createInitialState(),
        currentProblem: problem,
        phase: 'showingResult',
        isCorrect: false,
      },
      () => {}
    );
    expect(el.querySelector('.frac-feedback.incorrect')?.textContent).toMatch(/Incorrect/);
    expect(el.querySelector('.frac-correct-answer')).toBeTruthy();
  });
});
