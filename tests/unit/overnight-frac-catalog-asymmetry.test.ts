/**
 * Overnight TOKENMAXX HEAVY — COMMON_FRACTIONS ↔ UNICODE ↔ COLORS catalog diffs.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  COMMON_FRACTIONS,
  FRACTION_COLORS,
} from '../../src/core/fractions/types';
import { formatFraction } from '../../src/core/fractions/arithmetic';

describe('Overnight frac types — catalog asymmetries', () => {
  it('unicode has 1/7 and 1/9 not present in COMMON_FRACTIONS', () => {
    const keys = new Set(
      COMMON_FRACTIONS.map((f) => `${f.numerator}/${f.denominator}`)
    );
    expect(keys.has('1/7')).toBe(false);
    expect(keys.has('1/9')).toBe(false);
    expect(formatFraction({ numerator: 1, denominator: 7 }, { useUnicodeFractions: true })).toBe('⅐');
    expect(formatFraction({ numerator: 1, denominator: 9 }, { useUnicodeFractions: true })).toBe('⅑');
  });

  it('commons include ratios without unicode glyphs', () => {
    expect(
      formatFraction({ numerator: 3, denominator: 10 }, { useUnicodeFractions: true })
    ).toBe('3/10');
    expect(
      formatFraction({ numerator: 5, denominator: 12 }, { useUnicodeFractions: true })
    ).toBe('5/12');
    expect(COMMON_FRACTIONS.some((f) => f.numerator === 3 && f.denominator === 10)).toBe(
      true
    );
  });

  it('FRACTION_COLORS omits 7 and 9 keys', () => {
    expect(FRACTION_COLORS[7]).toBeUndefined();
    expect(FRACTION_COLORS[9]).toBeUndefined();
    expect(FRACTION_COLORS[8]).toBe('#00bcd4');
    expect(FRACTION_COLORS[10]).toBe('#009688');
  });
});
