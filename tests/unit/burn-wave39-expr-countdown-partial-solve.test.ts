/**
 * Wave 39 — COUNTDOWN_CHALLENGES validate + maxSolutions leftovers.
 * Beyond wave 31 catalog smoke / wave 38 MAKE_TEN/24. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  COUNTDOWN_CHALLENGES,
  createTargetChallenge,
  solveTargetChallenge,
  validateSolution,
} from '../../src/core/expressions';

describe('Wave 39 expr — countdown partial solve', () => {
  it('catalog challenges reject useAllNumbers enforcement', () => {
    for (const c of COUNTDOWN_CHALLENGES) {
      expect(c.useAllNumbers).toBe(false);
      expect(c.numbers).toHaveLength(6);
      // Using all six is allowed but not required — wrong total fails
      expect(validateSolution('1+1', c).valid).toBe(false);
    }
  });

  it('maxSolutions caps solver output on small exact set', () => {
    // Solver permutes all listed numbers; keep the pool tiny and fully used.
    const challenge = createTargetChallenge([10, 5], 15, {
      operators: ['+', '-', '*', '/'],
      useAllNumbers: true,
      useEachOnce: true,
    });
    expect(validateSolution('10+5', challenge)).toEqual({ valid: true });
    const capped = solveTargetChallenge(challenge, 2);
    expect(capped.length).toBeLessThanOrEqual(2);
    expect(capped.length).toBeGreaterThan(0);
    expect(capped.some((s) => s.isExact)).toBe(true);
  });
});
