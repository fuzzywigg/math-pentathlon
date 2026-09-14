/**
 * Wave 44 — division-by-zero evaluate error leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { evaluate, evaluateNode } from '../../src/core/expressions';

describe('Wave 44 expr — division by zero', () => {
  it('evaluate returns failure message', () => {
    const r = evaluate('7/0');
    expect(r.success).toBe(false);
    expect(r.error).toMatch(/division by zero/i);
  });

  it('evaluateNode throws for crafted AST', () => {
    expect(() =>
      evaluateNode({
        type: 'binary',
        operator: '/',
        left: { type: 'number', value: 1 },
        right: { type: 'number', value: 0 },
      })
    ).toThrow(/division by zero/i);
  });
});
