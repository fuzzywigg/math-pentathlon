/**
 * Wave 44 — unicode ×÷≤≥ tokenize leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { tokenize } from '../../src/core/expressions';

describe('Wave 44 expr — unicode operator tokenize', () => {
  it('maps × and ÷ to * and /', () => {
    const toks = tokenize('6 × 3 ÷ 2');
    expect(toks.filter((t) => t.type === 'operator').map((t) => (t as { value: string }).value)).toEqual(['*', '/',]);
  });

  it('collapses <= and >= into ≤ and ≥', () => {
    const toks = tokenize('a<=b>=c');
    const ops = toks.filter((t) => t.type === 'operator').map((t) => (t as { value: string }).value);
    expect(ops).toEqual(['≤', '≥']);
  });

  it('accepts raw unicode ≤ ≥ characters', () => {
    const toks = tokenize('1≤2≥0');
    const ops = toks.filter((t) => t.type === 'operator').map((t) => (t as { value: string }).value);
    expect(ops).toEqual(['≤', '≥']);
  });
});
