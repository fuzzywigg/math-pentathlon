/**
 * Wave 37 — performOperation unlike-denominator LCD step leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  performOperation,
  lcm,
  areEqual,
  type FractionOperation,
} from '../../src/core/fractions';

describe('Wave 37 frac-perform-lcd — unlike dens', () => {
  const pairs = [
    [1, 4, 1, 6],
    [1, 8, 1, 12],
    [2, 9, 1, 6],
    [5, 14, 3, 21],
    [1, 10, 1, 15],
  ];

  it('add/subtract emit Find common denominator: lcm', () => {
    for (const [an, ad, bn, bd] of pairs) {
      for (const op of ['add', 'subtract'] as FractionOperation[]) {
        const out = performOperation(
          createFraction(an, ad),
          createFraction(bn, bd),
          op
        );
        const common = lcm(ad, bd);
        expect(out.steps!).toContain(`Find common denominator: ${common}`);
        expect(out.simplified).toBeDefined();
        expect(out.decimal).toBeDefined();
      }
    }
  });

  it('same denom skips LCD for add/subtract', () => {
    for (const op of ['add', 'subtract'] as FractionOperation[]) {
      const out = performOperation(
        createFraction(2, 7),
        createFraction(3, 7),
        op
      );
      expect(out.steps!.some((s) => s.includes('common denominator'))).toBe(
        false
      );
    }
  });

  it('multiply/divide never emit LCD step', () => {
    for (const op of ['multiply', 'divide'] as FractionOperation[]) {
      const out = performOperation(
        createFraction(1, 4),
        createFraction(1, 6),
        op
      );
      expect(out.steps!.some((s) => s.includes('common denominator'))).toBe(
        false
      );
      expect(areEqual(out.simplified, out.simplified)).toBe(true);
    }
  });
});
