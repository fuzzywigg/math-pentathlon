/**
 * Wave 30 — equation parse/check + formatNumber / astToString / simplify edges.
 * Deepens existing equation + formatting APIs.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  tokenize,
  parse,
  parseEquation,
  checkEquation,
  evaluateEquation,
  formatNumber,
  astToString,
  simplifyExpression,
  evaluate,
} from '../../src/core/expressions';

describe('Wave 30 expr-equation — truth table', () => {
  const cases: Array<[string, boolean]> = [
    ['2+2=4', true],
    ['3*3=10', false],
    ['10/2=5', true],
    ['2^3=8', true],
    ['(1+2)*3=9', true],
    ['1+1=3', false],
  ];

  it('evaluateEquation matches expected truth for samples', () => {
    for (const [eq, expected] of cases) {
      expect(evaluateEquation(eq).isTrue).toBe(expected);
    }
  });

  it('rejects non-equation strings and multi-equals', () => {
    expect(parseEquation('2+2')).toBeNull();
    expect(parseEquation('a=b=c')).toBeNull();
    expect(evaluateEquation('nope').error).toMatch(/Invalid equation format/i);
  });

  it('supports variables on both sides', () => {
    const vars = new Map([
      ['x', 4],
      ['y', 2],
    ]);
    expect(evaluateEquation('x=y*2', vars).isTrue).toBe(true);
    expect(evaluateEquation('x+y=y', vars).isTrue).toBe(false);
    const missing = evaluateEquation('z=1', vars);
    expect(missing.isTrue).toBe(false);
    expect(missing.error || Number.isNaN(missing.leftValue)).toBeTruthy();
  });
});

describe('Wave 30 expr-equation — checkEquation values', () => {
  it('returns left/right numeric values for true and false', () => {
    const eq = parseEquation('5-1=2*2');
    expect(eq).not.toBeNull();
    const result = checkEquation(eq!);
    expect(result.isTrue).toBe(true);
    expect(result.leftValue).toBe(4);
    expect(result.rightValue).toBe(4);

    const falseEq = checkEquation(parseEquation('1=2')!);
    expect(falseEq.isTrue).toBe(false);
    expect(falseEq.leftValue).toBe(1);
    expect(falseEq.rightValue).toBe(2);
  });
});

describe('Wave 30 expr-format — number / AST / simplify', () => {
  it('formatNumber trims trailing zeros and keeps integers', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(12)).toBe('12');
    expect(formatNumber(-3)).toBe('-3');
    expect(formatNumber(1.5)).toBe('1.5');
    expect(formatNumber(1.25)).toBe('1.25');
    expect(formatNumber(2.5)).toBe('2.5');
  });

  it('astToString wraps binaries and unaries; simplify collapses constants', () => {
    expect(astToString(parse(tokenize('2+3')))).toBe('(2 + 3)');
    expect(astToString(parse(tokenize('-5')))).toBe('-(5)');
    expect(astToString(parse(tokenize('x')))).toBe('x');
    expect(simplifyExpression('3*4+2')).toBe('14');
    expect(simplifyExpression('2/0')).toBe('2/0');
    expect(evaluate(simplifyExpression('10-1'))).toEqual({
      success: true,
      value: 9,
    });
  });
});
