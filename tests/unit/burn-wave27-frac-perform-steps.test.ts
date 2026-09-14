/**
 * Wave 27 — performOperation step traces for add/sub/mul/div.
 * Distinct from wave 21 UI and existing fractions smoke tests (never covered).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  fromWhole,
  performOperation,
  areEqual,
  simplify,
  toDecimal,
  formatFraction,
} from '../../src/core/fractions';

const F = createFraction;

describe('Wave 27 frac-perform-steps — add traces', () => {
  it('same-denominator add skips LCD step and still reports result', () => {
    const out = performOperation(F(1, 5), F(2, 5), 'add');
    expect(out.steps![0]).toBe('1/5 + 2/5');
    expect(out.steps!.some((s) => s.includes('common denominator'))).toBe(
      false
    );
    expect(areEqual(out.result, F(3, 5))).toBe(true);
    expect(areEqual(out.simplified, F(3, 5))).toBe(true);
    expect(out.decimal).toBeCloseTo(0.6, 10);
    expect(out.steps!.at(-1)).toMatch(/^= /);
  });

  it('different-denominator add emits LCD rewrite then simplify if needed', () => {
    const out = performOperation(F(1, 4), F(1, 6), 'add');
    expect(out.steps![0]).toBe('1/4 + 1/6');
    expect(out.steps!).toContain('Find common denominator: 12');
    expect(out.steps!.some((s) => s.includes('3/12') && s.includes('2/12'))).toBe(
      true
    );
    expect(areEqual(out.simplified, F(5, 12))).toBe(true);
    expect(out.decimal).toBeCloseTo(5 / 12, 10);
  });

  it('add that auto-simplifies in add() may already match simplified', () => {
    // add() returns simplify(), so result === simplified and no extra step
    const out = performOperation(F(1, 4), F(1, 4), 'add');
    expect(areEqual(out.simplified, F(1, 2))).toBe(true);
    expect(areEqual(out.result, out.simplified)).toBe(true);
    expect(out.steps!.some((s) => s.includes('simplified'))).toBe(false);
    expect(out.steps!.at(-1)).toBe('= 1/2');
  });

  it('multiply of unsimplified cross-product appends simplified step', () => {
    const out = performOperation(F(2, 4), F(3, 6), 'multiply');
    expect(out.result).toEqual({ numerator: 6, denominator: 24 });
    expect(areEqual(out.simplified, F(1, 4))).toBe(true);
    expect(out.steps!.some((s) => s.includes('simplified'))).toBe(true);
  });
});

describe('Wave 27 frac-perform-steps — subtract traces', () => {
  it('same denom subtract has no LCD step', () => {
    const out = performOperation(F(3, 4), F(1, 4), 'subtract');
    expect(out.steps![0]).toBe('3/4 - 1/4');
    expect(out.steps!.some((s) => s.includes('common denominator'))).toBe(
      false
    );
    expect(areEqual(out.result, F(2, 4))).toBe(true);
    expect(areEqual(out.simplified, F(1, 2))).toBe(true);
  });

  it('different denom subtract rewrites to LCD', () => {
    const out = performOperation(F(1, 2), F(1, 3), 'subtract');
    expect(out.steps!).toContain('Find common denominator: 6');
    expect(out.steps!.some((s) => s.includes('3/6') && s.includes('2/6'))).toBe(
      true
    );
    expect(areEqual(out.simplified, F(1, 6))).toBe(true);
  });
});

describe('Wave 27 frac-perform-steps — multiply / divide traces', () => {
  it('multiply shows cross product formula', () => {
    const out = performOperation(F(2, 3), F(3, 5), 'multiply');
    expect(out.steps![0]).toBe('2/3 × 3/5');
    expect(out.steps!).toContain('(2 × 3) / (3 × 5)');
    expect(areEqual(out.result, F(6, 15))).toBe(true);
    expect(areEqual(out.simplified, F(2, 5))).toBe(true);
    expect(out.steps!.some((s) => s.includes('simplified'))).toBe(true);
  });

  it('divide shows multiply-by-reciprocal step', () => {
    const out = performOperation(F(3, 4), F(1, 2), 'divide');
    expect(out.steps![0]).toBe('3/4 ÷ 1/2');
    // reciprocal(1/2) formats as "2" because denom === 1
    expect(out.steps!).toContain('3/4 × 2');
    expect(areEqual(out.simplified, F(3, 2))).toBe(true);
    expect(out.decimal).toBeCloseTo(1.5, 10);
  });

  it('divide by unit fraction yields whole after simplify', () => {
    const out = performOperation(F(1, 2), F(1, 8), 'divide');
    expect(areEqual(out.simplified, fromWhole(4))).toBe(true);
    expect(formatFraction(out.simplified, { simplify: true })).toBe('4');
  });
});

describe('Wave 27 frac-perform-steps — result contract matrix', () => {
  const cases = [
    ['add', F(2, 7), F(3, 7)] as const,
    ['subtract', F(5, 6), F(1, 6)] as const,
    ['multiply', F(4, 9), F(3, 2)] as const,
    ['divide', F(5, 8), F(5, 4)] as const,
  ];

  it.each(cases)('%s returns consistent decimal of simplified', (op, a, b) => {
    const out = performOperation(a, b, op);
    expect(out.decimal).toBeCloseTo(toDecimal(out.simplified), 12);
    expect(areEqual(simplify(out.result), out.simplified)).toBe(true);
    expect(out.steps!.length).toBeGreaterThanOrEqual(2);
    expect(out.steps![0]).toContain(formatFraction(a));
    expect(out.steps![0]).toContain(formatFraction(b));
  });

  it('already-simplified multiply still ends with equals step', () => {
    const out = performOperation(F(1, 2), F(1, 3), 'multiply');
    expect(areEqual(out.result, out.simplified)).toBe(true);
    expect(out.steps!.at(-1)).toBe('= 1/6');
  });
});
