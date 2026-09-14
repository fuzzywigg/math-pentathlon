/**
 * Wave 40 — solveTargetChallenge 4-number paren path leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { solveTargetChallenge } from '../../src/core/expressions';

describe('Wave 40 expr — four-number paren solve', () => {
  it('finds exact solution with four numbers', () => {
    const sols = solveTargetChallenge(
      {
        numbers: [1, 2, 3, 6],
        target: 12,
        operators: ['+', '-', '*', '/'],
        useAllNumbers: true,
        useEachOnce: true,
      },
      20
    );
    expect(sols.length).toBeGreaterThan(0);
    expect(sols.some((s) => s.isExact)).toBe(true);
    expect(sols[0].result).toBeDefined();
  });
});
