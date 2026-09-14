/**
 * Wave 38 — fraction min/max empty reduce leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  min,
  max,
  createFraction,
  fromWhole,
  areEqual,
} from '../../src/core/fractions';

describe('Wave 38 frac-minmax — empty / identity', () => {
  it('min/max with no args throw via reduce on empty', () => {
    expect(() => min()).toThrow();
    expect(() => max()).toThrow();
  });

  it('single-arg min/max are identity', () => {
    const f = createFraction(3, 7);
    expect(areEqual(min(f), f)).toBe(true);
    expect(areEqual(max(f), f)).toBe(true);
  });

  it('min/max among mixed signs pick extremes', () => {
    const a = fromWhole(-2);
    const b = createFraction(1, 2);
    const c = fromWhole(3);
    expect(areEqual(min(a, b, c), a)).toBe(true);
    expect(areEqual(max(a, b, c), c)).toBe(true);
  });
});
