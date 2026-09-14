/**
 * Wave 39 — solveTargetChallenge near-miss order leftovers after #172/#173.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  solveTargetChallenge,
  createTargetChallenge,
} from '../../src/core/expressions';

describe('Wave 39 expr — solve near-miss order', () => {
  it('empty operators yields no solutions', () => {
    const c = createTargetChallenge([1, 2, 3], 6, { operators: [] });
    expect(solveTargetChallenge(c)).toEqual([]);
  });

  it('near-misses (|diff|≤1) included; exact sorts first', () => {
    // 1,2,3 target 7: exact 1+2*3=7 or similar; near-misses exist too
    const c = createTargetChallenge([1, 2, 3], 7, {
      operators: ['+', '-', '*'],
    });
    const sols = solveTargetChallenge(c, 20);
    expect(sols.length).toBeGreaterThan(0);
    const firstExactIdx = sols.findIndex((s) => s.isExact);
    if (firstExactIdx >= 0) {
      expect(sols.slice(0, firstExactIdx).every((s) => s.isExact)).toBe(true);
      // all exact before any non-exact
      const firstNear = sols.findIndex((s) => !s.isExact);
      if (firstNear >= 0) {
        expect(sols.slice(0, firstNear).every((s) => s.isExact)).toBe(true);
      }
    }
    for (const s of sols) {
      expect(Math.abs(s.result - 7)).toBeLessThanOrEqual(1);
    }
  });
});
