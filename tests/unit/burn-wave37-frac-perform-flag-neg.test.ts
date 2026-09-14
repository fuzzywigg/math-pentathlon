/**
 * Wave 37 — performOperation with isNegative-flag dual form leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  performOperation,
  areEqual,
  toDecimal,
  type FractionOperation,
} from '../../src/core/fractions';

const ops: FractionOperation[] = ['add', 'subtract', 'multiply', 'divide'];

function flagNeg(n: number, d: number) {
  return { numerator: Math.abs(n), denominator: d, isNegative: n < 0 };
}

describe('Wave 37 frac-perform — signed vs flag-negative agree', () => {
  const pairs = [
    [1, 2, 1, 3],
    [3, 4, 1, 4],
    [2, 5, 3, 5],
    [-1, 2, 1, 4],
    [1, 3, -2, 3],
    [-1, 5, -1, 5],
  ];

  it('all ops match decimals across dual encodings', () => {
    for (const [an, ad, bn, bd] of pairs) {
      for (const op of ops) {
        if (op === 'divide' && bn === 0) continue;
        const signed = performOperation(
          createFraction(an, ad),
          createFraction(bn, bd),
          op
        );
        const flagged = performOperation(
          flagNeg(an, ad),
          flagNeg(bn, bd),
          op
        );
        expect(areEqual(signed.simplified, flagged.simplified)).toBe(true);
        expect(signed.decimal).toBeCloseTo(flagged.decimal!, 10);
        expect(signed.steps!.length).toBeGreaterThan(0);
        expect(flagged.steps!.length).toBeGreaterThan(0);
      }
    }
  });

  it('divide by zero throws for both encodings', () => {
    expect(() =>
      performOperation(createFraction(1, 2), createFraction(0, 1), 'divide')
    ).toThrow();
    expect(() =>
      performOperation(createFraction(1, 2), flagNeg(0, 1), 'divide')
    ).toThrow();
  });
});

describe('Wave 37 frac-perform — step trail always ends with equals', () => {
  it('final step starts with "= " for sample matrix', () => {
    for (const op of ops) {
      const out = performOperation(
        createFraction(5, 6),
        createFraction(1, 6),
        op
      );
      expect(out.steps!.at(-1)!.startsWith('= ')).toBe(true);
      expect(Number.isFinite(toDecimal(out.result))).toBe(true);
    }
  });
});
