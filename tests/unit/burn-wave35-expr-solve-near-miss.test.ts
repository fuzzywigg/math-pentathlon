/**
 * Wave 35 — solveTargetChallenge near-miss-only leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createTargetChallenge,
  solveTargetChallenge,
} from '../../src/core/expressions';

describe('Wave 35 expr-solve-near — only near-miss possible', () => {
  it('with only + on [2,3] targeting 6 yields near-miss 5 only', () => {
    const challenge = createTargetChallenge([2, 3], 6, {
      operators: ['+'],
      useAllNumbers: true,
      useEachOnce: true,
    });
    const sols = solveTargetChallenge(challenge, 20);
    expect(sols.length).toBeGreaterThan(0);
    expect(sols.every((s) => !s.isExact)).toBe(true);
    expect(sols.some((s) => s.result === 5)).toBe(true);
  });

  it('exact preferred when both exact and near exist under large cap', () => {
    const challenge = createTargetChallenge([1, 2, 3], 6, {
      operators: ['+', '*'],
    });
    const sols = solveTargetChallenge(challenge, 50);
    expect(sols[0]?.isExact).toBe(true);
    expect(sols[0]?.result).toBe(6);
  });
});

describe('Wave 35 expr-solve-near — empty arithmetic ops', () => {
  it('filters out non-arithmetic ops leaving no combinations', () => {
    const challenge = createTargetChallenge([1, 2], 3, {
      operators: ['=', '<', '>'],
      useAllNumbers: true,
    });
    const sols = solveTargetChallenge(challenge, 10);
    expect(sols).toEqual([]);
  });
});
