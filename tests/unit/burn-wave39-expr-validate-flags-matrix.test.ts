/**
 * Wave 39 — validateSolution useEachOnce / useAllNumbers flag matrix.
 * Beyond wave38 catalog. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  validateSolution,
  createTargetChallenge,
} from '../../src/core/expressions';

describe('Wave 39 expr — validate flags matrix', () => {
  it('useEachOnce false allows duplicate digit reuse', () => {
    const c = createTargetChallenge([2, 3], 4, {
      useEachOnce: false,
      useAllNumbers: false,
      operators: ['+', '*'],
    });
    // 2+2 uses 2 twice — allowed when useEachOnce false
    expect(validateSolution('2+2', c).valid).toBe(true);
  });

  it('useAllNumbers false allows partial number use', () => {
    const c = createTargetChallenge([1, 2, 3], 3, {
      useAllNumbers: false,
      useEachOnce: true,
    });
    expect(validateSolution('3', c).valid).toBe(true);
  });

  it('both true rejects reuse and requires all numbers', () => {
    const c = createTargetChallenge([1, 2, 3], 6, {
      useAllNumbers: true,
      useEachOnce: true,
    });
    expect(validateSolution('1+2+3', c).valid).toBe(true);
    expect(validateSolution('3+3', c).valid).toBe(false);
    expect(validateSolution('1+2', c).valid).toBe(false);
  });
});
