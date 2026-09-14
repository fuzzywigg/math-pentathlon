/**
 * Wave 27 — fractions performOperation / parseFraction / formatMixedNumber.
 * First coverage of stepped ops + string parse (absent from fractions.test.ts).
 * Distinct from wave 25 contiguous/a11y and wave 26 success-playthroughs.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  fromWhole,
  performOperation,
  parseFraction,
  formatMixedNumber,
  formatFraction,
  areEqual,
  simplify,
  getFactors,
  findEquivalentFractions,
  sum,
  average,
  min,
  max,
  divide,
} from '../../src/core/fractions/arithmetic';

describe('Wave 27 fractions — performOperation steps', () => {
  it('add with unlike denominators records LCD steps and simplifies', () => {
    const out = performOperation(
      createFraction(1, 2),
      createFraction(1, 3),
      'add'
    );
    expect(areEqual(out.simplified, createFraction(5, 6))).toBe(true);
    expect(out.decimal).toBeCloseTo(5 / 6, 5);
    expect(out.steps.some((s) => /common denominator/i.test(s))).toBe(true);
    expect(out.steps.join(' ')).toMatch(/1\/2/);
    expect(out.steps.join(' ')).toMatch(/1\/3/);
  });

  it('add same denominator skips LCD step; add() already simplifies', () => {
    const out = performOperation(
      createFraction(1, 4),
      createFraction(1, 4),
      'add'
    );
    expect(areEqual(out.simplified, createFraction(1, 2))).toBe(true);
    expect(out.steps.some((s) => /common denominator/i.test(s))).toBe(false);
    expect(areEqual(out.result, out.simplified)).toBe(true);
    expect(out.steps.at(-1)).toMatch(/1\/2|=/);
  });

  it('subtract / multiply / divide produce correct simplified results', () => {
    const sub = performOperation(
      createFraction(3, 4),
      createFraction(1, 2),
      'subtract'
    );
    expect(areEqual(sub.simplified, createFraction(1, 4))).toBe(true);
    expect(sub.steps[0]).toMatch(/-/);

    const mul = performOperation(
      createFraction(2, 3),
      createFraction(3, 4),
      'multiply'
    );
    expect(areEqual(mul.simplified, createFraction(1, 2))).toBe(true);
    expect(mul.steps.some((s) => s.includes('×'))).toBe(true);

    const div = performOperation(
      createFraction(1, 2),
      createFraction(1, 4),
      'divide'
    );
    expect(areEqual(div.simplified, fromWhole(2))).toBe(true);
    expect(div.steps.some((s) => s.includes('÷') || s.includes('×'))).toBe(
      true
    );
  });

  it('result vs simplified stay equal when arithmetic pre-simplifies', () => {
    const out = performOperation(
      createFraction(1, 6),
      createFraction(1, 3),
      'add'
    );
    expect(areEqual(out.result, out.simplified)).toBe(true);
    expect(simplify(out.result).denominator).toBe(out.simplified.denominator);
  });
});

describe('Wave 27 fractions — parseFraction + formatMixedNumber', () => {
  it('parses proper, improper, mixed, and whole forms', () => {
    expect(parseFraction('3/4')).toEqual(
      expect.objectContaining({ numerator: 3, denominator: 4 })
    );
    expect(parseFraction('1 1/2')).toEqual(
      expect.objectContaining({ numerator: 3, denominator: 2 })
    );
    expect(parseFraction('-2 1/4')).toEqual(
      expect.objectContaining({ numerator: -9, denominator: 4 })
    );
    expect(parseFraction('5')).toEqual(
      expect.objectContaining({ numerator: 5, denominator: 1 })
    );
    expect(parseFraction('-7')).toEqual(
      expect.objectContaining({ numerator: -7, denominator: 1 })
    );
  });

  it('returns null for junk / zero denom / empty', () => {
    expect(parseFraction('')).toBeNull();
    expect(parseFraction('abc')).toBeNull();
    expect(parseFraction('1/0')).toBeNull();
    expect(parseFraction('1 2/0')).toBeNull();
    expect(parseFraction('1/2/3')).toBeNull();
  });

  it('formatMixedNumber covers proper, whole, and improper', () => {
    expect(formatMixedNumber(createFraction(1, 2))).toBe(
      formatFraction(createFraction(1, 2))
    );
    expect(formatMixedNumber(fromWhole(3))).toBe('3');
    expect(formatMixedNumber(createFraction(5, 2))).toMatch(/2/);
    expect(formatMixedNumber(createFraction(5, 2))).toMatch(/1\/2/);
  });

  it('round-trips mixed parse through formatMixedNumber for positives', () => {
    const parsed = parseFraction('2 3/5');
    expect(parsed).not.toBeNull();
    expect(formatMixedNumber(parsed!)).toBe('2 3/5');
  });
});

describe('Wave 27 fractions — aggregate / factors / equivalents edges', () => {
  it('sum / average / min / max across lists', () => {
    const list = [
      createFraction(1, 2),
      createFraction(1, 4),
      createFraction(3, 4),
    ];
    expect(areEqual(sum(list), createFraction(3, 2))).toBe(true);
    expect(areEqual(average(list), createFraction(1, 2))).toBe(true);
    expect(areEqual(min(...list), createFraction(1, 4))).toBe(true);
    expect(areEqual(max(...list), createFraction(3, 4))).toBe(true);
    expect(areEqual(sum([]), fromWhole(0))).toBe(true);
    expect(() => average([])).toThrow(/empty/i);
  });

  it('getFactors and findEquivalentFractions bound correctly', () => {
    expect(getFactors(12).sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 6, 12]);
    expect(getFactors(1)).toEqual([1]);
    const eq = findEquivalentFractions(createFraction(1, 3), 12);
    expect(eq.some((f) => f.numerator === 2 && f.denominator === 6)).toBe(true);
    expect(eq.every((f) => f.denominator <= 12)).toBe(true);
  });

  it('divide by zero throws through performOperation path via divide', () => {
    expect(() => divide(createFraction(1, 2), createFraction(0, 1))).toThrow(
      /zero/i
    );
  });
});
