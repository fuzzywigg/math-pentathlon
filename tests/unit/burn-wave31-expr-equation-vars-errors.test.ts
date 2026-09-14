/**
 * Wave 31 — expression equations with variables + error paths.
 * Distinct from wave22 UI / wave27 equation smoke / storage (#151).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  parseEquation,
  checkEquation,
  evaluateEquation,
} from '../../src/core/expressions';

describe('Wave 31 expr-equation — variables', () => {
  it('solves true/false depending on map values', () => {
    const eq = parseEquation('x*2+1=7');
    expect(eq).not.toBeNull();
    expect(checkEquation(eq!, new Map([['x', 3]])).isTrue).toBe(true);
    expect(checkEquation(eq!, new Map([['x', 2]])).isTrue).toBe(false);
  });

  it('supports variables on both sides', () => {
    const vars = new Map([
      ['a', 4],
      ['b', 2],
    ]);
    expect(evaluateEquation('a+b=a*b', vars).isTrue).toBe(false); // 6 vs 8
    expect(evaluateEquation('a/b=b', vars).isTrue).toBe(true); // 2=2
  });

  it('missing variable yields error + NaN sides', () => {
    const result = evaluateEquation('y+1=2');
    expect(result.isTrue).toBe(false);
    expect(result.error).toMatch(/undefined variable/i);
    expect(Number.isNaN(result.leftValue)).toBe(true);
    expect(Number.isNaN(result.rightValue)).toBe(true);
  });
});

describe('Wave 31 expr-equation — invalid format', () => {
  it('evaluateEquation reports Invalid equation format', () => {
    const result = evaluateEquation('not-an-equation');
    expect(result.isTrue).toBe(false);
    expect(result.error).toMatch(/invalid equation format/i);
    expect(Number.isNaN(result.leftValue)).toBe(true);
  });

  it('division by zero on a side surfaces as error', () => {
    const result = evaluateEquation('1/0=1');
    expect(result.isTrue).toBe(false);
    expect(result.error).toMatch(/division by zero/i);
  });
});
