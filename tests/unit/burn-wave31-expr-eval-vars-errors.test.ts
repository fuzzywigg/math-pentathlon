/**
 * Wave 31 — expression evaluate variables + error surfaces.
 * Distinct from wave22 UI / wave27 edges / storage (#151).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  evaluate,
  evaluateNode,
  parse,
  tokenize,
} from '../../src/core/expressions';

describe('Wave 31 expr-eval — variable maps', () => {
  it('substitutes multiple variables', () => {
    const vars = new Map<string, number>([
      ['x', 3],
      ['y', 4],
      ['z', 5],
    ]);
    expect(evaluate('x+y*z', vars)).toEqual({ success: true, value: 23 });
    expect(evaluate('(x+y)*z', vars)).toEqual({ success: true, value: 35 });
    expect(evaluate('x^y', vars)).toEqual({ success: true, value: 81 });
  });

  it('supports zero and negative variable values', () => {
    const vars = new Map<string, number>([
      ['a', 0],
      ['b', -3],
    ]);
    expect(evaluate('a+b', vars)).toEqual({ success: true, value: -3 });
    expect(evaluate('b*b', vars)).toEqual({ success: true, value: 9 });
    expect(evaluate('a*100', vars)).toEqual({ success: true, value: 0 });
  });

  it('evaluateNode throws for missing variables; evaluate wraps as error', () => {
    const ast = parse(tokenize('missing + 1'));
    expect(() => evaluateNode(ast)).toThrow(/undefined variable/i);
    const result = evaluate('missing + 1');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/undefined variable/i);
  });
});

describe('Wave 31 expr-eval — error catalog', () => {
  it('returns Empty expression for blank input', () => {
    expect(evaluate('')).toEqual({ success: false, error: 'Empty expression' });
    expect(evaluate('   ')).toEqual({
      success: false,
      error: 'Empty expression',
    });
  });

  it('surfaces division by zero', () => {
    const result = evaluate('1/0');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/division by zero/i);
  });

  it('surfaces unmatched / unexpected paren and token errors', () => {
    expect(evaluate('(1+2').success).toBe(false);
    expect(evaluate('1+)').success).toBe(false);
    expect(evaluate('()').success).toBe(false);
    expect(evaluate('2+').success).toBe(false);
    expect(evaluate('*3').success).toBe(false);
  });

  it('does not throw on bad input (always returns EvaluationResult)', () => {
    expect(() => evaluate('(((((')).not.toThrow();
    expect(evaluate('(((((').success).toBe(false);
  });
});
