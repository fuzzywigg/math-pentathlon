/**
 * Wave 31 — expression power associativity + mixed-op stress.
 * Distinct from wave22 UI / wave27 edges / storage (#151).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  evaluate,
  tokenize,
  parse,
  evaluateNode,
} from '../../src/core/expressions';

describe('Wave 31 expr-power — associativity table', () => {
  it.each([
    ['2^2^2', 16], // (2^2)^2
    ['2^3^2', 64],
    ['3^2^2', 81],
    ['2^2^3', 64],
  ] as const)('%s → %d (left-assoc)', (src, expected) => {
    expect(evaluate(src)).toEqual({ success: true, value: expected });
  });

  it('parenthesized right-assoc power differs when nesting on the right', () => {
    expect(evaluate('2^(3^2)')).toEqual({ success: true, value: 512 });
    expect(evaluate('(2^3)^2')).toEqual({ success: true, value: 64 });
  });
});

describe('Wave 31 expr-power — mixed with unary and mul', () => {
  it('combines unary, power, and mul predictably', () => {
    // -2^3 → parsePower attaches ^ to unary(-,2) → (-2)^3 = -8
    expect(evaluate('-2^3')).toEqual({ success: true, value: -8 });
    expect(evaluate('(-2)^2')).toEqual({ success: true, value: 4 });
    // 2*-3^2 → 2 * ((-3)^2) = 2 * 9 = 18
    expect(evaluate('2*-3^2')).toEqual({ success: true, value: 18 });
  });
});

describe('Wave 31 expr-power — AST operator placement', () => {
  it('places ^ above * in the tree for a*b^c', () => {
    const ast = parse(tokenize('a*b^c'));
    expect(ast).toMatchObject({
      type: 'binary',
      operator: '*',
      right: { type: 'binary', operator: '^' },
    });
    expect(
      evaluateNode(
        ast,
        new Map([
          ['a', 2],
          ['b', 3],
          ['c', 2],
        ])
      )
    ).toBe(18);
  });
});
