/**
 * Wave 27 — aggregates (sum/avg/min/max) and LCD / common-denominator helpers.
 * Distinct from wave 21 fraction-bar-ui. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  fromWhole,
  sum,
  average,
  min,
  max,
  findLCD,
  toCommonDenominator,
  findEquivalentFractions,
  areEqual,
  compare,
  simplify,
  lcm,
  gcd,
} from '../../src/core/fractions';

const F = createFraction;
const flag = (n: number, d: number) => ({
  numerator: n,
  denominator: d,
  isNegative: true as const,
});

describe('Wave 27 frac-aggregate-lcd — sum / average', () => {
  it('sum of empty is zero; single is identity; multi reduces via add', () => {
    expect(areEqual(sum([]), fromWhole(0))).toBe(true);
    expect(areEqual(sum([F(3, 7)]), F(3, 7))).toBe(true);
    expect(areEqual(sum([F(1, 2), F(1, 3), F(1, 6)]), fromWhole(1))).toBe(true);
    expect(
      areEqual(sum([F(1, 4), flag(1, 4), F(1, 2)]), F(1, 2))
    ).toBe(true);
  });

  it('average throws on empty and averages mixed values', () => {
    expect(() => average([])).toThrow(/empty/i);
    expect(areEqual(average([F(1, 2), F(1, 2)]), F(1, 2))).toBe(true);
    expect(areEqual(average([F(1, 4), F(3, 4)]), F(1, 2))).toBe(true);
    expect(areEqual(average([fromWhole(1), fromWhole(2), fromWhole(3)]), fromWhole(2))).toBe(
      true
    );
    expect(areEqual(average([F(1, 2), flag(1, 2)]), fromWhole(0))).toBe(true);
  });
});

describe('Wave 27 frac-aggregate-lcd — min / max', () => {
  it('min / max over positive and negative sets', () => {
    const set = [F(1, 2), F(1, 3), F(3, 4), F(1, 5)];
    expect(areEqual(min(...set), F(1, 5))).toBe(true);
    expect(areEqual(max(...set), F(3, 4))).toBe(true);

    const mixed = [F(1, 4), flag(1, 2), F(-1, 8), fromWhole(0)];
    expect(areEqual(min(...mixed), flag(1, 2))).toBe(true);
    expect(areEqual(max(...mixed), F(1, 4))).toBe(true);
  });

  it('min/max of one fraction returns that fraction', () => {
    expect(min(F(2, 9))).toEqual(F(2, 9));
    expect(max(flag(3, 5))).toEqual(flag(3, 5));
  });

  it('compare-based ordering matches min/max choice', () => {
    const a = F(2, 7);
    const b = F(3, 8);
    const winnerMin = compare(a, b) < 0 ? a : b;
    const winnerMax = compare(a, b) > 0 ? a : b;
    expect(areEqual(min(a, b), winnerMin)).toBe(true);
    expect(areEqual(max(a, b), winnerMax)).toBe(true);
  });
});

describe('Wave 27 frac-aggregate-lcd — findLCD / toCommonDenominator', () => {
  it('findLCD for one, two, and many denominators', () => {
    expect(findLCD(F(1, 4))).toBe(4);
    expect(findLCD(F(1, 4), F(1, 6))).toBe(12);
    expect(findLCD(F(1, 2), F(1, 3), F(1, 5))).toBe(30);
    expect(findLCD(F(1, 8), F(3, 8), F(5, 8))).toBe(8);
    expect(findLCD()).toBe(1);
  });

  it('findLCD matches pairwise lcm fold', () => {
    const dens = [4, 6, 8, 10];
    const fracs = dens.map((d) => F(1, d));
    const expected = dens.reduce((acc, d) => lcm(acc, d), dens[0]);
    expect(findLCD(...fracs)).toBe(expected);
  });

  it('toCommonDenominator rewrites all to LCD and preserves value', () => {
    const input = [F(1, 2), F(1, 3), F(1, 4)];
    const out = toCommonDenominator(...input);
    expect(out.every((f) => f.denominator === 12)).toBe(true);
    expect(out.map((f) => f.numerator)).toEqual([6, 4, 3]);
    input.forEach((orig, i) => {
      expect(areEqual(orig, out[i])).toBe(true);
    });
  });

  it('toCommonDenominator normalizes isNegative flags to signed numerators', () => {
    const out = toCommonDenominator(flag(1, 2), F(1, 4));
    expect(out[0]).toEqual({ numerator: -2, denominator: 4 });
    expect(out[1]).toEqual({ numerator: 1, denominator: 4 });
    expect(areEqual(out[0], flag(1, 2))).toBe(true);
  });

  it('empty toCommonDenominator yields empty array with LCD default path', () => {
    expect(toCommonDenominator()).toEqual([]);
  });
});

describe('Wave 27 frac-aggregate-lcd — findEquivalentFractions', () => {
  it('lists multiples up to maxDenominator including the base', () => {
    const eqs = findEquivalentFractions(F(1, 2), 10);
    expect(eqs).toEqual([
      { numerator: 1, denominator: 2 },
      { numerator: 2, denominator: 4 },
      { numerator: 3, denominator: 6 },
      { numerator: 4, denominator: 8 },
      { numerator: 5, denominator: 10 },
    ]);
  });

  it('simplifies first then scales; supports negatives', () => {
    const eqs = findEquivalentFractions(F(2, 4), 8);
    expect(eqs[0]).toEqual({ numerator: 1, denominator: 2 });
    expect(eqs.at(-1)).toEqual({ numerator: 4, denominator: 8 });

    const neg = findEquivalentFractions(F(-1, 3), 9);
    expect(neg).toEqual([
      { numerator: -1, denominator: 3 },
      { numerator: -2, denominator: 6 },
      { numerator: -3, denominator: 9 },
    ]);

    const flagNeg = findEquivalentFractions(flag(1, 3), 6);
    expect(flagNeg).toEqual([
      { numerator: -1, denominator: 3 },
      { numerator: -2, denominator: 6 },
    ]);
  });

  it('maxDenominator below base denom yields empty list', () => {
    expect(findEquivalentFractions(F(1, 8), 7)).toEqual([]);
    expect(findEquivalentFractions(F(1, 8), 8)).toEqual([
      { numerator: 1, denominator: 8 },
    ]);
  });

  it('every listed equivalent compares equal after simplify', () => {
    const base = F(2, 5);
    for (const e of findEquivalentFractions(base, 40)) {
      expect(areEqual(simplify(e), simplify(base))).toBe(true);
    }
  });
});

describe('Wave 27 frac-aggregate-lcd — gcd/lcm stress with aggregates', () => {
  it('LCD of many unit fractions aligns with gcd/lcm identities', () => {
    const dens = [2, 3, 4, 5, 6, 8, 9, 10, 12];
    const lcd = findLCD(...dens.map((d) => F(1, d)));
    for (const d of dens) {
      expect(lcd % d).toBe(0);
      expect(gcd(lcd, d)).toBe(d);
    }
  });
});
