/**
 * Wave 35 — fraction-bar getFractionColor catalog × fallback matrix.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { getFractionColor } from '../../src/core/fractions/fraction-bar-ui';
import { FRACTION_COLORS } from '../../src/core/fractions/types';

describe('Wave 35 frac-bar-color-catalog', () => {
  it.each(Object.entries(FRACTION_COLORS).map(([d, c]) => [Number(d), c]))(
    'denominator %i maps to catalog color',
    (denom, color) => {
      expect(getFractionColor(denom)).toBe(color);
    }
  );

  it.each([0, 7, 9, 11, 13, 16, 100, -1, 9999])(
    'unknown denominator %i falls back to slate',
    (denom) => {
      expect(getFractionColor(denom)).toBe('#607d8b');
    }
  );
});

