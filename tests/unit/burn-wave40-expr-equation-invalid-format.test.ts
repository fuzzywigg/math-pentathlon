/**
 * Wave 40 — evaluateEquation invalid format leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { evaluateEquation, parseEquation } from '../../src/core/expressions';

describe('Wave 40 expr — equation invalid format', () => {
  it('missing equals → invalid format', () => {
    const r = evaluateEquation('1+2');
    expect(r.isTrue).toBe(false);
    expect(Number.isNaN(r.leftValue)).toBe(true);
    expect(r.error).toMatch(/Invalid equation format/i);
  });

  it('triple equals parse null; valid equation true', () => {
    expect(parseEquation('1=2=3')).toBeNull();
    const ok = evaluateEquation('2+2=4');
    expect(ok.isTrue).toBe(true);
    expect(ok.leftValue).toBe(4);
  });
});
