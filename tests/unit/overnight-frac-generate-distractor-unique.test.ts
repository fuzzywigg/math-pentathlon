/**
 * Overnight HEAVY — Frac Fact generateProblem choices unique + include correct.
 * Uses unmocked RNG (fixed mock can infinite-loop fill-distractors). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { generateProblem, checkAnswer } from '../../src/games/frac-fact/rules';

describe('Overnight frac — distractor uniqueness', () => {
  it('hard problems keep unique choice keys and exactly one correct', () => {
    for (let n = 0; n < 5; n++) {
      const problem = generateProblem('hard', n + 1);
      const keys = problem.answerChoices.map(
        (c) => `${c.numerator}/${c.denominator}`
      );
      expect(new Set(keys).size).toBe(keys.length);
      const correctCount = problem.answerChoices.filter((c) =>
        checkAnswer(problem, c)
      ).length;
      expect(correctCount).toBe(1);
      expect(['add', 'subtract', 'multiply', 'divide']).toContain(
        problem.operation
      );
    }
  });
});
