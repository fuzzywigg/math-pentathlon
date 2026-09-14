/**
 * Wave 44 — unknown char skip leftover in tokenizer. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { tokenize, evaluate } from '../../src/core/expressions';

describe('Wave 44 expr — skip unknown chars', () => {
  it('skips @ # $ and still evaluates', () => {
    expect(tokenize('2@+#3').filter((t) => t.type !== 'operator' || true).length).toBeGreaterThan(0);
    const r = evaluate('2@+#$3');
    expect(r.success).toBe(true);
    expect(r.value).toBe(5);
  });

  it('pure junk yields empty expression error', () => {
    const r = evaluate('@@@');
    expect(r.success).toBe(false);
    expect(r.error).toMatch(/empty/i);
  });
});
