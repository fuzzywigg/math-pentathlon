/**
 * Wave 35 — MAKE_TEN catalog validateSolution coverage.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  MAKE_TEN_CHALLENGES,
  solveTargetChallenge,
  validateSolution,
  evaluate,
} from '../../src/core/expressions';

describe('Wave 35 expr-make-ten — every catalog exact validates', () => {
  it('solver exact solutions pass validateSolution', () => {
    for (const challenge of MAKE_TEN_CHALLENGES) {
      const sols = solveTargetChallenge(challenge, 40);
      const exact = sols.filter((s) => s.isExact);
      expect(exact.length).toBeGreaterThan(0);
      for (const sol of exact.slice(0, 5)) {
        expect(validateSolution(sol.expression, challenge)).toEqual({
          valid: true,
        });
        expect(evaluate(sol.expression)).toEqual({
          success: true,
          value: 10,
        });
      }
    }
  });
});

describe('Wave 35 expr-make-ten — near-miss does not validate', () => {
  it('rejects expression off by one when target is 10', () => {
    const challenge = MAKE_TEN_CHALLENGES[0]; // [2,3,5] → 10
    // 2*3+5 = 11 (uses all numbers, wrong target)
    expect(validateSolution('2*3+5', challenge).valid).toBe(false);
    expect(validateSolution('2+3', challenge).valid).toBe(false); // partial
  });
});
