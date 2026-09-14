/**
 * Wave 44 — leading-dot decimal tokenize/evaluate leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { tokenize, evaluate } from '../../src/core/expressions';

describe('Wave 44 expr — leading-dot decimals', () => {
  it('tokenizes .5 as number 0.5', () => {
    const toks = tokenize('.5+.25');
    expect(toks[0]).toEqual({ type: 'number', value: 0.5 });
    expect(toks[2]).toEqual({ type: 'number', value: 0.25 });
  });

  it('evaluates .5 * 4 to 2', () => {
    const r = evaluate('.5*4');
    expect(r.success).toBe(true);
    expect(r.value).toBe(2);
  });
});
