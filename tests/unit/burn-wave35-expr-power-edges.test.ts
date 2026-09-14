/**
 * Wave 35 — exponentiation edge leftovers (0/1/assoc).
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { evaluate } from '../../src/core/expressions';

describe('Wave 35 expr-power — zero and one', () => {
  it('n^0 is 1 for positive n', () => {
    for (const n of [1, 2, 5, 10]) {
      expect(evaluate(`${n}^0`)).toEqual({ success: true, value: 1 });
    }
  });

  it('1^n is 1', () => {
    for (const n of [0, 1, 2, 8]) {
      expect(evaluate(`1^${n}`)).toEqual({ success: true, value: 1 });
    }
  });

  it('0^n is 0 for positive n', () => {
    for (const n of [1, 2, 5]) {
      expect(evaluate(`0^${n}`)).toEqual({ success: true, value: 0 });
    }
  });
});

describe('Wave 35 expr-power — right-ish chaining via unary right', () => {
  it('2^3^2 parses as successive power (left-assoc in this parser)', () => {
    // parsePower loops left = left ^ right with parseUnary right → ((2^3)^2)=64
    expect(evaluate('2^3^2')).toEqual({ success: true, value: 64 });
  });

  it('2^(3^2) forces 512', () => {
    expect(evaluate('2^(3^2)')).toEqual({ success: true, value: 512 });
  });
});
