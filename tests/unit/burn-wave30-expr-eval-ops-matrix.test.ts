/**
 * Wave 30 — evaluate op×operand grids + error edges (/0, empty, junk).
 * Deepens existing evaluate / evaluateNode binary ops.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { evaluate, evaluateNode, parse, tokenize } from '../../src/core/expressions';

describe('Wave 30 expr-eval — binary op grid', () => {
  const pairs: Array<[number, number]> = [
    [0, 1],
    [1, 1],
    [2, 3],
    [7, 2],
    [10, 5],
    [-4, 2],
    [9, -3],
  ];

  it('+ - * match JS arithmetic on samples', () => {
    for (const [a, b] of pairs) {
      expect(evaluate(`${a}+${b}`)).toEqual({ success: true, value: a + b });
      expect(evaluate(`${a}-${b}`)).toEqual({ success: true, value: a - b });
      expect(evaluate(`${a}*${b}`)).toEqual({ success: true, value: a * b });
    }
  });

  it('/ and ^ match on non-zero denominators', () => {
    for (const [a, b] of pairs) {
      if (b !== 0) {
        expect(evaluate(`${a}/${b}`).value).toBeCloseTo(a / b);
      }
      expect(evaluate(`${a}^${b}`).value).toBeCloseTo(Math.pow(a, b));
    }
  });
});

describe('Wave 30 expr-eval — error edges', () => {
  it('reports empty, trailing op, division by zero', () => {
    expect(evaluate('')).toEqual({ success: false, error: 'Empty expression' });
    expect(evaluate('   ').success).toBe(false);
    expect(evaluate('2+').success).toBe(false);
    expect(evaluate('2/0').success).toBe(false);
    expect(evaluate('2/0').error).toMatch(/zero/i);
  });

  it('evaluateNode throws on unknown operator nodes', () => {
    const bad = {
      type: 'binary' as const,
      operator: '=' as const,
      left: { type: 'number' as const, value: 1 },
      right: { type: 'number' as const, value: 2 },
    };
    expect(() => evaluateNode(bad)).toThrow(/Unknown operator/);
  });

  it('skips junk so remaining tokens can still evaluate', () => {
    expect(evaluate('2+#3')).toEqual({ success: true, value: 5 });
  });
});

describe('Wave 30 expr-eval — parse leftover tokens', () => {
  it('fails when tokens remain after a complete primary', () => {
    // "2 3" tokenizes to two numbers; parse should reject leftover
    expect(evaluate('2 3').success).toBe(false);
    expect(() => parse(tokenize('2 3'))).toThrow(/Unexpected token/);
  });
});
