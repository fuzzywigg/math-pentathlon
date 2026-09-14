/**
 * Wave 30 — MAKE_TEN / TWENTY_FOUR catalog solvability via solveTargetChallenge.
 * Deepens existing challenge catalogs beyond wave 22 deck smoke.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  solveTargetChallenge,
  validateSolution,
  MAKE_TEN_CHALLENGES,
  TWENTY_FOUR_CHALLENGES,
} from '../../src/core/expressions';

function sortedKey(numbers: number[]): string {
  return [...numbers].sort((a, b) => a - b).join(',');
}

describe('Wave 30 expr-solve-catalog — MAKE_TEN', () => {
  it('every MAKE_TEN challenge has at least one exact solution', () => {
    expect(MAKE_TEN_CHALLENGES.length).toBeGreaterThanOrEqual(5);
    for (const challenge of MAKE_TEN_CHALLENGES) {
      expect(challenge.target).toBe(10);
      expect(challenge.numbers).toHaveLength(3);
      const sols = solveTargetChallenge(challenge, 25);
      const exact = sols.filter((s) => s.isExact);
      expect(exact.length).toBeGreaterThan(0);
      for (const sol of exact.slice(0, 3)) {
        expect(validateSolution(sol.expression, challenge).valid).toBe(true);
        expect(Math.abs(sol.result - 10)).toBeLessThan(0.0001);
      }
    }
  });
});

describe('Wave 30 expr-solve-catalog — TWENTY_FOUR sample board', () => {
  it('classic [1,2,3,4] reaches 24 exactly and validates', () => {
    const easy = TWENTY_FOUR_CHALLENGES.find(
      (c) => sortedKey(c.numbers) === '1,2,3,4'
    );
    expect(easy).toBeDefined();
    const sols = solveTargetChallenge(easy!, 30);
    const exact = sols.find((s) => s.isExact);
    expect(exact).toBeDefined();
    expect(validateSolution(exact!.expression, easy!).valid).toBe(true);
  });

  it('known exact expressions validate for solvable catalog boards', () => {
    const known: Record<string, string> = {
      '1,2,3,4': '1*2*3*4',
      '2,3,4,4': '4*3*4/2',
      '1,3,4,6': '6/(1-3/4)',
      '1,5,5,5': '5*(5-1/5)',
      '3,3,8,8': '8/(3-8/3)',
      '2,5,5,10': '5*(5-(2/10))',
      '1,4,5,6': '4/(1-(5/6))',
    };

    for (const challenge of TWENTY_FOUR_CHALLENGES) {
      expect(challenge.target).toBe(24);
      const key = sortedKey(challenge.numbers);
      const expr = known[key];
      if (!expr) continue;
      expect(validateSolution(expr, challenge).valid).toBe(true);
    }
  });

  it('solver finds exact on all boards except the paren-limited 4,4,6,6 case', () => {
    // High maxSolutions so near-miss early-return does not hide exact hits.
    for (const challenge of TWENTY_FOUR_CHALLENGES) {
      const key = sortedKey(challenge.numbers);
      const sols = solveTargetChallenge(challenge, 8000);
      if (key === '4,4,6,6') {
        // Current paren templates do not emit an exact form for this board.
        expect(sols.every((s) => !s.isExact)).toBe(true);
        expect(sols.length).toBeGreaterThan(0);
        continue;
      }
      expect(sols.some((s) => s.isExact)).toBe(true);
    }
  });
});
