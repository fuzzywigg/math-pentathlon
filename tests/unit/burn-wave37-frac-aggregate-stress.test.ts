/**
 * Wave 37 — sum/average/min/max stress leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  sum,
  average,
  min,
  max,
  areEqual,
  simplify,
  compare,
  COMMON_FRACTIONS,
  add,
  divide,
  fromWhole,
} from '../../src/core/fractions';

describe('Wave 37 frac-aggregate — stress', () => {
  it('sum of COMMON_FRACTIONS equals fold of add', () => {
    const total = sum(COMMON_FRACTIONS);
    let fold = fromWhole(0);
    for (const f of COMMON_FRACTIONS) fold = add(fold, f);
    expect(areEqual(simplify(total), simplify(fold))).toBe(true);
  });

  it('average equals sum / length', () => {
    const list = COMMON_FRACTIONS.slice(0, 9);
    const avg = average(list);
    const expected = divide(sum(list), fromWhole(list.length));
    expect(areEqual(simplify(avg), simplify(expected))).toBe(true);
  });

  it('min/max match compare extremes on commons', () => {
    const lo = min(...COMMON_FRACTIONS);
    const hi = max(...COMMON_FRACTIONS);
    for (const f of COMMON_FRACTIONS) {
      expect(compare(lo, f)).toBeLessThanOrEqual(0);
      expect(compare(hi, f)).toBeGreaterThanOrEqual(0);
    }
  });

  it('average([]) throws', () => {
    expect(() => average([])).toThrow();
  });
});
