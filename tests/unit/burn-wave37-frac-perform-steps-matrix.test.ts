/**
 * Wave 37 — performOperation step narrative matrix leftovers.
 * Beyond wave 27 perform-steps / fraction-ops. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  performOperation,
  areEqual,
  simplify,
  toDecimal,
  formatFraction,
  type FractionOperation,
} from '../../src/core/fractions';

const F = createFraction;
const OPS: FractionOperation[] = ['add', 'subtract', 'multiply', 'divide'];

describe('Wave 37 frac-perform — result / simplified / decimal contract', () => {
  it('every op returns consistent triple for same and different denoms', () => {
    const pairs = [
      [F(1, 4), F(1, 4)],
      [F(1, 3), F(1, 6)],
      [F(5, 6), F(1, 2)],
      [F(-3, 4), F(1, 8)],
      [F(2, 5), F(-3, 5)],
    ] as const;

    for (const [a, b] of pairs) {
      for (const op of OPS) {
        const out = performOperation(a, b, op);
        expect(areEqual(out.simplified, simplify(out.result))).toBe(true);
        expect(out.decimal).toBeCloseTo(toDecimal(out.simplified), 10);
        expect(out.steps!.length).toBeGreaterThanOrEqual(2);
        expect(out.steps![0]).toContain(formatFraction(a));
        expect(out.steps![0]).toContain(formatFraction(b));
        expect(out.steps!.some((s) => s.startsWith('='))).toBe(true);
      }
    }
  });

  it('add/sub with mismatched dens mention common denominator', () => {
    const out = performOperation(F(1, 3), F(1, 4), 'add');
    expect(out.steps!.some((s) => /common denominator/i.test(s))).toBe(true);
    expect(areEqual(out.simplified, F(7, 12))).toBe(true);

    const same = performOperation(F(1, 5), F(2, 5), 'add');
    expect(same.steps!.some((s) => /common denominator/i.test(s))).toBe(false);
  });

  it('multiply steps include cross-product form; divide mentions reciprocal', () => {
    const mul = performOperation(F(2, 3), F(3, 5), 'multiply');
    expect(mul.steps!.some((s) => s.includes('×') || s.includes('('))).toBe(
      true
    );
    expect(areEqual(mul.simplified, F(2, 5))).toBe(true);

    const div = performOperation(F(3, 4), F(1, 2), 'divide');
    expect(div.steps!.some((s) => s.includes('×'))).toBe(true);
    expect(areEqual(div.simplified, F(3, 2))).toBe(true);
  });

  it('add auto-simplifies result; multiply may still emit simplify step', () => {
    const addOut = performOperation(F(1, 4), F(1, 4), 'add');
    expect(areEqual(addOut.result, F(1, 2))).toBe(true);
    expect(areEqual(addOut.simplified, F(1, 2))).toBe(true);

    const mul = performOperation(F(2, 4), F(1, 2), 'multiply');
    // 2/4 × 1/2 → 2/8 then simplified 1/4
    expect(mul.result.denominator).toBe(8);
    expect(mul.simplified.denominator).toBe(4);
    expect(mul.steps!.some((s) => /simplified/i.test(s))).toBe(true);
  });
});
