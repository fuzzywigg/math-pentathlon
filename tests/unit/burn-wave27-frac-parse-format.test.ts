/**
 * Wave 27 — fraction parse / format / mixed-number display.
 * Distinct from wave 21 fraction-bar-ui and wave 26 areEquivalent helper use.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  fromWhole,
  fromMixedNumber,
  toMixedNumber,
  simplify,
  parseFraction,
  formatFraction,
  formatMixedNumber,
  areEqual,
  COMMON_FRACTIONS,
} from '../../src/core/fractions';

describe('Wave 27 frac-parse-format — parseFraction matrix', () => {
  it('parses simple positive and negative fractions', () => {
    expect(parseFraction('3/4')).toEqual({ numerator: 3, denominator: 4 });
    expect(parseFraction('-3/4')).toEqual({ numerator: -3, denominator: 4 });
    expect(parseFraction('  5/8  ')).toEqual({ numerator: 5, denominator: 8 });
    expect(parseFraction('12/1')).toEqual({ numerator: 12, denominator: 1 });
  });

  it('parses mixed numbers including negative wholes', () => {
    expect(parseFraction('1 1/2')).toEqual(fromMixedNumber(1, 1, 2));
    expect(parseFraction('-2 3/4')).toEqual(fromMixedNumber(-2, 3, 4));
    expect(parseFraction('10 1/10')).toEqual(fromMixedNumber(10, 1, 10));
    expect(areEqual(parseFraction('0 1/2')!, createFraction(1, 2))).toBe(true);
  });

  it('parses whole numbers and rejects zero denominators / junk', () => {
    expect(parseFraction('7')).toEqual(fromWhole(7));
    expect(parseFraction('-42')).toEqual(fromWhole(-42));
    expect(parseFraction('0')).toEqual(fromWhole(0));
    expect(parseFraction('1/0')).toBeNull();
    expect(parseFraction('2 1/0')).toBeNull();
    expect(parseFraction('')).toBeNull();
    expect(parseFraction('abc')).toBeNull();
    expect(parseFraction('1.5')).toBeNull();
    expect(parseFraction('1/2/3')).toBeNull();
    expect(parseFraction('1/2 3')).toBeNull();
    expect(parseFraction('--1')).toBeNull();
    // multiple spaces between mixed parts still match \s+
    expect(parseFraction('1  1/2')).toEqual(fromMixedNumber(1, 1, 2));
  });

  it('round-trips COMMON_FRACTIONS through format then parse', () => {
    for (const f of COMMON_FRACTIONS) {
      const s = formatFraction(f);
      const parsed = parseFraction(s);
      expect(parsed).not.toBeNull();
      expect(areEqual(parsed!, f)).toBe(true);
    }
  });
});

describe('Wave 27 frac-parse-format — formatFraction options', () => {
  it('formats basic, whole denom-1, and negative prefixes', () => {
    expect(formatFraction(createFraction(3, 4))).toBe('3/4');
    expect(formatFraction(createFraction(5, 1))).toBe('5');
    expect(formatFraction(createFraction(-3, 4))).toBe('-3/4');
    expect(formatFraction({ numerator: 3, denominator: 4, isNegative: true })).toBe(
      '-3/4'
    );
    expect(formatFraction(fromWhole(0))).toBe('0');
  });

  it('simplify option reduces before display', () => {
    expect(formatFraction(createFraction(6, 8), { simplify: true })).toBe('3/4');
    expect(formatFraction(createFraction(-10, 15), { simplify: true })).toBe(
      '-2/3'
    );
    expect(
      formatFraction(
        { numerator: 4, denominator: 6, isNegative: true },
        { simplify: true }
      )
    ).toBe('-2/3');
  });

  it('showMixedNumber covers proper, improper, and whole remainders', () => {
    expect(formatFraction(createFraction(1, 2), { showMixedNumber: true })).toBe(
      '1/2'
    );
    expect(formatFraction(createFraction(5, 2), { showMixedNumber: true })).toBe(
      '2 1/2'
    );
    expect(formatFraction(createFraction(8, 4), { showMixedNumber: true })).toBe(
      '2'
    );
    expect(
      formatFraction(createFraction(-7, 3), { showMixedNumber: true })
    ).toBe('-2 1/3');
    expect(
      formatFraction(
        { numerator: 5, denominator: 2, isNegative: true },
        { showMixedNumber: true }
      )
    ).toBe('-2 1/2');
  });

  it('useUnicodeFractions maps known glyphs alone and in mixed form', () => {
    expect(
      formatFraction(createFraction(1, 2), { useUnicodeFractions: true })
    ).toBe('½');
    expect(
      formatFraction(createFraction(3, 4), { useUnicodeFractions: true })
    ).toBe('¾');
    expect(
      formatFraction(createFraction(1, 8), { useUnicodeFractions: true })
    ).toBe('⅛');
    expect(
      formatFraction(createFraction(5, 2), {
        showMixedNumber: true,
        useUnicodeFractions: true,
      })
    ).toBe('2 ½');
    expect(
      formatFraction(createFraction(-1, 4), { useUnicodeFractions: true })
    ).toBe('-¼');
    // Unknown unicode falls back to ascii
    expect(
      formatFraction(createFraction(2, 7), { useUnicodeFractions: true })
    ).toBe('2/7');
  });

  it('combines simplify + mixed + unicode', () => {
    expect(
      formatFraction(createFraction(6, 4), {
        simplify: true,
        showMixedNumber: true,
        useUnicodeFractions: true,
      })
    ).toBe('1 ½');
    expect(
      formatFraction(createFraction(2, 8), {
        simplify: true,
        useUnicodeFractions: true,
      })
    ).toBe('¼');
  });
});

describe('Wave 27 frac-parse-format — formatMixedNumber / toMixedNumber', () => {
  it('formatMixedNumber for proper, improper, whole, and negative', () => {
    expect(formatMixedNumber(createFraction(1, 2))).toBe('1/2');
    expect(formatMixedNumber(createFraction(5, 2))).toBe('2 1/2');
    expect(formatMixedNumber(createFraction(6, 3))).toBe('2');
    expect(formatMixedNumber(createFraction(-5, 2))).toBe('-2 1/2');
    expect(formatMixedNumber(fromWhole(0))).toBe('0');
  });

  it('toMixedNumber remainder is absolute and whole truncates toward zero', () => {
    expect(toMixedNumber(createFraction(7, 3))).toEqual({
      whole: 2,
      fraction: { numerator: 1, denominator: 3 },
    });
    expect(toMixedNumber(createFraction(-7, 3))).toEqual({
      whole: -2,
      fraction: { numerator: 1, denominator: 3 },
    });
    expect(toMixedNumber({ numerator: 7, denominator: 3, isNegative: true })).toEqual({
      whole: -2,
      fraction: { numerator: 1, denominator: 3 },
    });
  });

  it('fromMixedNumber negative wholes produce signed improper fractions', () => {
    expect(fromMixedNumber(-1, 1, 2)).toEqual({ numerator: -3, denominator: 2 });
    expect(fromMixedNumber(2, 1, 4)).toEqual({ numerator: 9, denominator: 4 });
    expect(areEqual(fromMixedNumber(0, 3, 4), createFraction(3, 4))).toBe(true);
  });

  it('simplify then formatMixedNumber stays consistent for flag-style negatives', () => {
    const s = simplify({ numerator: 9, denominator: 6, isNegative: true });
    expect(s).toEqual({ numerator: 3, denominator: 2, isNegative: true });
    expect(formatMixedNumber(s)).toBe('-1 1/2');
  });
});
