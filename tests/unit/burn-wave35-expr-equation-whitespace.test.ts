/**
 * Wave 35 — equation parse whitespace / variable error leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  parseEquation,
  evaluateEquation,
  checkEquation,
} from '../../src/core/expressions';

describe('Wave 35 expr-equation-ws — trimming', () => {
  it('trims both sides around =', () => {
    const eq = parseEquation('  2+2  =  4  ');
    expect(eq).not.toBeNull();
    expect(checkEquation(eq!).isTrue).toBe(true);
    expect(evaluateEquation('  3*3 = 9 ').isTrue).toBe(true);
  });

  it('rejects empty sides after split', () => {
    expect(parseEquation('=4')).toBeNull();
    expect(parseEquation('4=')).toBeNull();
  });
});

describe('Wave 35 expr-equation-ws — undefined vars', () => {
  it('checkEquation surfaces undefined variable errors', () => {
    const eq = parseEquation('x+1=2');
    const result = checkEquation(eq!);
    expect(result.isTrue).toBe(false);
    expect(result.error).toMatch(/Undefined variable/i);
    expect(Number.isNaN(result.leftValue)).toBe(true);
  });

  it('evaluateEquation with map solves', () => {
    const vars = new Map([
      ['a', 3],
      ['b', 4],
    ]);
    expect(evaluateEquation('a*a+b=13', vars).isTrue).toBe(true);
  });
});
