/**
 * Wave 30 — validateSolution useEachOnce / useAllNumbers / wrong total matrix.
 * Deepens existing solution validation contracts.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  validateSolution,
  createTargetChallenge,
} from '../../src/core/expressions';

describe('Wave 30 expr-validate — target equality', () => {
  const base = createTargetChallenge([2, 3, 4], 9, {
    useEachOnce: true,
    useAllNumbers: true,
  });

  it('accepts exact full-use expressions', () => {
    expect(validateSolution('2+3+4', base).valid).toBe(true);
    expect(validateSolution('4*3-2-1', base).valid).toBe(false); // 1 not available
  });

  it('rejects wrong totals even with correct numbers', () => {
    expect(validateSolution('2*3+4', base).valid).toBe(false);
    expect(validateSolution('2*3+4', base).error).toMatch(/does not equal target/);
  });

  it('rejects unparsable expressions', () => {
    expect(validateSolution('2+', base).valid).toBe(false);
  });
});

describe('Wave 30 expr-validate — useEachOnce matrix', () => {
  it('blocks reuse when useEachOnce is true', () => {
    const once = createTargetChallenge([5, 5, 2], 12, {
      useEachOnce: true,
      useAllNumbers: false,
    });
    expect(validateSolution('5+5+2', once).valid).toBe(true);
    expect(validateSolution('5+5', createTargetChallenge([5, 5, 2], 10, {
      useEachOnce: true,
      useAllNumbers: false,
    })).valid).toBe(true);
    expect(validateSolution('5+5+5', once).valid).toBe(false);

    const unique = createTargetChallenge([2, 3], 4, {
      useEachOnce: true,
      useAllNumbers: false,
    });
    expect(validateSolution('2+2', unique).valid).toBe(false);
    expect(validateSolution('2+2', unique).error).toMatch(/not available|multiple/i);
  });

  it('allows reuse when useEachOnce is false', () => {
    const reuseOk = createTargetChallenge([2, 3], 6, {
      useEachOnce: false,
      useAllNumbers: false,
    });
    expect(validateSolution('2*2+2', reuseOk).valid).toBe(true);
  });
});

describe('Wave 30 expr-validate — useAllNumbers', () => {
  it('requires full cardinality when useAllNumbers is true', () => {
    const all = createTargetChallenge([1, 2, 3], 6, {
      useAllNumbers: true,
      useEachOnce: true,
    });
    expect(validateSolution('1+2+3', all).valid).toBe(true);
    expect(validateSolution('3*2', all).valid).toBe(false);
    expect(validateSolution('3*2', all).error).toMatch(/Must use all/);
  });

  it('allows partial use when useAllNumbers is false', () => {
    const partial = createTargetChallenge([1, 2, 3, 4], 6, {
      useAllNumbers: false,
      useEachOnce: true,
    });
    expect(validateSolution('2*3', partial).valid).toBe(true);
    expect(validateSolution('1+2+3', partial).valid).toBe(true);
  });
});
