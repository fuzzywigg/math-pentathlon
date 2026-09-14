/**
 * Wave 44 — checkEquation undefined variable leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { parseEquation, checkEquation, evaluateEquation } from '../../src/core/expressions';

describe('Wave 44 expr — equation var error', () => {
  it('checkEquation reports error and NaN sides', () => {
    const eq = parseEquation('x+1=2');
    expect(eq).not.toBeNull();
    const r = checkEquation(eq!);
    expect(r.isTrue).toBe(false);
    expect(Number.isNaN(r.leftValue)).toBe(true);
    expect(r.error).toMatch(/undefined variable/i);
  });

  it('evaluateEquation with map can be true', () => {
    const vars = new Map([['x', 3]]);
    const r = evaluateEquation('x+2=5', vars);
    expect(r.isTrue).toBe(true);
    expect(r.leftValue).toBe(5);
  });
});
