/**
 * Wave 35 — tokenize skips unknown characters / keeps unicode ops.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { tokenize, evaluate } from '../../src/core/expressions';

describe('Wave 35 expr-tokenize — unknown char skip', () => {
  it('strips punctuation noise between valid tokens', () => {
    const tokens = tokenize('2 + @ 3');
    expect(tokens).toEqual([
      { type: 'number', value: 2 },
      { type: 'operator', value: '+' },
      { type: 'number', value: 3 },
    ]);
    expect(evaluate('2 + @ 3')).toEqual({ success: true, value: 5 });
  });

  it('skips emoji / currency without aborting', () => {
    expect(evaluate('1$+2')).toEqual({ success: true, value: 3 });
    expect(tokenize('1😀2').filter((t) => t.type === 'number')).toEqual([
      { type: 'number', value: 1 },
      { type: 'number', value: 2 },
    ]);
  });
});

describe('Wave 35 expr-tokenize — unicode operators', () => {
  it('maps × and ÷ to * and /', () => {
    expect(tokenize('6 × 3')).toEqual([
      { type: 'number', value: 6 },
      { type: 'operator', value: '*' },
      { type: 'number', value: 3 },
    ]);
    expect(tokenize('8 ÷ 2')).toEqual([
      { type: 'number', value: 8 },
      { type: 'operator', value: '/' },
      { type: 'number', value: 2 },
    ]);
    expect(evaluate('6 × 3')).toEqual({ success: true, value: 18 });
    expect(evaluate('8 ÷ 2')).toEqual({ success: true, value: 4 });
  });

  it('tokenizes ≤ ≥ as operators (not evaluable as arithmetic)', () => {
    const tokens = tokenize('1≤2≥3');
    expect(tokens.map((t) => (t.type === 'operator' ? t.value : t))).toEqual([
      { type: 'number', value: 1 },
      '≤',
      { type: 'number', value: 2 },
      '≥',
      { type: 'number', value: 3 },
    ]);
  });
});
