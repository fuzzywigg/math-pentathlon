/**
 * Wave 31 — expression evaluate operator matrix + decimals.
 * Distinct from wave22 UI / wave27 edges / storage (#151).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { evaluate } from '../../src/core/expressions';

describe('Wave 31 expr-eval — arithmetic matrix', () => {
  it.each([
    ['1+1', 2],
    ['100-1', 99],
    ['6*7', 42],
    ['15/3', 5],
    ['7/2', 3.5],
    ['2^10', 1024],
    ['0*999', 0],
    ['0+0', 0],
    ['9-9', 0],
    ['1.5*2', 3],
    ['.25*4', 1],
    ['10/4*2', 5],
    ['(3+5)*(2-1)', 8],
    ['2^3*3', 24],
    ['100/10/2', 5],
  ] as const)('evaluate(%j) → %d', (src, expected) => {
    expect(evaluate(src)).toEqual({ success: true, value: expected });
  });
});

describe('Wave 31 expr-eval — unicode operators', () => {
  it('evaluates × and ÷ the same as * and /', () => {
    expect(evaluate('6×7')).toEqual({ success: true, value: 42 });
    expect(evaluate('20÷4')).toEqual({ success: true, value: 5 });
    expect(evaluate('3×4÷2')).toEqual({ success: true, value: 6 });
  });
});

describe('Wave 31 expr-eval — whitespace tolerance', () => {
  it('ignores whitespace in successful evaluations', () => {
    expect(evaluate('  2  +  2  ')).toEqual({ success: true, value: 4 });
    expect(evaluate('\n3\t*\n5\n')).toEqual({ success: true, value: 15 });
  });
});

describe('Wave 31 expr-eval — single-token expressions', () => {
  it('returns the number itself', () => {
    expect(evaluate('0')).toEqual({ success: true, value: 0 });
    expect(evaluate('42')).toEqual({ success: true, value: 42 });
    expect(evaluate('3.1415')).toEqual({ success: true, value: 3.1415 });
  });
});
