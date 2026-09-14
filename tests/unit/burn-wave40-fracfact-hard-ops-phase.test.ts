/**
 * Wave 40 — Frac-Fact hard ops / submitAnswer phase / checkAnswer / symbols.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/frac-fact/types';
import {
  generateProblem,
  submitAnswer,
  checkAnswer,
  getOperationSymbol,
} from '../../src/games/frac-fact/rules';
import type { FractionOperation } from '../../src/core/fractions/types';
import { areEquivalent } from '../../src/core/fractions/arithmetic';

const HARD_OPS: FractionOperation[] = [
  'add',
  'subtract',
  'multiply',
  'divide',
];

describe('Wave 40 frac-fact — hard ops / phase / check / symbols', () => {
  it('generateProblem hard: ops in add/sub/mul/div; choices include correct', () => {
    const seen = new Set<FractionOperation>();
    for (let i = 0; i < 80; i++) {
      const problem = generateProblem('hard', i + 1);
      expect(HARD_OPS).toContain(problem.operation);
      seen.add(problem.operation);
      expect(
        problem.answerChoices.some((c) =>
          areEquivalent(c, problem.correctAnswer)
        )
      ).toBe(true);
    }
    for (const op of HARD_OPS) {
      expect(seen.has(op)).toBe(true);
    }
  });

  it('submitAnswer wrong phase (showingResult/gameOver) → identity', () => {
    const base = createInitialState();
    const problem = generateProblem('easy', 1);
    const showing = {
      ...base,
      phase: 'showingResult' as const,
      currentProblem: problem,
    };
    expect(
      submitAnswer(showing, { numerator: 1, denominator: 2 })
    ).toBe(showing);

    const over = {
      ...base,
      phase: 'gameOver' as const,
      currentProblem: problem,
    };
    expect(submitAnswer(over, { numerator: 1, denominator: 2 })).toBe(over);
  });

  it('checkAnswer nonequivalent → false', () => {
    const problem = generateProblem('easy', 1);
    const wrong = {
      numerator: problem.correctAnswer.numerator + 7,
      denominator: problem.correctAnswer.denominator + 11,
    };
    expect(areEquivalent(wrong, problem.correctAnswer)).toBe(false);
    expect(checkAnswer(problem, wrong)).toBe(false);
  });

  it('getOperationSymbol matrix for known ops', () => {
    expect(getOperationSymbol('add')).toBe('+');
    expect(getOperationSymbol('subtract')).toBe('−');
    expect(getOperationSymbol('multiply')).toBe('×');
    expect(getOperationSymbol('divide')).toBe('÷');
  });
});
