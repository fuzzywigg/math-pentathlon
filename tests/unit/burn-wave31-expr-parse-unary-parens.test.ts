/**
 * Wave 31 — expression unary minus + nested paren parse edges.
 * Distinct from wave22 UI / wave27 edges / storage (#151).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { tokenize, parse, evaluateNode } from '../../src/core/expressions';

function evalExpr(src: string): number {
  return evaluateNode(parse(tokenize(src)));
}

describe('Wave 31 expr-parse — unary minus', () => {
  it.each([
    ['-5', -5],
    ['--5', 5],
    ['---5', -5],
    ['-2+3', 1],
    ['3+-2', 1],
    ['3*-2', -6],
    ['(-2)*(-3)', 6],
    ['-(2+3)', -5],
    // parseUnary runs before ^ attachment → (-2)^2
    ['-2^2', 4],
  ] as const)('%s → %d', (src, expected) => {
    expect(evalExpr(src)).toBe(expected);
  });

  it('builds unary AST nodes for leading minus', () => {
    const ast = parse(tokenize('-x'));
    expect(ast).toEqual({
      type: 'unary',
      operator: '-',
      operand: { type: 'variable', name: 'x' },
    });
  });
});

describe('Wave 31 expr-parse — paren / token errors', () => {
  it('rejects unmatched opening paren', () => {
    expect(() => parse(tokenize('(1+2'))).toThrow(/closing parenthesis/i);
  });

  it('rejects empty paren primary', () => {
    expect(() => parse(tokenize('()'))).toThrow();
  });

  it('rejects leading operator other than unary minus', () => {
    expect(() => parse(tokenize('+2'))).toThrow(/unexpected token/i);
    expect(() => parse(tokenize('*2'))).toThrow(/unexpected token/i);
  });

  it('rejects trailing operator', () => {
    expect(() => parse(tokenize('2+'))).toThrow();
  });

  it('rejects lone closing paren', () => {
    expect(() => parse(tokenize(')'))).toThrow(/unexpected token/i);
  });
});

describe('Wave 31 expr-parse — deep nesting stress', () => {
  it('evaluates 20 levels of wrapping parens', () => {
    const nested = '('.repeat(20) + '7' + ')'.repeat(20);
    expect(evalExpr(nested)).toBe(7);
  });

  it('evaluates alternating add/mul nest', () => {
    expect(evalExpr('((((((1+1)*2)+1)*2)+1)*2)')).toBe(22);
  });
});
