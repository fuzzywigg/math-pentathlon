/**
 * Wave 39 — parseEquation / evaluateEquation equals-count leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  parseEquation,
  evaluateEquation,
  checkEquation,
} from '../../src/core/expressions';

describe('Wave 39 expr — equation equals count', () => {
  it('zero or multi equals → null / Invalid equation format', () => {
    expect(parseEquation('1+2')).toBeNull();
    expect(parseEquation('a=b=c')).toBeNull();
    expect(evaluateEquation('1+2').error).toBe('Invalid equation format');
    expect(evaluateEquation('1=2=3').error).toBe('Invalid equation format');
  });

  it('true/false equations with variables', () => {
    const eq = parseEquation('x + 1 = 4');
    expect(eq).not.toBeNull();
    expect(checkEquation(eq!, new Map([['x', 3]])).isTrue).toBe(true);
    expect(checkEquation(eq!, new Map([['x', 1]])).isTrue).toBe(false);
    expect(evaluateEquation('2+2=4').isTrue).toBe(true);
    expect(evaluateEquation('2+2=5').isTrue).toBe(false);
  });
});
