/**
 * Wave 44 — solveTargetChallenge maxSolutions early-return leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { solveTargetChallenge } from '../../src/core/expressions';

describe('Wave 44 expr — solve maxSolutions cap', () => {
  it('caps at maxSolutions=1 for easy target', () => {
    const sols = solveTargetChallenge(
      {
        numbers: [1, 2, 3],
        target: 6,
        operators: ['+', '-', '*', '/'],
        useAllNumbers: true,
        useEachOnce: true,
      },
      1
    );
    expect(sols).toHaveLength(1);
  });

  it('larger cap returns more when available', () => {
    const sols = solveTargetChallenge(
      {
        numbers: [1, 2, 3],
        target: 6,
        operators: ['+', '*'],
        useAllNumbers: true,
        useEachOnce: true,
      },
      5
    );
    expect(sols.length).toBeGreaterThanOrEqual(1);
    expect(sols.length).toBeLessThanOrEqual(5);
  });
});
