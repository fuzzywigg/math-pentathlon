/**
 * Wave 35 — export barrel re-exports fraction-bar-ui symbols.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import * as barrel from '../../src/core/fractions';
import * as direct from '../../src/core/fractions/fraction-bar-ui';

describe('Wave 35 frac-bar-barrel-exports', () => {
  it('barrel exposes all public fraction-bar-ui functions', () => {
    const names = [
      'getFractionColor',
      'renderHorizontalBar',
      'renderVerticalBar',
      'renderCircleBar',
      'renderFractionBar',
      'createInteractiveFractionBar',
      'createFractionBarPiece',
      'getFractionBarStyles',
      'injectFractionBarStyles',
      'renderFractionComparison',
    ] as const;

    for (const name of names) {
      expect(typeof barrel[name]).toBe('function');
      expect(barrel[name]).toBe(direct[name]);
    }
  });

  it('barrel still exposes arithmetic + types used by bars', () => {
    expect(typeof barrel.simplify).toBe('function');
    expect(typeof barrel.toDecimal).toBe('function');
    expect(typeof barrel.formatFraction).toBe('function');
    expect(barrel.FRACTION_COLORS[2]).toBeTruthy();
    expect(Array.isArray(barrel.COMMON_FRACTIONS)).toBe(true);
  });
});
