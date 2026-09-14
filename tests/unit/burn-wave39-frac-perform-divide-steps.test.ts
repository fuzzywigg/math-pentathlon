/**
 * Wave 39 — performOperation divide steps / zero divisor after #172/#173.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  performOperation,
  createFraction,
  fromWhole,
  areEqual,
} from '../../src/core/fractions';

describe('Wave 39 frac — perform divide steps', () => {
  it('divide steps include × reciprocal', () => {
    const a = createFraction(1, 2);
    const b = createFraction(1, 4);
    const r = performOperation(a, b, 'divide');
    expect(r.steps.some((s) => s.includes('×'))).toBe(true);
    expect(areEqual(r.result, fromWhole(2))).toBe(true);
  });

  it('zero divisor throws', () => {
    expect(() =>
      performOperation(createFraction(1, 2), fromWhole(0), 'divide')
    ).toThrow();
  });
});
