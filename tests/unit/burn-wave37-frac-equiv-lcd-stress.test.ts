/**
 * Wave 37 — findEquivalentFractions × LCD dual-form stress.
 * Beyond wave 27 aggregate-lcd equivalents. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  findEquivalentFractions,
  areEquivalent,
  areEqual,
  simplify,
  findLCD,
  toCommonDenominator,
  lcm,
  gcd,
} from '../../src/core/fractions';

const F = createFraction;
const flag = (n: number, d: number) =>
  ({ numerator: n, denominator: d, isNegative: true }) as const;

describe('Wave 37 frac-equiv — equivalent ladder properties', () => {
  it('every listed equivalent shares value with base', () => {
    for (const base of [F(1, 2), F(2, 3), F(3, 8), F(-1, 4), flag(2, 5)]) {
      const eqs = findEquivalentFractions(base, 24);
      expect(eqs.length).toBeGreaterThan(0);
      for (const e of eqs) {
        expect(areEquivalent(e, base)).toBe(true);
        expect(e.denominator).toBeLessThanOrEqual(24);
      }
    }
  });

  it('first entry is the simplified base (signed)', () => {
    expect(findEquivalentFractions(F(2, 4), 12)[0]).toEqual({
      numerator: 1,
      denominator: 2,
    });
    expect(findEquivalentFractions(F(-2, 4), 12)[0]).toEqual({
      numerator: -1,
      denominator: 2,
    });
    expect(findEquivalentFractions(flag(2, 4), 12)[0]).toEqual({
      numerator: -1,
      denominator: 2,
    });
  });

  it('denominators form arithmetic progression of base denom', () => {
    const eqs = findEquivalentFractions(F(1, 6), 30);
    expect(eqs.map((e) => e.denominator)).toEqual([6, 12, 18, 24, 30]);
  });

  it('maxDenominator below simplified denom yields empty', () => {
    expect(findEquivalentFractions(F(1, 12), 11)).toEqual([]);
    expect(findEquivalentFractions(F(5, 12), 12)).toHaveLength(1);
  });
});

describe('Wave 37 frac-equiv — gcd/lcm/LCD handshake', () => {
  it('lcm(a,b)*gcd(a,b) === |a|*|b| for integer samples', () => {
    for (const [a, b] of [
      [4, 6],
      [12, 18],
      [7, 5],
      [0, 5],
      [9, 0],
    ]) {
      expect(lcm(a, b) * gcd(a, b)).toBe(Math.abs(a) * Math.abs(b));
    }
  });

  it('LCD of a set equals iterative lcm of denominators', () => {
    const set = [F(1, 4), F(1, 6), F(1, 8), F(5, 12)];
    let expected = 1;
    for (const f of set) expected = lcm(expected, f.denominator);
    expect(findLCD(...set)).toBe(expected);
  });

  it('toCommonDenominator then simplify recovers originals', () => {
    const set = [F(1, 3), F(1, 4), F(5, 6), flag(1, 2)];
    const common = toCommonDenominator(...set);
    for (let i = 0; i < set.length; i++) {
      expect(areEqual(simplify(common[i]), simplify(set[i]))).toBe(true);
    }
  });
});
