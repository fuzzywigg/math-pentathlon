/**
 * Wave 35 — validateSolution with duplicate numbers in pool.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createTargetChallenge,
  validateSolution,
} from '../../src/core/expressions';

describe('Wave 35 expr-validate-dup — duplicate tiles', () => {
  it('allows using each duplicate instance once', () => {
    const challenge = createTargetChallenge([2, 2, 3], 7, {
      operators: ['+'],
      useAllNumbers: true,
      useEachOnce: true,
    });
    expect(validateSolution('2+2+3', challenge)).toEqual({ valid: true });
  });

  it('rejects using a number more times than available', () => {
    // Target matches 2+2+2 so value check passes; useEachOnce must reject
    const challenge = createTargetChallenge([2, 2], 6, {
      operators: ['+'],
      useAllNumbers: false,
      useEachOnce: true,
    });
    expect(validateSolution('2+2', challenge).valid).toBe(false); // 4 ≠ 6
    const bad = validateSolution('2+2+2', challenge);
    expect(bad.valid).toBe(false);
    expect(bad.error).toMatch(/not available|multiple/i);
  });

  it('useEachOnce false allows unlimited reuse of listed numbers', () => {
    const challenge = createTargetChallenge([5], 15, {
      operators: ['+'],
      useAllNumbers: false,
      useEachOnce: false,
    });
    expect(validateSolution('5+5+5', challenge)).toEqual({ valid: true });
  });
});
