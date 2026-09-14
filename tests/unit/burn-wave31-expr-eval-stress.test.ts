/**
 * Wave 31 — expression evaluate stress / conservation matrices.
 * Distinct from wave22 UI / wave27 edges / storage (#151).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { evaluate } from '../../src/core/expressions';

describe('Wave 31 expr-eval — additive conservation', () => {
  it('sums 1..n equal n*(n+1)/2 for n up to 30', () => {
    for (let n = 1; n <= 30; n++) {
      const expr = Array.from({ length: n }, (_, i) => String(i + 1)).join('+');
      const expected = (n * (n + 1)) / 2;
      expect(evaluate(expr)).toEqual({ success: true, value: expected });
    }
  });
});

describe('Wave 31 expr-eval — multiplicative ladder', () => {
  it('computes factorial-like products 1*2*...*k', () => {
    let product = 1;
    for (let k = 1; k <= 10; k++) {
      product *= k;
      const expr = Array.from({ length: k }, (_, i) => String(i + 1)).join('*');
      expect(evaluate(expr)).toEqual({ success: true, value: product });
    }
  });
});

describe('Wave 31 expr-eval — alternating identity', () => {
  it('keeps (((((x)+0)*1)+0)*1) stable for many x', () => {
    for (const x of [0, 1, 2, 7, 13, 99, -4]) {
      const expr = `(((((${x})+0)*1)+0)*1)`;
      expect(evaluate(expr)).toEqual({ success: true, value: x });
    }
  });
});

describe('Wave 31 expr-eval — large nesting', () => {
  it('evaluates 50 nested additions of 1', () => {
    let expr = '1';
    for (let i = 0; i < 49; i++) {
      expr = `(${expr}+1)`;
    }
    expect(evaluate(expr)).toEqual({ success: true, value: 50 });
  });
});
