/**
 * Wave 38 — formatNumber trim / astToString leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { formatNumber, astToString, parse, tokenize } from '../../src/core/expressions';

describe('Wave 38 expr-format — trim / ast', () => {
  it('trims trailing zeros and bare decimal point', () => {
    expect(formatNumber(1)).toBe('1');
    expect(formatNumber(1.0)).toBe('1');
    expect(formatNumber(2.5)).toBe('2.5');
    expect(formatNumber(Number(1.0000))).toBe('1');
  });

  it('formats fractional and negative decimals', () => {
    expect(formatNumber(0.123456)).toBe('0.1235');
    expect(formatNumber(-3.25)).toBe('-3.25');
    expect(formatNumber(-0)).toBe('0');
  });

  it('astToString wraps binary and unary forms', () => {
    const ast = parse(tokenize('-(2+3)'));
    expect(astToString(ast)).toMatch(/-/);
    expect(astToString({ type: 'number', value: 1.5 })).toBe('1.5');
    expect(astToString({ type: 'variable', name: 'n' })).toBe('n');
  });

  it('astToString of nested binary includes operators', () => {
    const ast = parse(tokenize('1+2*3'));
    const s = astToString(ast);
    expect(s).toContain('+');
    expect(s).toContain('*');
  });
});
