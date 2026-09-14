/**
 * Wave 37 — COMMON_FRACTIONS arithmetic closure / compare chain stress.
 * Distinct from wave 27 stress pair sampling. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  COMMON_FRACTIONS,
  add,
  subtract,
  multiply,
  divide,
  compare,
  areEqual,
  areEquivalent,
  simplify,
  toDecimal,
  min,
  max,
  sum,
  findLCD,
  toCommonDenominator,
} from '../../src/core/fractions';

describe('Wave 37 frac-common — total order consistency', () => {
  it('compare is antisymmetric and agrees with decimal order', () => {
    const list = COMMON_FRACTIONS;
    for (let i = 0; i < list.length; i++) {
      for (let j = 0; j < list.length; j++) {
        const c = compare(list[i], list[j]);
        const d = toDecimal(list[i]) - toDecimal(list[j]);
        if (Math.abs(d) < 1e-12) expect(c).toBe(0);
        else if (d < 0) expect(c).toBe(-1);
        else expect(c).toBe(1);
        expect(compare(list[j], list[i])).toBe(c === 0 ? 0 : ((-c) as -1 | 1));
      }
    }
  });

  it('min/max over full COMMON_FRACTIONS match extreme decimals', () => {
    const lo = min(...COMMON_FRACTIONS);
    const hi = max(...COMMON_FRACTIONS);
    const decimals = COMMON_FRACTIONS.map(toDecimal);
    expect(toDecimal(lo)).toBe(Math.min(...decimals));
    expect(toDecimal(hi)).toBe(Math.max(...decimals));
  });
});

describe('Wave 37 frac-common — pairwise op value sanity', () => {
  it('add/sub/mul decimal matches float within tolerance for all pairs', () => {
    for (const a of COMMON_FRACTIONS) {
      for (const b of COMMON_FRACTIONS) {
        expect(toDecimal(add(a, b))).toBeCloseTo(
          toDecimal(a) + toDecimal(b),
          10
        );
        expect(toDecimal(subtract(a, b))).toBeCloseTo(
          toDecimal(a) - toDecimal(b),
          10
        );
        expect(toDecimal(multiply(a, b))).toBeCloseTo(
          toDecimal(a) * toDecimal(b),
          10
        );
        expect(toDecimal(divide(a, b))).toBeCloseTo(
          toDecimal(a) / toDecimal(b),
          10
        );
      }
    }
  });

  it('a-a is zero; a/a is one under equality for every common', () => {
    for (const a of COMMON_FRACTIONS) {
      expect(areEqual(subtract(a, a), { numerator: 0, denominator: 1 })).toBe(
        true
      );
      expect(areEqual(divide(a, a), { numerator: 1, denominator: 1 })).toBe(
        true
      );
    }
  });
});

describe('Wave 37 frac-common — LCD / common denominator batch', () => {
  it('findLCD of all commons is multiple of each denominator', () => {
    const lcd = findLCD(...COMMON_FRACTIONS);
    for (const f of COMMON_FRACTIONS) {
      expect(lcd % f.denominator).toBe(0);
    }
  });

  it('toCommonDenominator preserves value and unifies denominators', () => {
    const converted = toCommonDenominator(...COMMON_FRACTIONS);
    const den = converted[0].denominator;
    expect(converted.every((f) => f.denominator === den)).toBe(true);
    for (let i = 0; i < COMMON_FRACTIONS.length; i++) {
      expect(areEquivalent(converted[i], COMMON_FRACTIONS[i])).toBe(true);
    }
  });

  it('sum of all commons simplifies to a positive proper-or-improper fraction', () => {
    const total = sum(COMMON_FRACTIONS);
    expect(toDecimal(total)).toBeGreaterThan(0);
    expect(areEqual(total, simplify(total))).toBe(true);
  });
});
