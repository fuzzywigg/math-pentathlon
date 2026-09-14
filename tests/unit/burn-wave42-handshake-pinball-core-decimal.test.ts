/**
 * Wave 42 — handshake: pinball formatDecimal × core toDecimal.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  formatDecimal,
  formatFraction,
} from '../../src/games/fraction-pinball/rules';
import {
  toDecimal,
  formatFraction as coreFormat,
  areEquivalent,
} from '../../src/core/fractions/arithmetic';

describe('Wave 42 handshake — pinball decimal × core', () => {
  it('formatDecimal(toDecimal(f)) matches common halves/quarters', () => {
    const halves = [
      { numerator: 1, denominator: 2 },
      { numerator: 1, denominator: 4 },
      { numerator: 3, denominator: 4 },
      { numerator: 1, denominator: 5 },
    ];
    for (const f of halves) {
      expect(formatDecimal(toDecimal(f))).toBe(formatDecimal(f.numerator / f.denominator));
    }
  });

  it('pinball formatFraction agrees with core for unit fractions', () => {
    const f = { numerator: 1, denominator: 8 };
    expect(formatFraction(f)).toBe(coreFormat(f));
    expect(areEquivalent(f, { numerator: 2, denominator: 16 })).toBe(true);
  });
});
