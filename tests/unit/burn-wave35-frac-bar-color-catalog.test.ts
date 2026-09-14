/**
 * Wave 35 — fraction-bar getFractionColor catalog + fallback matrix.
 * Leftover after wave 21 color smoke. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { getFractionColor } from '../../src/core/fractions/fraction-bar-ui';
import { FRACTION_COLORS } from '../../src/core/fractions/types';

describe('Wave 35 frac-bar-color — catalog hits', () => {
  it.each(Object.entries(FRACTION_COLORS).map(([d, c]) => [Number(d), c]))(
    'denominator %i maps to catalog color %s',
    (den, color) => {
      expect(getFractionColor(den)).toBe(color);
    }
  );
});

describe('Wave 35 frac-bar-color — fallbacks', () => {
  it.each([0, 7, 9, 11, 13, 16, 24, 100, 999, -1, 1.5])(
    'unknown denominator %s falls back to slate',
    (den) => {
      expect(getFractionColor(den)).toBe('#607d8b');
    }
  );

  it('catalog keys are the only non-fallback positives under 13 except gaps', () => {
    for (let d = 1; d <= 12; d++) {
      const got = getFractionColor(d);
      if (FRACTION_COLORS[d]) {
        expect(got).toBe(FRACTION_COLORS[d]);
      } else {
        expect(got).toBe('#607d8b');
      }
    }
  });
});
