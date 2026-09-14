/**
 * Wave 38 — evaluateNode unknown op / missing vars / unary nest.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { evaluateNode } from '../../src/core/expressions';
import type { ExpressionNode } from '../../src/core/expressions';

describe('Wave 38 expr-evalnode — unknown / missing', () => {
  it('forged unknown binary operator throws', () => {
    const node = {
      type: 'binary',
      operator: '%' as never,
      left: { type: 'number', value: 4 },
      right: { type: 'number', value: 2 },
    } as ExpressionNode;
    expect(() => evaluateNode(node)).toThrow(/Unknown operator/);
  });

  it('missing variable throws Undefined variable', () => {
    const node: ExpressionNode = { type: 'variable', name: 'x' };
    expect(() => evaluateNode(node)).toThrow(/Undefined variable: x/);
    expect(evaluateNode(node, new Map([['x', 7]]))).toBe(7);
  });

  it('nested unary negates correctly', () => {
    const node: ExpressionNode = {
      type: 'unary',
      operator: '-',
      operand: {
        type: 'unary',
        operator: '-',
        operand: { type: 'number', value: 5 },
      },
    };
    expect(evaluateNode(node)).toBe(5);
  });

  it('division by zero in node tree throws', () => {
    const node: ExpressionNode = {
      type: 'binary',
      operator: '/',
      left: { type: 'number', value: 1 },
      right: { type: 'number', value: 0 },
    };
    expect(() => evaluateNode(node)).toThrow(/Division by zero/);
  });
});
