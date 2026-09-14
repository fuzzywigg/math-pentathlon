/**
 * Wave 49 — Frac-fact choice click callback. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderAnswerChoices } from '../../src/games/frac-fact/board-ui';

describe('Wave 49 frac-fact — choice click', () => {
  it('passes selected fraction', () => {
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
    const cb = vi.fn();
    const el = renderAnswerChoices(
      { ...createInitialState(), currentProblem: problem, phase: 'playing' },
      cb
    );
    (el.querySelectorAll('.frac-choice-btn')[1] as HTMLButtonElement).click();
    expect(cb).toHaveBeenCalledWith(problem.answerChoices[1]);
  });
});
