/**
 * Wave 49 — Frac-fact choices empty outside playing. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderAnswerChoices } from '../../src/games/frac-fact/board-ui';

describe('Wave 49 frac-fact — choices phase gate', () => {
  it('returns no buttons when not playing', () => {
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
      { ...createInitialState(), currentProblem: problem, phase: 'showingResult' },
      () => {}
    );
    expect(el.querySelectorAll('.frac-choice-btn').length).toBe(0);
  });
});
