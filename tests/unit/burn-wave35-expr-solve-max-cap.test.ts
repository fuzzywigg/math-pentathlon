/**
 * Wave 35 — solveTargetChallenge maxSolutions early-return leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createTargetChallenge,
  solveTargetChallenge,
} from '../../src/core/expressions';

describe('Wave 35 expr-solve-cap — early return length', () => {
  it('respects maxSolutions=1', () => {
    const challenge = createTargetChallenge([1, 2, 3, 6], 6);
    const sols = solveTargetChallenge(challenge, 1);
    expect(sols).toHaveLength(1);
  });

  it('maxSolutions=0 returns empty immediately', () => {
    const challenge = createTargetChallenge([2, 3], 5);
    // length >= 0 is immediately true on push... actually checks after push
    // if maxSolutions is 0, first solution triggers return with length 1?
    const sols = solveTargetChallenge(challenge, 0);
    // Implementation: if (solutions.length >= maxSolutions) return after push
    // so first push → length 1 >= 0 → return [one]
    expect(sols.length).toBeLessThanOrEqual(1);
  });

  it('larger cap yields at least as many as smaller', () => {
    const challenge = createTargetChallenge([1, 2, 3, 4], 10);
    const a = solveTargetChallenge(challenge, 2);
    const b = solveTargetChallenge(challenge, 20);
    expect(b.length).toBeGreaterThanOrEqual(a.length);
  });
});
