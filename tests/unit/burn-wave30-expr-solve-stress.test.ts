/**
 * Wave 30 — solveTargetChallenge paren forms, truncation, near-miss, sorting.
 * Deepens existing solver beyond wave 27 maxSolutions smoke.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  solveTargetChallenge,
  createTargetChallenge,
  evaluate,
} from '../../src/core/expressions';

describe('Wave 30 expr-solve-stress — four-number parentheses', () => {
  it('finds 24 via parenthesized forms for [1,2,3,4]', () => {
    const challenge = createTargetChallenge([1, 2, 3, 4], 24);
    const sols = solveTargetChallenge(challenge, 40);
    const exact = sols.filter((s) => s.isExact);
    expect(exact.length).toBeGreaterThan(0);
    // At least one solution should use parentheses (4-number builder emits them)
    expect(exact.some((s) => s.expression.includes('('))).toBe(true);
    for (const sol of exact.slice(0, 5)) {
      expect(evaluate(sol.expression).value).toBeCloseTo(24, 4);
    }
  });
});

describe('Wave 30 expr-solve-stress — maxSolutions + ordering', () => {
  it('truncates early and prefers exact then shorter expressions when sorted', () => {
    const challenge = createTargetChallenge([1, 2, 3, 6], 6, {
      useAllNumbers: false,
    });
    const capped = solveTargetChallenge(challenge, 3);
    expect(capped.length).toBeLessThanOrEqual(3);

    const uncapped = solveTargetChallenge(challenge, 50);
    expect(uncapped.length).toBeGreaterThanOrEqual(capped.length);

    // Sort only runs when the search completes (length < maxSolutions).
    // Probe with a huge cap so early-return truncation does not skip sorting.
    const fullySorted = solveTargetChallenge(challenge, 10_000);
    expect(fullySorted.length).toBeLessThan(10_000);
    expect(fullySorted.some((s) => s.isExact)).toBe(true);
    for (let i = 1; i < fullySorted.length; i++) {
      const prev = fullySorted[i - 1];
      const cur = fullySorted[i];
      if (prev.isExact === cur.isExact) {
        expect(prev.expression.length).toBeLessThanOrEqual(
          cur.expression.length
        );
      } else {
        expect(prev.isExact).toBe(true);
        expect(cur.isExact).toBe(false);
      }
    }
  });

  it('includes near-miss (|Δ|≤1) when exact may be absent for hard targets', () => {
    const challenge = createTargetChallenge([2, 3], 7);
    const sols = solveTargetChallenge(challenge, 20);
    expect(sols.length).toBeGreaterThan(0);
    expect(
      sols.every((s) => Math.abs(s.result - challenge.target) <= 1 + 1e-9)
    ).toBe(true);
    expect(sols.some((s) => !s.isExact)).toBe(true);
  });
});

describe('Wave 30 expr-solve-stress — operator subset', () => {
  it('respects restricted operator lists', () => {
    const plusOnly = createTargetChallenge([2, 3, 5], 10, {
      operators: ['+'],
    });
    const sols = solveTargetChallenge(plusOnly, 20);
    expect(sols.some((s) => s.isExact)).toBe(true);
    for (const sol of sols) {
      expect(sol.expression).not.toMatch(/[*/-]/);
    }
  });
});
