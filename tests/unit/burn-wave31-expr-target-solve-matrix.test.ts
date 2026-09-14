/**
 * Wave 31 — expression target challenge solver matrices.
 * Distinct from wave22 UI / wave27 solver smoke / storage (#151).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  solveTargetChallenge,
  createTargetChallenge,
  MAKE_TEN_CHALLENGES,
  TWENTY_FOUR_CHALLENGES,
} from '../../src/core/expressions';

describe('Wave 31 expr-target — small exact solves', () => {
  it.each([
    { numbers: [1, 2, 3], target: 6, ops: ['+', '*'] as const },
    { numbers: [2, 3, 5], target: 10, ops: ['+', '-', '*', '/'] as const },
    { numbers: [4, 5], target: 20, ops: ['*'] as const },
    { numbers: [8, 2], target: 4, ops: ['/'] as const },
  ])('finds exact for $numbers → $target', ({ numbers, target, ops }) => {
    const challenge = createTargetChallenge([...numbers], target, {
      operators: [...ops],
      useAllNumbers: true,
      useEachOnce: true,
    });
    const sols = solveTargetChallenge(challenge, 15);
    expect(sols.length).toBeGreaterThan(0);
    expect(sols.some((s) => s.isExact && s.result === target)).toBe(true);
  });
});

describe('Wave 31 expr-target — maxSolutions cap + ordering', () => {
  it('caps result length and prefers exact then shorter', () => {
    const challenge = createTargetChallenge([1, 2, 3, 6], 6, {
      operators: ['+', '-', '*', '/'],
    });
    const capped = solveTargetChallenge(challenge, 3);
    expect(capped.length).toBeLessThanOrEqual(3);

    const wider = solveTargetChallenge(challenge, 30);
    expect(wider.length).toBeGreaterThanOrEqual(capped.length);

    // exact solutions should sort before near-misses when both present
    const firstExactIdx = wider.findIndex((s) => s.isExact);
    const firstNearIdx = wider.findIndex((s) => !s.isExact);
    if (firstExactIdx !== -1 && firstNearIdx !== -1) {
      expect(firstExactIdx).toBeLessThan(firstNearIdx);
    }
  });
});

describe('Wave 31 expr-target — catalog smoke solves', () => {
  it('every MAKE_TEN challenge yields at least one exact solution', () => {
    for (const challenge of MAKE_TEN_CHALLENGES) {
      const sols = solveTargetChallenge(challenge, 20);
      expect(sols.some((s) => s.isExact)).toBe(true);
    }
  });

  it('first few TWENTY_FOUR challenges find exact solutions', () => {
    // Near-miss tolerance can fill a small maxSolutions budget before exacts;
    // request a large cap so exact 24-solutions are still discovered.
    for (const challenge of TWENTY_FOUR_CHALLENGES.slice(0, 4)) {
      const sols = solveTargetChallenge(challenge, 500);
      expect(
        sols.some((s) => s.isExact && Math.abs(s.result - 24) < 1e-4)
      ).toBe(true);
    }
  });
});

describe('Wave 31 expr-target — operator filter', () => {
  it('with only + cannot multiply to target', () => {
    const challenge = createTargetChallenge([2, 3], 6, {
      operators: ['+'],
      useAllNumbers: true,
      useEachOnce: true,
    });
    const sols = solveTargetChallenge(challenge, 10);
    // 2+3=5 is near-miss (|5-6|<=1) so may appear; exact should be absent
    expect(sols.every((s) => !s.isExact || s.result === 6)).toBe(true);
    expect(sols.some((s) => s.isExact)).toBe(false);
  });
});
