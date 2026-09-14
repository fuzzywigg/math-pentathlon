/**
 * Wave 35 — renderFractionBar style dispatch × COMMON_FRACTIONS smoke.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { renderFractionBar } from '../../src/core/fractions/fraction-bar-ui';
import { COMMON_FRACTIONS } from '../../src/core/fractions/types';

describe('Wave 35 frac-bar-dispatch-matrix', () => {
  it.each([
    [undefined, 'fraction-bar-horizontal'],
    ['horizontal', 'fraction-bar-horizontal'],
    ['vertical', 'fraction-bar-vertical'],
    ['circle', 'fraction-bar-circle'],
  ] as const)('style %s → class %s', (style, cls) => {
    const svg = renderFractionBar(
      { numerator: 1, denominator: 2 },
      style === undefined ? {} : { style }
    );
    expect(svg.classList.contains(cls)).toBe(true);
  });

  it('COMMON_FRACTIONS render under each style without throw', () => {
    for (const frac of COMMON_FRACTIONS) {
      for (const style of ['horizontal', 'vertical', 'circle'] as const) {
        const svg = renderFractionBar(frac, { style, showLabel: false });
        expect(svg.tagName.toLowerCase()).toBe('svg');
        expect(svg.classList.contains(`fraction-bar-${style}`)).toBe(true);
      }
    }
  });
});

