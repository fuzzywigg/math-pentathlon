/**
 * Wave 44 — power operator left-associativity leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { evaluate } from '../../src/core/expressions';

describe('Wave 44 expr — power left-assoc', () => {
  it('2^3^2 is (2^3)^2 = 64 not 512', () => {
    const r = evaluate('2^3^2');
    expect(r.success).toBe(true);
    expect(r.value).toBe(64);
  });

  it('parens restore right-assoc 2^(3^2)=512', () => {
    const r = evaluate('2^(3^2)');
    expect(r.success).toBe(true);
    expect(r.value).toBe(512);
  });
});
