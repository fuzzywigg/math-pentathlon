/**
 * Wave 49 — Frac-fact correct result + continue. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderResult } from '../../src/games/frac-fact/board-ui';

describe('Wave 49 frac-fact — correct result', () => {
  it('shows Correct and continue fires', () => {
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
    const el = renderResult(
      {
        ...createInitialState(),
        currentProblem: problem,
        phase: 'showingResult',
        isCorrect: true,
      },
      cb
    );
    expect(el.querySelector('.frac-feedback.correct')?.textContent).toMatch(/Correct/);
    (el.querySelector('.frac-continue-btn') as HTMLButtonElement).click();
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
