/**
 * Wave 44 — validateSolution exact-only near-miss fail leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { validateSolution, createTargetChallenge } from '../../src/core/expressions';

describe('Wave 44 expr — validate near-miss fails', () => {
  it('rejects result off by one even if numbers ok', () => {
    const challenge = createTargetChallenge([2, 3, 5], 10);
    const r = validateSolution('2+3+4', challenge);
    // 4 not in pool OR if somehow — use 2*3+5=11
    const r2 = validateSolution('2*3+5', challenge);
    expect(r2.valid).toBe(false);
    expect(r2.error).toMatch(/does not equal target/i);
  });

  it('accepts exact 2+3+5=10', () => {
    const challenge = createTargetChallenge([2, 3, 5], 10);
    expect(validateSolution('2+3+5', challenge).valid).toBe(true);
  });
});
