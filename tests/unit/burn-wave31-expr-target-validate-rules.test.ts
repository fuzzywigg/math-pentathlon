/**
 * Wave 31 — expression validateSolution rule matrix.
 * Distinct from wave22 UI / wave27 solver smoke / storage (#151).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  validateSolution,
  createTargetChallenge,
} from '../../src/core/expressions';

describe('Wave 31 expr-validate — exact match acceptance', () => {
  it('accepts correct full-use expressions', () => {
    const challenge = createTargetChallenge([1, 2, 3, 4], 10, {
      operators: ['+', '-', '*', '/'],
      useAllNumbers: true,
      useEachOnce: true,
    });
    expect(validateSolution('1+2+3+4', challenge)).toEqual({ valid: true });
    expect(validateSolution('(1+4)*2', challenge).valid).toBe(false); // missing 3, wrong count
  });
});

describe('Wave 31 expr-validate — wrong total', () => {
  it('rejects evaluable expressions that miss the target', () => {
    const challenge = createTargetChallenge([2, 3], 10, {
      useAllNumbers: true,
      useEachOnce: true,
    });
    const result = validateSolution('2+3', challenge);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/does not equal target/i);
  });
});

describe('Wave 31 expr-validate — useEachOnce', () => {
  it('rejects reused numbers when useEachOnce is true', () => {
    const challenge = createTargetChallenge([2, 5], 4, {
      operators: ['+'],
      useAllNumbers: false,
      useEachOnce: true,
    });
    expect(validateSolution('2+2', challenge).valid).toBe(false);
    expect(validateSolution('2+2', challenge).error).toMatch(
      /not available|multiple/i
    );
  });

  it('allows reuse when useEachOnce is false', () => {
    const challenge = createTargetChallenge([2, 5], 4, {
      operators: ['+'],
      useAllNumbers: false,
      useEachOnce: false,
    });
    expect(validateSolution('2+2', challenge)).toEqual({ valid: true });
  });
});

describe('Wave 31 expr-validate — useAllNumbers', () => {
  it('rejects partial number usage when required', () => {
    const challenge = createTargetChallenge([1, 2, 3], 3, {
      useAllNumbers: true,
      useEachOnce: true,
    });
    expect(validateSolution('1+2', challenge).valid).toBe(false);
    expect(validateSolution('1+2', challenge).error).toMatch(/all available/i);
    expect(validateSolution('1+2+0', challenge).valid).toBe(false); // 0 not in pool
  });

  it('allows partial usage when useAllNumbers is false', () => {
    const challenge = createTargetChallenge([1, 2, 3], 3, {
      useAllNumbers: false,
      useEachOnce: true,
    });
    expect(validateSolution('1+2', challenge)).toEqual({ valid: true });
    expect(validateSolution('3', challenge)).toEqual({ valid: true });
  });
});

describe('Wave 31 expr-validate — parse failures', () => {
  it('forwards evaluate errors', () => {
    const challenge = createTargetChallenge([1, 2], 3);
    expect(validateSolution('1+', challenge).valid).toBe(false);
    expect(validateSolution('1+', challenge).error).toBeTruthy();
  });
});
