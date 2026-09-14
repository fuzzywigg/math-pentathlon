/**
 * Wave 37 — add commutativity dense leftovers on commons.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  COMMON_FRACTIONS,
  add,
  areEqual,
  simplify,
  createFraction,
} from '../../src/core/fractions';

describe('Wave 37 frac-add — commutativity', () => {
  it('a+b == b+a for all COMMON_FRACTIONS pairs', () => {
    for (const a of COMMON_FRACTIONS) {
      for (const b of COMMON_FRACTIONS) {
        expect(areEqual(simplify(add(a, b)), simplify(add(b, a)))).toBe(true);
      }
    }
  });

  it('adding zero identity across denoms', () => {
    for (const d of [1, 2, 3, 4, 5, 8, 12]) {
      const z = createFraction(0, d);
      for (const a of COMMON_FRACTIONS.slice(0, 10)) {
        expect(areEqual(simplify(add(a, z)), simplify(a))).toBe(true);
      }
    }
  });
});
