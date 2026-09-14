/**
 * Wave 35 — parenthesis mismatch parse / evaluate error leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { evaluate, tokenize, parse } from '../../src/core/expressions';

describe('Wave 35 expr-paren — missing closers/openers', () => {
  it('reports expected closing parenthesis', () => {
    const result = evaluate('(1+2');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/closing parenthesis/i);
  });

  it('unexpected rparen fails parse', () => {
    const result = evaluate('1+2)');
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('empty parens fail', () => {
    expect(evaluate('()').success).toBe(false);
  });

  it('nested balanced parens succeed', () => {
    expect(evaluate('((1+(2*3)))')).toEqual({ success: true, value: 7 });
  });
});

describe('Wave 35 expr-paren — parse throws on leftover tokens', () => {
  it('comparison ops left as unexpected tokens after number', () => {
    expect(() => parse(tokenize('1=2'))).toThrow(/Unexpected token/);
    expect(evaluate('1=2').success).toBe(false);
    expect(evaluate('3<4').success).toBe(false);
  });
});
