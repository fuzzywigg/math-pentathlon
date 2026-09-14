/**
 * Wave 40 — checkEquation undefined var catch leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { parseEquation, checkEquation } from '../../src/core/expressions';

describe('Wave 40 expr — checkEquation undefined var', () => {
  it('missing variable yields NaN + error', () => {
    const eq = parseEquation('x+1=3')!;
    const r = checkEquation(eq); // no variable map
    expect(r.isTrue).toBe(false);
    expect(Number.isNaN(r.leftValue)).toBe(true);
    expect(r.error).toMatch(/Undefined variable/i);
  });

  it('provided variable can make equation true', () => {
    const eq = parseEquation('x+1=3')!;
    const r = checkEquation(eq, new Map([['x', 2]]));
    expect(r.isTrue).toBe(true);
    expect(r.leftValue).toBe(3);
  });
});
