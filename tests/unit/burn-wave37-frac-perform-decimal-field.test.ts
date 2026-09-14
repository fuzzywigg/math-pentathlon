/**
 * Wave 37 — performOperation decimal/result/simplified field leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  performOperation,
  toDecimal,
  areEqual,
  simplify,
  type FractionOperation,
} from '../../src/core/fractions';

const ops: FractionOperation[] = ['add', 'subtract', 'multiply', 'divide'];

describe('Wave 37 frac-perform-fields — result coherence', () => {
  it('decimal matches toDecimal(simplified) for sample grid', () => {
    const nums = [1, 2, 3, 4, 5];
    const dens = [2, 3, 4, 5, 6];
    for (const an of nums) {
      for (const ad of dens) {
        for (const bn of nums) {
          for (const bd of dens) {
            for (const op of ops) {
              if (op === 'divide' && bn === 0) continue;
              const out = performOperation(
                createFraction(an, ad),
                createFraction(bn, bd),
                op
              );
              expect(out.decimal).toBeCloseTo(toDecimal(out.simplified), 10);
              expect(areEqual(simplify(out.result), out.simplified)).toBe(true);
            }
          }
        }
      }
    }
  });
});
