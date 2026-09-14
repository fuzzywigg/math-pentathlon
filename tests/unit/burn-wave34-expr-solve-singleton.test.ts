/**
 * Wave 34 — solveTargetChallenge singleton / empty-op leftovers.
 * Hits buildExpression single-number path unused by 2–4 number matrices.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createTargetChallenge,
  solveTargetChallenge,
  validateSolution,
} from '../../src/core/expressions';

describe('Wave 34 expr-solve — singleton number challenges', () => {
  it('single number equal to target yields exact solution string', () => {
    const challenge = createTargetChallenge([7], 7, {
      operators: ['+', '-', '*', '/'],
      useAllNumbers: true,
      useEachOnce: true,
    });
    const sols = solveTargetChallenge(challenge, 5);
    expect(sols.some((s) => s.isExact && s.expression === '7')).toBe(true);
    expect(validateSolution('7', challenge).valid).toBe(true);
  });

  it('single number near-miss within tolerance of 1 is returned', () => {
    const challenge = createTargetChallenge([5], 6, {
      operators: ['+'],
      useAllNumbers: true,
    });
    const sols = solveTargetChallenge(challenge, 5);
    expect(sols.length).toBeGreaterThan(0);
    expect(sols.every((s) => Math.abs(s.result - 6) <= 1)).toBe(true);
  });

  it('two-number solve still works alongside singleton path', () => {
    const challenge = createTargetChallenge([9, 3], 3, {
      operators: ['/'],
      useAllNumbers: true,
    });
    const sols = solveTargetChallenge(challenge, 10);
    expect(sols.some((s) => s.isExact && s.result === 3)).toBe(true);
  });
});
