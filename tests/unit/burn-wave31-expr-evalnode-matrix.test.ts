/**
 * Wave 31 — evaluateNode direct AST matrix (bypass string evaluate).
 * Distinct from wave22 UI / wave27 edges / storage (#151).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { evaluateNode, parse, tokenize } from '../../src/core/expressions';
import type { ExpressionNode } from '../../src/core/expressions';

describe('Wave 31 expr-evalnode — literal / variable / unary', () => {
  it('returns number nodes directly', () => {
    expect(evaluateNode({ type: 'number', value: 42 })).toBe(42);
  });

  it('resolves variables from the map', () => {
    const node: ExpressionNode = { type: 'variable', name: 'n' };
    expect(evaluateNode(node, new Map([['n', 11]]))).toBe(11);
    expect(() => evaluateNode(node)).toThrow(/undefined variable: n/i);
  });

  it('negates recursively', () => {
    const node: ExpressionNode = {
      type: 'unary',
      operator: '-',
      operand: {
        type: 'unary',
        operator: '-',
        operand: { type: 'number', value: 4 },
      },
    };
    expect(evaluateNode(node)).toBe(4);
  });
});

describe('Wave 31 expr-evalnode — binary ops', () => {
  it.each([
    ['+', 3, 4, 7],
    ['-', 10, 3, 7],
    ['*', 6, 7, 42],
    ['/', 15, 3, 5],
    ['^', 2, 8, 256],
  ] as const)('%s on %d,%d → %d', (op, left, right, expected) => {
    const node: ExpressionNode = {
      type: 'binary',
      operator: op,
      left: { type: 'number', value: left },
      right: { type: 'number', value: right },
    };
    expect(evaluateNode(node)).toBe(expected);
  });

  it('throws on division by zero', () => {
    const node: ExpressionNode = {
      type: 'binary',
      operator: '/',
      left: { type: 'number', value: 1 },
      right: { type: 'number', value: 0 },
    };
    expect(() => evaluateNode(node)).toThrow(/division by zero/i);
  });
});

describe('Wave 31 expr-evalnode — parsed trees', () => {
  it('matches string-derived ASTs for mixed ops', () => {
    const cases = ['1+2*3-4', '(1+2)*(3-4)', '2^3^2', '-((1+2)*3)'];
    for (const src of cases) {
      const value = evaluateNode(parse(tokenize(src)));
      expect(typeof value).toBe('number');
      expect(Number.isFinite(value)).toBe(true);
    }
    expect(evaluateNode(parse(tokenize('2^3^2')))).toBe(64);
    expect(evaluateNode(parse(tokenize('-((1+2)*3)')))).toBe(-9);
  });
});
