/**
 * Wave 44 — parse trailing unexpected token leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { parse, tokenize, evaluate } from '../../src/core/expressions';

describe('Wave 44 expr — parse trailing junk', () => {
  it('parse throws on leftover tokens after expression', () => {
    expect(() => parse(tokenize('1+2 3'))).toThrow(/unexpected token/i);
  });

  it('evaluate surfaces parse error as failure', () => {
    const r = evaluate('1+2 3');
    expect(r.success).toBe(false);
    expect(r.error).toBeTruthy();
  });
});
