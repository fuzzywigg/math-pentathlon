/**
 * Wave 30 — variables + unary combinations via evaluateNode / evaluate.
 * Deepens existing VariableMap handling beyond smoke coverage.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  tokenize,
  parse,
  evaluate,
  evaluateNode,
  type VariableMap,
} from '../../src/core/expressions';

describe('Wave 30 expr-vars — map lookups', () => {
  it('resolves multi-letter and underscored names', () => {
    const vars: VariableMap = new Map([
      ['x', 3],
      ['y1', 4],
      ['total_score', 10],
    ]);
    expect(evaluate('x+y1', vars)).toEqual({ success: true, value: 7 });
    expect(evaluate('total_score/x', vars)).toEqual({ success: true, value: 10 / 3 });
    expect(evaluate('x*x+y1', vars).value).toBe(13);
  });

  it('fails when any referenced variable is missing', () => {
    const vars = new Map([['a', 1]]);
    expect(evaluate('a+b', vars).success).toBe(false);
    expect(evaluate('a+b', vars).error).toMatch(/Undefined variable: b/);
    expect(evaluate('missing', new Map()).success).toBe(false);
  });
});

describe('Wave 30 expr-vars — unary + binary mixes', () => {
  it('applies unary minus to variables and groups', () => {
    const vars = new Map([
      ['n', 5],
      ['m', -2],
    ]);
    expect(evaluateNode(parse(tokenize('-n')), vars)).toBe(-5);
    expect(evaluateNode(parse(tokenize('--n')), vars)).toBe(5);
    expect(evaluate('-m', vars).value).toBe(2);
    expect(evaluate('-(n+m)', vars).value).toBe(-3);
    expect(evaluate('n*-m', vars).value).toBe(10);
  });

  it('supports zero and fractional bound values', () => {
    const vars = new Map([
      ['z', 0],
      ['half', 0.5],
    ]);
    expect(evaluate('z+half', vars).value).toBe(0.5);
    expect(evaluate('half^z', vars).value).toBe(1);
    expect(evaluate('1/half', vars).value).toBe(2);
  });
});
