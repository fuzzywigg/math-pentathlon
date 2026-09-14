/**
 * Wave 31 — expression power / decimal / near-zero edge evaluations.
 * Distinct from wave22 UI / wave27 edges / storage (#151).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { evaluate } from '../../src/core/expressions';

describe('Wave 31 expr-edges — exponent extremes', () => {
  it.each([
    ['2^0', 1],
    ['0^5', 0],
    ['5^1', 5],
    ['9^0.5', 3],
    ['8^(1/3)', 2],
    ['(-2)^3', -8],
  ] as const)('%s → %d', (src, expected) => {
    const result = evaluate(src);
    expect(result.success).toBe(true);
    expect(result.value).toBeCloseTo(expected, 10);
  });
});

describe('Wave 31 expr-edges — decimal chains', () => {
  it('chains decimal multiplies / divides stably', () => {
    expect(evaluate('0.1+0.2').value).toBeCloseTo(0.3, 10);
    expect(evaluate('1.5*2.5').value).toBeCloseTo(3.75, 10);
    expect(evaluate('0.2/0.1').value).toBeCloseTo(2, 10);
  });
});

describe('Wave 31 expr-edges — identity / annihilator', () => {
  it('respects +0 *1 and *0', () => {
    expect(evaluate('17+0')).toEqual({ success: true, value: 17 });
    expect(evaluate('17*1')).toEqual({ success: true, value: 17 });
    expect(evaluate('17*0')).toEqual({ success: true, value: 0 });
    expect(evaluate('0/17')).toEqual({ success: true, value: 0 });
  });
});

describe('Wave 31 expr-edges — comparison tokens do not evaluate as arithmetic', () => {
  it('fails when inequality operators appear in evaluate()', () => {
    // tokenize accepts = < > ≤ ≥ but evaluateNode binary switch only knows + - * / ^
    expect(evaluate('1=1').success).toBe(false);
    expect(evaluate('1<2').success).toBe(false);
    expect(evaluate('2>1').success).toBe(false);
    expect(evaluate('1≤1').success).toBe(false);
  });
});
