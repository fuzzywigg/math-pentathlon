/**
 * Wave 40 — validateSolution useAllNumbers / useEachOnce leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { validateSolution } from '../../src/core/expressions';

describe('Wave 40 expr — validate useAll / useEachOnce', () => {
  it('useAllNumbers fails when expression omits a number', () => {
    const r = validateSolution('1+2', {
      numbers: [1, 2, 3],
      target: 3,
      operators: ['+', '-', '*', '/'],
      useAllNumbers: true,
      useEachOnce: true,
    });
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/all available numbers/i);
  });

  it('useEachOnce fails on reuse', () => {
    const r = validateSolution('2+2', {
      numbers: [2, 3],
      target: 4,
      operators: ['+'],
      useAllNumbers: false,
      useEachOnce: true,
    });
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/not available|multiple/i);
  });
});
