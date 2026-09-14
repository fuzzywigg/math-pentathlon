/**
 * Wave 37 — add associativity / mul associativity leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  add,
  multiply,
  areEqual,
  simplify,
  COMMON_FRACTIONS,
} from '../../src/core/fractions';

describe('Wave 37 frac-ops — associativity grids', () => {
  const sample = COMMON_FRACTIONS.slice(0, 8);

  it('add associativity (a+b)+c == a+(b+c)', () => {
    for (const a of sample) {
      for (const b of sample) {
        for (const c of sample) {
          const left = add(add(a, b), c);
          const right = add(a, add(b, c));
          expect(areEqual(simplify(left), simplify(right))).toBe(true);
        }
      }
    }
  });

  it('multiply associativity (a*b)*c == a*(b*c)', () => {
    for (const a of sample) {
      for (const b of sample) {
        for (const c of sample) {
          const left = multiply(multiply(a, b), c);
          const right = multiply(a, multiply(b, c));
          expect(areEqual(simplify(left), simplify(right))).toBe(true);
        }
      }
    }
  });

  it('distributivity spot: a*(b+c) == a*b + a*c', () => {
    for (const a of sample.slice(0, 5)) {
      for (const b of sample.slice(0, 5)) {
        for (const c of sample.slice(0, 5)) {
          const left = multiply(a, add(b, c));
          const right = add(multiply(a, b), multiply(a, c));
          expect(areEqual(simplify(left), simplify(right))).toBe(true);
        }
      }
    }
  });
});
