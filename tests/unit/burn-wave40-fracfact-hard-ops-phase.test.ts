/**
 * Wave 40 — Frac-Fact hard ops catalog + wrong-phase submit.
 * Tests-only leftover after #178.
 */
import { describe, it, expect } from 'vitest';

import {
  generateProblem,
  checkAnswer,
  submitAnswer,
  getOperationSymbol,
} from '../../src/games/frac-fact/rules';
import { createInitialState } from '../../src/games/frac-fact/types';
import type { FractionOperation } from '../../src/core/fractions/types';

const HARD_OPS = new Set<FractionOperation>([
  'add',
  'subtract',
  'multiply',
  'divide',
]);

describe('Wave 40 frac-fact — hard ops / phase', () => {
  it('hard generateProblem ops ⊆ add/sub/mul/div and choices include correct', () => {
    for (let i = 0; i < 12; i++) {
      const p = generateProblem('hard', i + 1);
      expect(HARD_OPS.has(p.operation)).toBe(true);
      expect(
        p.answerChoices.some(
          (c) =>
            c.numerator === p.correctAnswer.numerator &&
            c.denominator === p.correctAnswer.denominator
        )
      ).toBe(true);
    }
  });

  it('checkAnswer rejects nonequivalent; submitAnswer wrong phase identity', () => {
    const problem = generateProblem('easy', 1);
    expect(
      checkAnswer(problem, {
        numerator: problem.correctAnswer.numerator + 1,
        denominator: problem.correctAnswer.denominator,
      })
    ).toBe(false);
    expect(checkAnswer(problem, problem.correctAnswer)).toBe(true);

    const state = createInitialState('easy');
    const showing = {
      ...state,
      phase: 'showingResult' as const,
      currentProblem: problem,
    };
    expect(submitAnswer(showing, problem.correctAnswer)).toBe(showing);
    const over = { ...state, phase: 'gameOver' as const };
    expect(submitAnswer(over, problem.correctAnswer)).toBe(over);
  });

  it('getOperationSymbol matrix', () => {
    expect(getOperationSymbol('add')).toBe('+');
    expect(getOperationSymbol('subtract')).toBe('−');
    expect(getOperationSymbol('multiply')).toBe('×');
    expect(getOperationSymbol('divide')).toBe('÷');
  });
});
