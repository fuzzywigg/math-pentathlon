/**
 * Wave 31 — COUNTDOWN-style partial-use target challenges.
 * Distinct from wave22 UI / MAKE_TEN catalog / storage (#151).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createTargetChallenge,
  solveTargetChallenge,
  validateSolution,
  COUNTDOWN_CHALLENGES,
} from '../../src/core/expressions';

describe('Wave 31 expr-countdown — partial-use solves', () => {
  it('finds exact with subset of numbers when useAllNumbers=false', () => {
    const challenge = createTargetChallenge([10, 5, 2, 99], 20, {
      operators: ['+', '-', '*', '/'],
      useAllNumbers: false,
      useEachOnce: true,
    });
    const sols = solveTargetChallenge(challenge, 50);
    expect(sols.some((s) => s.isExact)).toBe(true);
    // 10*2 is valid partial use
    expect(validateSolution('10*2', challenge)).toEqual({ valid: true });
    expect(validateSolution('10+5+2+99', challenge).valid).toBe(false);
  });

  it('rejects numbers outside the available pool', () => {
    const challenge = createTargetChallenge([25, 50, 3], 75, {
      useAllNumbers: false,
      useEachOnce: true,
    });
    expect(validateSolution('25+50', challenge)).toEqual({ valid: true });
    expect(validateSolution('25+51', challenge).valid).toBe(false);
  });
});

describe('Wave 31 expr-countdown — catalog shape + solvability smoke', () => {
  it('COUNTDOWN_CHALLENGES keep large targets and six tiles', () => {
    expect(COUNTDOWN_CHALLENGES.length).toBeGreaterThanOrEqual(3);
    for (const c of COUNTDOWN_CHALLENGES) {
      expect(c.numbers).toHaveLength(6);
      expect(c.useAllNumbers).toBe(false);
      expect(c.target).toBeGreaterThan(100);
    }
  });

  it('smaller synthetic countdown-like set finds solutions under a high cap', () => {
    // Full 6-tile countdown is combinatorial-heavy; use a reduced stand-in.
    const challenge = createTargetChallenge([25, 50, 3, 6], 78, {
      operators: ['+', '-', '*', '/'],
      useAllNumbers: false,
      useEachOnce: true,
    });
    // 25+50+3 = 78
    expect(validateSolution('25+50+3', challenge)).toEqual({ valid: true });
    const sols = solveTargetChallenge(challenge, 200);
    expect(sols.some((s) => s.isExact)).toBe(true);
  });
});
