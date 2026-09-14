/**
 * Wave 30 — parse precedence (power vs mul/div vs add/sub), nested parens, unary chains.
 * Deepens existing expressions parse/evaluateNode APIs.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  tokenize,
  parse,
  evaluateNode,
  evaluate,
} from '../../src/core/expressions';

function ev(expr: string): number {
  const result = evaluate(expr);
  expect(result.success).toBe(true);
  return result.value!;
}

describe('Wave 30 expr-parse — precedence matrix', () => {
  const cases: Array<[string, number]> = [
    ['2+3*4', 14],
    ['2*3+4', 10],
    ['2^3*2', 16],
    ['2*3^2', 18],
    ['2+3^2', 11],
    ['10-2*3', 4],
    ['10/2*5', 25],
    ['10-6/2', 7],
    ['2^3^2', 64], // left-associative powers in this parser
    ['8/2/2', 2],
  ];

  it('matches expected values across op classes', () => {
    for (const [expr, expected] of cases) {
      expect(ev(expr)).toBe(expected);
    }
  });
});

describe('Wave 30 expr-parse — nested parentheses', () => {
  it('forces additive before multiplicative when parenthesized', () => {
    expect(ev('(2+3)*4')).toBe(20);
    expect(ev('2*(3+4)')).toBe(14);
    expect(ev('((2+3)*(4-1))')).toBe(15);
    expect(ev('(2^(1+2))+1')).toBe(9);
  });

  it('rejects missing closers / empty groups via evaluate', () => {
    expect(evaluate('(2+3').success).toBe(false);
    expect(evaluate('2+3)').success).toBe(false);
    expect(evaluate('()').success).toBe(false);
    expect(evaluate('(())').success).toBe(false);
  });
});

describe('Wave 30 expr-parse — unary minus chains', () => {
  it('parses stacked unary minus as nested unary nodes', () => {
    const ast = parse(tokenize('--5'));
    expect(ast.type).toBe('unary');
    if (ast.type === 'unary') {
      expect(ast.operand.type).toBe('unary');
    }
    expect(evaluateNode(ast)).toBe(5);
    expect(ev('---4')).toBe(-4);
    expect(ev('-(-3)')).toBe(3);
    expect(ev('-(2+3)')).toBe(-5);
  });

  it('binds unary as power base when written before caret', () => {
    // 2^-3 = 2^(unary -3)
    expect(ev('2^-3')).toBeCloseTo(0.125);
    // Parser builds (^ (-2) 2) => (-2)^2 = 4 (unary attaches to the base)
    expect(ev('-2^2')).toBe(4);
    expect(ev('-(2^2)')).toBe(-4);
  });
});
