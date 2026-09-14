/**
 * Wave 31 — expression parse / precedence / power associativity.
 * Distinct from wave22 UI / wave27 edges / storage (#151).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { tokenize, parse, evaluateNode } from '../../src/core/expressions';

function evalExpr(src: string): number {
  return evaluateNode(parse(tokenize(src)));
}

describe('Wave 31 expr-parse — additive / multiplicative precedence', () => {
  it.each([
    ['2+3*4', 14],
    ['2*3+4', 10],
    ['10-3*2', 4],
    ['10/2+3', 8],
    ['10-6/2', 7],
    ['1+2+3*4', 15],
    ['2*3*4+1', 25],
  ] as const)('%s → %d', (src, expected) => {
    expect(evalExpr(src)).toBe(expected);
  });
});

describe('Wave 31 expr-parse — parentheses override', () => {
  it.each([
    ['(2+3)*4', 20],
    ['2*(3+4)', 14],
    ['(10-6)/2', 2],
    ['((1+2)*3)+4', 13],
    ['1+(2*(3+(4*5)))', 47],
  ] as const)('%s → %d', (src, expected) => {
    expect(evalExpr(src)).toBe(expected);
  });
});

describe('Wave 31 expr-parse — power chains', () => {
  it('parses left-associative power chains via successive binary ^', () => {
    // 2^3^2 → (2^3)^2 = 64 with this parser (left-associative loop)
    expect(evalExpr('2^3^2')).toBe(64);
    expect(evalExpr('2^3')).toBe(8);
    expect(evalExpr('4^0.5')).toBe(2);
  });

  it('mixes power with lower-precedence ops', () => {
    expect(evalExpr('2+3^2')).toBe(11);
    expect(evalExpr('2*3^2')).toBe(18);
    expect(evalExpr('(1+1)^3')).toBe(8);
  });
});

describe('Wave 31 expr-parse — AST shapes', () => {
  it('builds binary trees for a+b*c', () => {
    const ast = parse(tokenize('a+b*c'));
    expect(ast).toMatchObject({
      type: 'binary',
      operator: '+',
      left: { type: 'variable', name: 'a' },
      right: {
        type: 'binary',
        operator: '*',
        left: { type: 'variable', name: 'b' },
        right: { type: 'variable', name: 'c' },
      },
    });
  });

  it('throws on leftover tokens after a complete primary', () => {
    expect(() => parse(tokenize('1 2'))).toThrow(/unexpected token/i);
  });

  it('throws on empty token stream', () => {
    expect(() => parse([])).toThrow(/unexpected end/i);
  });
});
