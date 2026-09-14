/**
 * Wave 39 — frac sum empty / average leftovers after #172/#173.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  sum,
  average,
  fromWhole,
  areEqual,
  createFraction,
} from '../../src/core/fractions';

describe('Wave 39 frac — sum empty average', () => {
  it('sum([]) ≡ fromWhole(0)', () => {
    expect(areEqual(sum([]), fromWhole(0))).toBe(true);
  });

  it('average([]) throws; single-element is identity', () => {
    expect(() => average([])).toThrow(/empty/i);
    const f = createFraction(3, 4);
    expect(areEqual(average([f]), f)).toBe(true);
  });
});
