/**
 * Wave 42 — getFractionColor catalog dispatch leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getFractionColor } from '../../src/core/fractions/fraction-bar-ui';
import { FRACTION_COLORS } from '../../src/core/fractions/types';

describe('Wave 42 frac-bar — color dispatch', () => {
  it('every FRACTION_COLORS entry dispatches exactly', () => {
    for (const [den, color] of Object.entries(FRACTION_COLORS)) {
      expect(getFractionColor(Number(den))).toBe(color);
    }
  });

  it('unknown denominators fall back to slate #607d8b', () => {
    for (const d of [0, 7, 11, 99, -3]) {
      expect(getFractionColor(d)).toBe('#607d8b');
    }
  });

  it('halves and thirds are distinct colors', () => {
    expect(getFractionColor(2)).not.toBe(getFractionColor(3));
  });

  it('catalog values are non-empty hex-like strings', () => {
    for (const color of Object.values(FRACTION_COLORS)) {
      expect(color.startsWith('#')).toBe(true);
      expect(color.length).toBeGreaterThanOrEqual(4);
    }
  });
});
