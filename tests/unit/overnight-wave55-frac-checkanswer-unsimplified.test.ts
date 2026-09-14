/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact checkAnswer equivalent unsimplified.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { checkAnswer } from '../../src/games/frac-fact/rules';
import type { FractionProblem } from '../../src/games/frac-fact/types';

const problem: FractionProblem = {
  id: 'eq',
  operand1: { numerator: 1, denominator: 2 },
  operand2: { numerator: 1, denominator: 2 },
  operation: 'add',
  correctAnswer: { numerator: 1, denominator: 1 },
  answerChoices: [],
};

describe('Wave 55 frac rules — checkAnswer equivalent', () => {
  it('accepts 2/2 as equivalent of 1/1 and rejects 1/2', () => {
    expect(checkAnswer(problem, { numerator: 2, denominator: 2 })).toBe(true);
    expect(checkAnswer(problem, { numerator: 1, denominator: 2 })).toBe(false);
  });
});
