/**
 * Wave 27 — combinatorial stress: all COMMON_FRACTIONS × ops / format / LCD.
 * Distinct from wave 21 fraction-bar-ui and wave 26 areEquivalent helper use.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  COMMON_FRACTIONS,
  createFraction,
  fromWhole,
  add,
  subtract,
  multiply,
  divide,
  reciprocal,
  simplify,
  areEqual,
  compare,
  toDecimal,
  formatFraction,
  parseFraction,
  findLCD,
  toCommonDenominator,
  findEquivalentFractions,
  sum,
  average,
  min,
  max,
  power,
  performOperation,
  isSimplified,
  gcd,
} from '../../src/core/fractions';

const commons = COMMON_FRACTIONS;
const sample = commons.slice(0, 10);

describe('Wave 27 frac-stress — pairwise arithmetic invariants', () => {
  it('add is commutative and a+(−a)=0 for every common fraction', () => {
    for (const a of sample) {
      for (const b of sample) {
        expect(areEqual(add(a, b), add(b, a))).toBe(true);
      }
      const neg = createFraction(-a.numerator, a.denominator);
      expect(areEqual(add(a, neg), fromWhole(0))).toBe(true);
    }
  });

  it('subtract matches add of negated; multiply is commutative', () => {
    for (const a of sample) {
      for (const b of sample) {
        const negB = createFraction(-b.numerator, b.denominator);
        expect(areEqual(subtract(a, b), add(a, negB))).toBe(true);
        expect(areEqual(multiply(a, b), multiply(b, a))).toBe(true);
      }
    }
  });

  it('divide matches multiply-by-reciprocal for nonzero commons', () => {
    for (const a of sample) {
      for (const b of sample) {
        if (b.numerator === 0) continue;
        expect(areEqual(divide(a, b), multiply(a, reciprocal(b)))).toBe(true);
        expect(areEqual(multiply(b, reciprocal(b)), fromWhole(1))).toBe(true);
      }
    }
  });

  it('power 2 equals multiply self; power 0 is 1', () => {
    for (const a of sample) {
      expect(areEqual(power(a, 0), fromWhole(1))).toBe(true);
      expect(areEqual(power(a, 2), multiply(a, a))).toBe(true);
      if (a.numerator !== 0) {
        expect(areEqual(power(a, -1), reciprocal(a))).toBe(true);
      }
    }
  });
});

describe('Wave 27 frac-stress — compare / decimal consistency', () => {
  it('compare agrees with toDecimal for every common pair', () => {
    for (const a of commons) {
      for (const b of commons) {
        const c = compare(a, b);
        const da = toDecimal(a);
        const db = toDecimal(b);
        if (c === 0) {
          expect(Math.abs(da - db)).toBeLessThan(1e-12);
          expect(areEqual(a, b)).toBe(true);
        } else if (c < 0) {
          expect(da).toBeLessThan(db);
        } else {
          expect(da).toBeGreaterThan(db);
        }
      }
    }
  });

  it('min/max over all COMMON_FRACTIONS match extreme decimals', () => {
    const lo = min(...commons);
    const hi = max(...commons);
    const decimals = commons.map(toDecimal);
    expect(toDecimal(lo)).toBeCloseTo(Math.min(...decimals), 12);
    expect(toDecimal(hi)).toBeCloseTo(Math.max(...decimals), 12);
  });
});

describe('Wave 27 frac-stress — format/parse round-trip grid', () => {
  it('formatFraction then parseFraction preserves value for all commons', () => {
    for (const f of commons) {
      for (const opts of [
        {},
        { simplify: true },
        { showMixedNumber: true },
        { simplify: true, showMixedNumber: true },
      ] as const) {
        const s = formatFraction(f, opts);
        // unicode option may produce glyphs parseFraction cannot read — skip
        const parsed = parseFraction(s);
        expect(parsed).not.toBeNull();
        expect(areEqual(parsed!, f)).toBe(true);
      }
    }
  });

  it('simplified form of every common has gcd 1', () => {
    for (const f of commons) {
      const s = simplify(f);
      expect(gcd(s.numerator, s.denominator)).toBe(1);
      expect(isSimplified(s)).toBe(true);
    }
  });
});

describe('Wave 27 frac-stress — LCD / equivalents / aggregates', () => {
  it('toCommonDenominator of all commons shares one LCD', () => {
    const lcd = findLCD(...commons);
    const converted = toCommonDenominator(...commons);
    expect(converted.every((f) => f.denominator === lcd)).toBe(true);
    commons.forEach((orig, i) => {
      expect(areEqual(orig, converted[i])).toBe(true);
    });
  });

  it('findEquivalentFractions members equal the base after simplify', () => {
    for (const f of sample) {
      for (const e of findEquivalentFractions(f, 48)) {
        expect(areEqual(simplify(e), simplify(f))).toBe(true);
        expect(e.denominator).toBeLessThanOrEqual(48);
      }
    }
  });

  it('sum of unit fractions with LCD n equals sum of rewritten numerators / n', () => {
    const units = [2, 3, 4, 5, 6].map((d) => createFraction(1, d));
    const total = sum(units);
    const lcd = findLCD(...units);
    const rewritten = toCommonDenominator(...units);
    const numerSum = rewritten.reduce((acc, f) => acc + f.numerator, 0);
    expect(areEqual(total, createFraction(numerSum, lcd))).toBe(true);
  });

  it('average of a fraction with itself is itself', () => {
    for (const f of sample) {
      expect(areEqual(average([f, f, f, f]), f)).toBe(true);
    }
  });
});

describe('Wave 27 frac-stress — performOperation matrix on sample', () => {
  const ops = ['add', 'subtract', 'multiply', 'divide'] as const;

  it('every op returns steps and matching simplified decimal', () => {
    for (const op of ops) {
      for (const a of sample.slice(0, 5)) {
        for (const b of sample.slice(0, 5)) {
          if (op === 'divide' && b.numerator === 0) continue;
          const out = performOperation(a, b, op);
          expect(out.steps!.length).toBeGreaterThanOrEqual(2);
          expect(out.decimal).toBeCloseTo(toDecimal(out.simplified), 10);
          expect(areEqual(simplify(out.result), out.simplified)).toBe(true);
        }
      }
    }
  });

  it('performOperation add matches add(); multiply matches multiply()', () => {
    for (const a of sample.slice(0, 6)) {
      for (const b of sample.slice(0, 6)) {
        expect(areEqual(performOperation(a, b, 'add').simplified, add(a, b))).toBe(
          true
        );
        expect(
          areEqual(
            performOperation(a, b, 'multiply').simplified,
            simplify(multiply(a, b))
          )
        ).toBe(true);
      }
    }
  });
});
