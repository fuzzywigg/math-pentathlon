/**
 * Wave 30 — COUNTDOWN partial-use challenges + validateSolution partial path.
 * Deepens existing COUNTDOWN_CHALLENGES (useAllNumbers: false).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  COUNTDOWN_CHALLENGES,
  createTargetChallenge,
  solveTargetChallenge,
  validateSolution,
  evaluate,
} from '../../src/core/expressions';

describe('Wave 30 expr-countdown — catalog shape', () => {
  it('entries require larger pools and allow partial number use', () => {
    expect(COUNTDOWN_CHALLENGES.length).toBeGreaterThanOrEqual(3);
    for (const challenge of COUNTDOWN_CHALLENGES) {
      expect(challenge.numbers.length).toBeGreaterThanOrEqual(6);
      expect(challenge.useAllNumbers).toBe(false);
      expect(challenge.useEachOnce).toBe(true);
      expect(challenge.target).toBeGreaterThan(100);
    }
  });
});

describe('Wave 30 expr-countdown — partial validateSolution', () => {
  it('accepts subsets that hit the target exactly', () => {
    // Smaller synthetic countdown-style challenge for deterministic checks
    const challenge = createTargetChallenge([25, 50, 3, 6], 156, {
      useAllNumbers: false,
      useEachOnce: true,
    });
    // 50*3 + 6 = 156
    expect(validateSolution('50*3+6', challenge).valid).toBe(true);
    expect(validateSolution('25*6+6', challenge).valid).toBe(false); // reuse 6
    expect(validateSolution('25+50+3+6', challenge).valid).toBe(false); // wrong total
  });

  it('solver can return exact or near-miss without requiring all numbers', () => {
    const challenge = createTargetChallenge([2, 4, 8, 10], 20, {
      useAllNumbers: false,
    });
    const sols = solveTargetChallenge(challenge, 30);
    expect(sols.some((s) => s.isExact)).toBe(true);
    const exact = sols.find((s) => s.isExact)!;
    expect(evaluate(exact.expression).value).toBeCloseTo(20, 4);
    // Partial use: expression need not mention every number
    expect(validateSolution(exact.expression, challenge).valid).toBe(true);
  });
});

describe('Wave 30 expr-countdown — near target solvability smoke', () => {
  it('first COUNTDOWN board yields at least one within-1 candidate quickly', () => {
    const challenge = COUNTDOWN_CHALLENGES[0];
    // Full 6-number search is large; keep maxSolutions small for CI time.
    const sols = solveTargetChallenge(challenge, 5);
    expect(sols.length).toBeGreaterThan(0);
    expect(
      sols.every((s) => Math.abs(s.result - challenge.target) <= 1 + 1e-9)
    ).toBe(true);
  });
});
