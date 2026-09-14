/**
 * Overnight HEAVY leftover after #234 — Frac Fact checkAnswer with isNegative flag form.
 * Equivalence tests used unreduced positives only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { checkAnswer } from '../../src/games/frac-fact/rules';
import type { FractionProblem } from '../../src/games/frac-fact/types';

const problem: FractionProblem = {
  id: 'flag',
  operand1: { numerator: 1, denominator: 2 },
  operand2: { numerator: 1, denominator: 4 },
  operation: 'subtract',
  correctAnswer: { numerator: 1, denominator: 4 },
  answerChoices: [{ numerator: 1, denominator: 4 }],
};

describe('Wave 52 frac — checkAnswer flag form', () => {
  it('accepts isNegative:false twin and rejects flag-negative', () => {
    expect(
      checkAnswer(problem, {
        numerator: 1,
        denominator: 4,
        isNegative: false,
      })
    ).toBe(true);
    expect(
      checkAnswer(problem, {
        numerator: 1,
        denominator: 4,
        isNegative: true,
      })
    ).toBe(false);
  });
});
