/**
 * Wave 35 — TWENTY_FOUR catalog exact-solution validation sample.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  TWENTY_FOUR_CHALLENGES,
  solveTargetChallenge,
  validateSolution,
} from '../../src/core/expressions';

describe('Wave 35 expr-24 — sampled catalog exacts validate', () => {
  it('first 5 challenges yield exact solutions that validate', () => {
    for (const challenge of TWENTY_FOUR_CHALLENGES.slice(0, 5)) {
      const sols = solveTargetChallenge(challenge, 600);
      const exact = sols.find((s) => s.isExact);
      expect(exact).toBeTruthy();
      expect(validateSolution(exact!.expression, challenge)).toEqual({
        valid: true,
      });
      expect(Math.abs(exact!.result - 24)).toBeLessThan(1e-4);
    }
  });
});

describe('Wave 35 expr-24 — wrong target rejected', () => {
  it('valid arithmetic with wrong total fails', () => {
    const challenge = TWENTY_FOUR_CHALLENGES[0]; // [1,2,3,4]→24
    expect(validateSolution('1+2+3+4', challenge).valid).toBe(false);
  });
});
