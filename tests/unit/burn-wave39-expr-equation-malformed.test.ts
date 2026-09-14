/**
 * Wave 39 — parseEquation / evaluateEquation malformed leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  parseEquation,
  evaluateEquation,
  checkEquation,
} from '../../src/core/expressions';

describe('Wave 39 expr — equation malformed', () => {
  it('rejects missing / multi equals', () => {
    expect(parseEquation('2+2')).toBeNull();
    expect(parseEquation('1=2=3')).toBeNull();
    expect(parseEquation('')).toBeNull();
  });

  it('evaluateEquation surfaces invalid format error', () => {
    const bad = evaluateEquation('not-an-equation');
    expect(bad.isTrue).toBe(false);
    expect(bad.error).toMatch(/invalid equation/i);
  });

  it('true and false equations with whitespace', () => {
    expect(evaluateEquation(' 2 + 2 = 4 ').isTrue).toBe(true);
    expect(evaluateEquation('2+2=5').isTrue).toBe(false);
    const parsed = parseEquation('3*3=9');
    expect(parsed).not.toBeNull();
    expect(checkEquation(parsed!).isTrue).toBe(true);
  });
});
