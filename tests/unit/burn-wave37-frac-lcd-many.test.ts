/**
 * Wave 37 — findLCD / toCommonDenominator many-fraction leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  findLCD,
  toCommonDenominator,
  areEqual,
  lcm,
  toDecimal,
} from '../../src/core/fractions';

describe('Wave 37 frac-lcd — larger sets', () => {
  it('LCD of 1/n for n=2..12', () => {
    const fracs = Array.from({ length: 11 }, (_, i) =>
      createFraction(1, i + 2)
    );
    const lcd = findLCD(...fracs);
    let fold = 1;
    for (const f of fracs) fold = lcm(fold, f.denominator);
    expect(lcd).toBe(fold);
    const common = toCommonDenominator(...fracs);
    expect(common.every((f) => f.denominator === lcd)).toBe(true);
    for (let i = 0; i < fracs.length; i++) {
      expect(areEqual(common[i]!, fracs[i]!)).toBe(true);
    }
  });

  it('toCommonDenominator preserves decimals for mixed signs', () => {
    const fracs = [
      createFraction(1, 2),
      createFraction(-1, 3),
      createFraction(2, 5),
      { numerator: 1, denominator: 4, isNegative: true },
    ];
    const common = toCommonDenominator(...fracs);
    for (let i = 0; i < fracs.length; i++) {
      expect(toDecimal(common[i]!)).toBeCloseTo(toDecimal(fracs[i]!), 12);
    }
  });
});
