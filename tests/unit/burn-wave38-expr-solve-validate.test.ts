/**
 * Wave 38 — solveTargetChallenge / validateSolution leftovers after #171.
 * Beyond wave 31 target matrices. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createTargetChallenge,
  solveTargetChallenge,
  validateSolution,
  MAKE_TEN_CHALLENGES,
  TWENTY_FOUR_CHALLENGES,
  evaluate,
} from '../../src/core/expressions';

describe('Wave 38 expr-solve — catalog solvability + caps', () => {
  it('MAKE_TEN challenges each yield at least one exact solution', () => {
    for (const ch of MAKE_TEN_CHALLENGES) {
      const sols = solveTargetChallenge(ch, 5);
      expect(sols.length).toBeGreaterThan(0);
      expect(sols.some((s) => s.isExact)).toBe(true);
      expect(sols[0].result).toBe(ch.target);
    }
  });

  it('maxSolutions caps enumeration for a 24-game challenge', () => {
    const ch = TWENTY_FOUR_CHALLENGES[0];
    const limited = solveTargetChallenge(ch, 2);
    expect(limited.length).toBeLessThanOrEqual(2);
    const wider = solveTargetChallenge(ch, 20);
    expect(wider.length).toBeGreaterThanOrEqual(limited.length);
  });

  it('createTargetChallenge defaults require all numbers once', () => {
    const ch = createTargetChallenge([1, 2, 3], 6);
    expect(ch.useAllNumbers).toBe(true);
    expect(ch.useEachOnce).toBe(true);
    expect(validateSolution('1+2+3', ch).valid).toBe(true);
    expect(validateSolution('3+3', ch).valid).toBe(false);
    expect(validateSolution('1+2', ch).valid).toBe(false);
  });

  it('validateSolution rejects eval failures and wrong targets', () => {
    const ch = createTargetChallenge([2, 3, 4], 24, {
      useAllNumbers: false,
      useEachOnce: true,
    });
    expect(validateSolution('2*(3', ch).valid).toBe(false);
    expect(validateSolution('2+3', ch).valid).toBe(false);
    expect(validateSolution('2*3*4', ch).valid).toBe(true);
    expect(evaluate('2*3*4').value).toBe(24);
  });
});
