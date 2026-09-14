/**
 * Wave 35 — decimal / leading-dot tokenization leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { tokenize, evaluate } from '../../src/core/expressions';

describe('Wave 35 expr-decimal — leading and trailing dots', () => {
  it('parses leading-dot decimals', () => {
    expect(tokenize('.5')).toEqual([{ type: 'number', value: 0.5 }]);
    expect(evaluate('.5+.5')).toEqual({ success: true, value: 1 });
  });

  it('parses standard decimals', () => {
    expect(evaluate('1.25*4')).toEqual({ success: true, value: 5 });
    expect(evaluate('0.1+0.2')).toEqual({
      success: true,
      value: 0.1 + 0.2,
    });
  });

  it('multi-dot strings become a single number token via parseFloat', () => {
    // tokenizer greedily consumes [0-9.]+ then parseFloat stops at second dot
    const tokens = tokenize('1.2.3');
    expect(tokens).toHaveLength(1);
    expect(tokens[0]).toEqual({ type: 'number', value: 1.2 });
  });
});

describe('Wave 35 expr-decimal — lone dot skipped-ish', () => {
  it('dot not followed by digit is skipped as unknown', () => {
    // '.' alone: not number start (needs digit after), not operator → skip
    expect(tokenize('.')).toEqual([]);
    expect(evaluate('.')).toEqual({ success: false, error: 'Empty expression' });
  });
});
