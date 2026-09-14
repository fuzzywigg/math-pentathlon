/**
 * Wave 37 — formatFraction UNICODE_FRACTIONS full catalog leftovers.
 * Beyond wave 27 glyph smoke. Not fraction-bar-ui (#164). Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  formatFraction,
  parseFraction,
  areEqual,
  simplify,
} from '../../src/core/fractions';

const UNICODE: Array<{ n: number; d: number; glyph: string }> = [
  { n: 1, d: 2, glyph: '½' },
  { n: 1, d: 3, glyph: '⅓' },
  { n: 2, d: 3, glyph: '⅔' },
  { n: 1, d: 4, glyph: '¼' },
  { n: 3, d: 4, glyph: '¾' },
  { n: 1, d: 5, glyph: '⅕' },
  { n: 2, d: 5, glyph: '⅖' },
  { n: 3, d: 5, glyph: '⅗' },
  { n: 4, d: 5, glyph: '⅘' },
  { n: 1, d: 6, glyph: '⅙' },
  { n: 5, d: 6, glyph: '⅚' },
  { n: 1, d: 7, glyph: '⅐' },
  { n: 1, d: 8, glyph: '⅛' },
  { n: 3, d: 8, glyph: '⅜' },
  { n: 5, d: 8, glyph: '⅝' },
  { n: 7, d: 8, glyph: '⅞' },
  { n: 1, d: 9, glyph: '⅑' },
  { n: 1, d: 10, glyph: '⅒' },
];

describe('Wave 37 frac-unicode — catalog exact glyphs', () => {
  it.each(UNICODE)('formats $n/$d as $glyph', ({ n, d, glyph }) => {
    expect(
      formatFraction(createFraction(n, d), { useUnicodeFractions: true })
    ).toBe(glyph);
  });

  it.each(UNICODE)('negative prefix for -$n/$d', ({ n, d, glyph }) => {
    expect(
      formatFraction(createFraction(-n, d), { useUnicodeFractions: true })
    ).toBe(`-${glyph}`);
  });

  it('mixed number uses unicode for remainder part', () => {
    expect(
      formatFraction(createFraction(5, 2), {
        showMixedNumber: true,
        useUnicodeFractions: true,
      })
    ).toBe('2 ½');
    expect(
      formatFraction(createFraction(11, 4), {
        showMixedNumber: true,
        useUnicodeFractions: true,
        simplify: true,
      })
    ).toBe('2 ¾');
  });

  it('unknown ratios fall back to ascii even with unicode flag', () => {
    expect(
      formatFraction(createFraction(2, 7), { useUnicodeFractions: true })
    ).toBe('2/7');
  });
});

describe('Wave 37 frac-unicode — simplify+unicode handshake', () => {
  it('2/4 simplifies to unicode half', () => {
    expect(
      formatFraction(createFraction(2, 4), {
        simplify: true,
        useUnicodeFractions: true,
      })
    ).toBe('½');
  });

  it('ascii format still parses to equal value for catalog', () => {
    for (const { n, d } of UNICODE) {
      const f = createFraction(n, d);
      const parsed = parseFraction(formatFraction(f));
      expect(parsed).not.toBeNull();
      expect(areEqual(simplify(parsed!), simplify(f))).toBe(true);
    }
  });
});
