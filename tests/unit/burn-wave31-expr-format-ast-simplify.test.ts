/**
 * Wave 31 — expression formatNumber / astToString / simplify matrix.
 * Distinct from wave22 UI / wave27 format smoke / storage (#151).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  formatNumber,
  astToString,
  simplifyExpression,
  tokenize,
  parse,
} from '../../src/core/expressions';

describe('Wave 31 expr-format — formatNumber', () => {
  it.each([
    [0, '0'],
    [7, '7'],
    [-3, '-3'],
    [1.5, '1.5'],
    [1.25, '1.25'],
    [2.5, '2.5'],
    [1.23456, '1.2346'], // toFixed(4) then trim
  ] as const)('formatNumber(%j) → %j', (n, expected) => {
    expect(formatNumber(n)).toBe(expected);
  });

  it('trims trailing zeros after toFixed', () => {
    expect(formatNumber(1.2)).toBe('1.2');
    expect(formatNumber(3.0)).toBe('3');
  });
});

describe('Wave 31 expr-format — astToString wrapping', () => {
  it('wraps every binary node in parentheses', () => {
    const ast = parse(tokenize('1+2*3'));
    expect(astToString(ast)).toBe('(1 + (2 * 3))');
  });

  it('wraps unary as -(operand)', () => {
    const ast = parse(tokenize('-5'));
    expect(astToString(ast)).toBe('-(5)');
  });

  it('round-trips variables by name', () => {
    const ast = parse(tokenize('x+y'));
    expect(astToString(ast)).toBe('(x + y)');
  });
});

describe('Wave 31 expr-format — simplifyExpression', () => {
  it.each([
    ['2+2', '4'],
    ['3*3', '9'],
    ['10/4', '2.5'],
    ['(1+2)*3', '9'],
    ['2^3', '8'],
  ] as const)('simplify(%j) → %j', (src, expected) => {
    expect(simplifyExpression(src)).toBe(expected);
  });

  it('returns original string when evaluation fails', () => {
    expect(simplifyExpression('2+')).toBe('2+');
    expect(simplifyExpression('')).toBe('');
    expect(simplifyExpression('(1')).toBe('(1');
  });
});
