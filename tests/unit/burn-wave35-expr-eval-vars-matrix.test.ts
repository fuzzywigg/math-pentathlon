/**
 * Wave 35 — variable map evaluate matrix leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { evaluate } from '../../src/core/expressions';

describe('Wave 35 expr-vars — multi-var formulas', () => {
  it('evaluates linear combinations', () => {
    const vars = new Map([
      ['x', 2],
      ['y', 5],
      ['z', 10],
    ]);
    expect(evaluate('x*y+z', vars)).toEqual({ success: true, value: 20 });
    expect(evaluate('(x+y)*z', vars)).toEqual({ success: true, value: 70 });
    expect(evaluate('z/x - y', vars)).toEqual({ success: true, value: 0 });
  });

  it('underscore names tokenize as variables', () => {
    const vars = new Map([['n_1', 7]]);
    expect(evaluate('n_1*3', vars)).toEqual({ success: true, value: 21 });
  });

  it('missing var fails; empty map same', () => {
    expect(evaluate('a+1').success).toBe(false);
    expect(evaluate('a+1', new Map()).error).toMatch(/Undefined variable/i);
  });
});
