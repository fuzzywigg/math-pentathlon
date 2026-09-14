/**
 * Wave 38 — expression tokenize/parse/eval leftover edges after #171.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  tokenize,
  parse,
  evaluate,
  formatNumber,
  astToString,
  simplifyExpression,
  parseEquation,
  evaluateEquation,
} from '../../src/core/expressions';

describe('Wave 38 expr-eval — parentheses / unary / failure edges', () => {
  it('nested parens and unary minus evaluate correctly', () => {
    expect(evaluate('((2+3)*4)-5').value).toBe(15);
    expect(evaluate('-3+5').value).toBe(2);
  });

  it('division by zero and empty input fail cleanly', () => {
    expect(evaluate('1/0').success).toBe(false);
    expect(evaluate('').success).toBe(false);
  });

  it('tokenize → parse → astToString preserves evaluated value', () => {
    for (const expr of ['1+2*3', '(4-1)/3', '10']) {
      const tokens = tokenize(expr);
      expect(tokens.length).toBeGreaterThan(0);
      const ast = parse(tokens);
      const rebuilt = astToString(ast);
      expect(evaluate(rebuilt).value).toBe(evaluate(expr).value);
    }
  });

  it('formatNumber / simplifyExpression / equation helpers', () => {
    expect(formatNumber(3)).toBe('3');
    expect(simplifyExpression('2+3')).toBe('5');
    const eq = parseEquation('3+5=8');
    expect(eq).not.toBeNull();
    expect(evaluateEquation('3+5=8').isTrue).toBe(true);
    expect(evaluateEquation('3+5=9').isTrue).toBe(false);
    expect(parseEquation('not-an-eq')).toBeNull();
  });
});
