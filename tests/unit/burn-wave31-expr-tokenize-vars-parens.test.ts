/**
 * Wave 31 — expression tokenize variables + parentheses edges.
 * Distinct from wave22 UI / wave27 light solver / storage (#151).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { tokenize } from '../../src/core/expressions';

describe('Wave 31 expr-tokenize — variable names', () => {
  it.each([
    ['x', 'x'],
    ['y1', 'y1'],
    ['foo_bar', 'foo_bar'],
    ['A9_b', 'A9_b'],
    ['totalScore', 'totalScore'],
  ] as const)('tokenizes identifier %s', (input, name) => {
    expect(tokenize(input)).toEqual([{ type: 'variable', name }]);
  });

  it('separates adjacent var/number with operators', () => {
    expect(tokenize('x+2*y_1')).toEqual([
      { type: 'variable', name: 'x' },
      { type: 'operator', value: '+' },
      { type: 'number', value: 2 },
      { type: 'operator', value: '*' },
      { type: 'variable', name: 'y_1' },
    ]);
  });

  it('does not glue a trailing letter onto a number (number then var)', () => {
    // tokenizer reads digits then letters as separate tokens when split by nothing?
    // "2x" → number 2 then variable x
    expect(tokenize('2x')).toEqual([
      { type: 'number', value: 2 },
      { type: 'variable', name: 'x' },
    ]);
  });
});

describe('Wave 31 expr-tokenize — parentheses nesting', () => {
  it('emits balanced paren tokens around expressions', () => {
    expect(tokenize('(1+(2*3))')).toEqual([
      { type: 'lparen' },
      { type: 'number', value: 1 },
      { type: 'operator', value: '+' },
      { type: 'lparen' },
      { type: 'number', value: 2 },
      { type: 'operator', value: '*' },
      { type: 'number', value: 3 },
      { type: 'rparen' },
      { type: 'rparen' },
    ]);
  });

  it('preserves empty paren pairs as tokens', () => {
    expect(tokenize('()')).toEqual([{ type: 'lparen' }, { type: 'rparen' }]);
  });

  it('tokenizes deeply nested opens then closes', () => {
    const tokens = tokenize('((((1))))');
    expect(tokens.filter((t) => t.type === 'lparen')).toHaveLength(4);
    expect(tokens.filter((t) => t.type === 'rparen')).toHaveLength(4);
    expect(tokens.find((t) => t.type === 'number')).toEqual({
      type: 'number',
      value: 1,
    });
  });
});
