/**
 * Wave 49 — Frac-fact four choice buttons + aria. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderAnswerChoices } from '../../src/games/frac-fact/board-ui';

describe('Wave 49 frac-fact — four choices', () => {
  it('renders 4 aria-labeled buttons', () => {
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
    const el = renderAnswerChoices(
      { ...createInitialState(), currentProblem: problem, phase: 'playing' },
      () => {}
    );
    const btns = el.querySelectorAll('.frac-choice-btn');
    expect(btns.length).toBe(4);
    expect(btns[0]?.getAttribute('aria-label')).toMatch(/Answer 5\/6/);
  });
});
