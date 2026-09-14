/**
 * Wave 30 — expression tokenize matrix (unicode, decimals, vars, junk).
 * Deepens existing expressions evaluator beyond wave 27 edges + expressions.test.
 * Distinct from hex (#150), attributes (#149), polyomino (#147).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { tokenize, type ExpressionToken } from '../../src/core/expressions';

function types(tokens: ExpressionToken[]): string[] {
  return tokens.map((t) => {
    if (t.type === 'number') return `n:${t.value}`;
    if (t.type === 'operator') return `op:${t.value}`;
    if (t.type === 'variable') return `v:${t.name}`;
    return t.type;
  });
}

describe('Wave 30 expr-tokenize — unicode + compound ops', () => {
  it('maps × ÷ ≤ ≥ and <= >= consistently', () => {
    expect(types(tokenize('8×2÷4'))).toEqual(['n:8', 'op:*', 'n:2', 'op:/', 'n:4']);
    expect(types(tokenize('1≤2≥0'))).toEqual(['n:1', 'op:≤', 'n:2', 'op:≥', 'n:0']);
    expect(types(tokenize('a<=b>=c'))).toEqual([
      'v:a',
      'op:≤',
      'v:b',
      'op:≥',
      'v:c',
    ]);
  });

  it('keeps single < > = distinct from ≤ ≥', () => {
    expect(types(tokenize('1<2>0=3'))).toEqual([
      'n:1',
      'op:<',
      'n:2',
      'op:>',
      'n:0',
      'op:=',
      'n:3',
    ]);
  });
});

describe('Wave 30 expr-tokenize — decimals whitespace junk', () => {
  const cases: Array<[string, string[]]> = [
    ['.5+1.25', ['n:0.5', 'op:+', 'n:1.25']],
    ['  10  *  3  ', ['n:10', 'op:*', 'n:3']],
    ['(2)', ['lparen', 'n:2', 'rparen']],
    ['2^3', ['n:2', 'op:^', 'n:3']],
    ['foo_1+bar2', ['v:foo_1', 'op:+', 'v:bar2']],
  ];

  it('tokenizes decimals, spaces, parens, power, underscored vars', () => {
    for (const [src, expected] of cases) {
      expect(types(tokenize(src))).toEqual(expected);
    }
  });

  it('skips unknown punctuation without aborting the stream', () => {
    expect(types(tokenize('2#+$3'))).toEqual(['n:2', 'op:+', 'n:3']);
    expect(types(tokenize('!@?(4)'))).toEqual(['lparen', 'n:4', 'rparen']);
    expect(tokenize('$$$')).toEqual([]);
  });
});

describe('Wave 30 expr-tokenize — dense digit/op grid', () => {
  it('separates adjacent number-operator-number triples', () => {
    const ops = ['+', '-', '*', '/', '^'] as const;
    for (const op of ops) {
      const tokens = tokenize(`12${op}34`);
      expect(tokens).toEqual([
        { type: 'number', value: 12 },
        { type: 'operator', value: op },
        { type: 'number', value: 34 },
      ]);
    }
  });
});
