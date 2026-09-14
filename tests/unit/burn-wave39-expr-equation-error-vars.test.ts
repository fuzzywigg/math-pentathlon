/**
 * Wave 39 — expression equation parse/check/evaluate error leftovers.
 * After waves 30/35; deepen null / NaN / undefined-var paths. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  parseEquation,
  checkEquation,
  evaluateEquation,
} from '../../src/core/expressions';

describe('Wave 39 expr — equation format rejects', () => {
  it('parseEquation null for wrong arity / tokenize failures', () => {
    expect(parseEquation('2+2')).toBeNull();
    expect(parseEquation('a=b=c')).toBeNull();
    expect(parseEquation('')).toBeNull();
    expect(parseEquation('2+*=4')).toBeNull();
  });

  it('evaluateEquation surfaces invalid format as NaN + error', () => {
    const bad = evaluateEquation('not-an-equation');
    expect(bad.isTrue).toBe(false);
    expect(Number.isNaN(bad.leftValue)).toBe(true);
    expect(Number.isNaN(bad.rightValue)).toBe(true);
    expect(bad.error).toMatch(/invalid equation format/i);
  });
});

describe('Wave 39 expr — checkEquation variable / div0 leftovers', () => {
  it('undefined variable yields error + NaN sides', () => {
    const eq = parseEquation('x+1=3');
    expect(eq).not.toBeNull();
    const result = checkEquation(eq!);
    expect(result.isTrue).toBe(false);
    expect(result.error).toMatch(/undefined variable/i);
    expect(Number.isNaN(result.leftValue)).toBe(true);
  });

  it('division by zero is caught as error', () => {
    const eq = parseEquation('1/0=1');
    expect(eq).not.toBeNull();
    const result = checkEquation(eq!);
    expect(result.isTrue).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('variable map makes false and true equations', () => {
    const vars = new Map([
      ['n', 10],
      ['m', 2],
    ]);
    expect(evaluateEquation('n/m=5', vars).isTrue).toBe(true);
    expect(evaluateEquation('n-m=7', vars).isTrue).toBe(false);
  });
});
