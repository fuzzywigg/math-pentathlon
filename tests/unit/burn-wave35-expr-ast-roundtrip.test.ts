/**
 * Wave 35 — astToString → evaluate round-trip leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  tokenize,
  parse,
  evaluate,
  evaluateNode,
  astToString,
  formatNumber,
  simplifyExpression,
} from '../../src/core/expressions';

describe('Wave 35 expr-ast-roundtrip — evaluateNode equals string eval', () => {
  const samples = [
    '1+2*3',
    '(1+2)*3',
    '2^3+1',
    '-5+10',
    '8/2/2',
    '100-7*3',
  ];

  it.each(samples)('round-trips %s', (expr) => {
    const ast = parse(tokenize(expr));
    const viaAst = evaluateNode(ast);
    const viaStr = evaluate(expr);
    expect(viaStr).toEqual({ success: true, value: viaAst });
    const printed = astToString(ast);
    expect(evaluate(printed)).toEqual({ success: true, value: viaAst });
  });
});

describe('Wave 35 expr-ast-roundtrip — simplify / format', () => {
  it('simplifyExpression collapses successful evals', () => {
    expect(simplifyExpression('(2+3)*4')).toBe('20');
    expect(simplifyExpression('1/2')).toBe(formatNumber(0.5));
  });

  it('simplifyExpression passthrough on failure', () => {
    expect(simplifyExpression('1+')).toBe('1+');
    expect(simplifyExpression('')).toBe('');
  });
});
