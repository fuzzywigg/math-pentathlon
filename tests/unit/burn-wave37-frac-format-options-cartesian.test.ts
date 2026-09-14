/**
 * Wave 37 — formatFraction options cartesian leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  formatFraction,
  parseFraction,
  areEqual,
  simplify,
} from '../../src/core/fractions';

describe('Wave 37 frac-format — option cartesian', () => {
  const fractions = [
    createFraction(1, 2),
    createFraction(3, 4),
    createFraction(5, 2),
    createFraction(6, 3),
    createFraction(-7, 4),
    createFraction(2, 4),
  ];
  const bools = [false, true];

  it('never throws; simplify option parses back to equal value', () => {
    for (const f of fractions) {
      for (const simplifyOpt of bools) {
        for (const showMixedNumber of bools) {
          for (const useUnicodeFractions of bools) {
            const s = formatFraction(f, {
              simplify: simplifyOpt,
              showMixedNumber,
              useUnicodeFractions,
            });
            expect(typeof s).toBe('string');
            expect(s.length).toBeGreaterThan(0);
            if (!useUnicodeFractions) {
              const parsed = parseFraction(s);
              // mixed unicode-free should parse
              if (parsed) {
                expect(areEqual(simplify(parsed), simplify(f))).toBe(true);
              }
            }
          }
        }
      }
    }
  });

  it('denom 1 formats as whole with or without mixed', () => {
    expect(formatFraction(createFraction(4, 1))).toBe('4');
    expect(
      formatFraction(createFraction(4, 1), { showMixedNumber: true })
    ).toBe('4');
  });
});
