/**
 * Wave 44 — expr validateSolution × dice subset sums handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createTargetChallenge, validateSolution, evaluate } from '../../src/core/expressions';
import { getAllPossibleSums } from '../../src/core/dice';

describe('Wave 44 handshake — expr × dice subsets', () => {
  it('challenge target in subset sums validates add expression', () => {
    const nums = [2, 3, 4];
    const sums = getAllPossibleSums(nums);
    expect(sums).toContain(9);
    const challenge = createTargetChallenge(nums, 9, {
      operators: ['+'],
      useAllNumbers: true,
      useEachOnce: true,
    });
    expect(validateSolution('2+3+4', challenge).valid).toBe(true);
    expect(evaluate('2+3+4').value).toBe(9);
  });
});
