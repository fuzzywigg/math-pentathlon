/**
 * Wave 31 — expression tokenize matrix (numbers / ops / whitespace).
 * Deepens beyond expressions.test.ts + wave27 edges. Distinct from storage (#151),
 * hex (#150), attributes (#149), polyomino (#147), wave22 expression-ui.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { tokenize } from '../../src/core/expressions';

describe('Wave 31 expr-tokenize — number shapes', () => {
  it.each([
    ['0', [{ type: 'number', value: 0 }]],
    ['42', [{ type: 'number', value: 42 }]],
    ['3.14', [{ type: 'number', value: 3.14 }]],
    ['.5', [{ type: 'number', value: 0.5 }]],
    ['10.0', [{ type: 'number', value: 10 }]],
  ] as const)('tokenizes %j', (input, expected) => {
    expect(tokenize(input)).toEqual([...expected]);
  });

  it('tokenizes multi-number streams without separators as one number when contiguous', () => {
    expect(tokenize('123')).toEqual([{ type: 'number', value: 123 }]);
  });
});

describe('Wave 31 expr-tokenize — operator alphabet', () => {
  it.each(['+', '-', '*', '/', '^', '=', '<', '>'] as const)(
    'emits operator %s',
    (op) => {
      expect(tokenize(`1${op}2`)).toEqual([
        { type: 'number', value: 1 },
        { type: 'operator', value: op },
        { type: 'number', value: 2 },
      ]);
    }
  );

  it('maps unicode × ÷ ≤ ≥ and compound <= >=', () => {
    expect(tokenize('1×2÷3')).toEqual([
      { type: 'number', value: 1 },
      { type: 'operator', value: '*' },
      { type: 'number', value: 2 },
      { type: 'operator', value: '/' },
      { type: 'number', value: 3 },
    ]);
    expect(tokenize('a≤b≥c')).toEqual([
      { type: 'variable', name: 'a' },
      { type: 'operator', value: '≤' },
      { type: 'variable', name: 'b' },
      { type: 'operator', value: '≥' },
      { type: 'variable', name: 'c' },
    ]);
    expect(tokenize('1<=2>=3')).toEqual([
      { type: 'number', value: 1 },
      { type: 'operator', value: '≤' },
      { type: 'number', value: 2 },
      { type: 'operator', value: '≥' },
      { type: 'number', value: 3 },
    ]);
  });
});

describe('Wave 31 expr-tokenize — whitespace + skip unknowns', () => {
  it('ignores arbitrary whitespace between tokens', () => {
    expect(tokenize('  1   + \t 2 \n * 3  ')).toEqual([
      { type: 'number', value: 1 },
      { type: 'operator', value: '+' },
      { type: 'number', value: 2 },
      { type: 'operator', value: '*' },
      { type: 'number', value: 3 },
    ]);
  });

  it('skips unknown punctuation while keeping known tokens', () => {
    expect(tokenize('1@+2#')).toEqual([
      { type: 'number', value: 1 },
      { type: 'operator', value: '+' },
      { type: 'number', value: 2 },
    ]);
  });

  it('returns empty array for blank / symbols-only input', () => {
    expect(tokenize('')).toEqual([]);
    expect(tokenize('   ')).toEqual([]);
    expect(tokenize('@@@')).toEqual([]);
  });
});
