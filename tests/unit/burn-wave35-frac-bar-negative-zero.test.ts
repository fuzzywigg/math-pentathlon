/**
 * Wave 35 — zero / whole / negative-flag fractions render without throw.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  renderHorizontalBar,
  renderVerticalBar,
  renderCircleBar,
  renderFractionComparison,
} from '../../src/core/fractions/fraction-bar-ui';

describe('Wave 35 frac-bar-negative-zero', () => {
  it('zero fractions render across styles', () => {
    for (const styleFn of [renderHorizontalBar, renderVerticalBar, renderCircleBar]) {
      const svg = styleFn(
        { numerator: 0, denominator: 8 },
        { showLabel: true, labelPosition: styleFn === renderVerticalBar ? 'right' : 'below', width: 60, height: 60 }
      );
      expect(svg.querySelector('text')?.textContent).toMatch(/0/);
    }
  });

  it('whole ones render full fill', () => {
    const h = renderHorizontalBar(
      { numerator: 1, denominator: 1 },
      { showLabel: false, width: 100 }
    );
    expect(h.querySelectorAll('rect')).toHaveLength(2);
    expect(h.querySelectorAll('rect')[1].getAttribute('clip-path')).toBeNull();
  });

  it('isNegative flag still renders comparable decimals via toDecimal path', () => {
    // comparison uses toDecimal; negative flag should not throw
    const el = renderFractionComparison(
      { numerator: 1, denominator: 2, isNegative: true },
      { numerator: 1, denominator: 4, isNegative: false },
      { showLabel: false }
    );
    expect(el.querySelector('.operator')?.textContent).toBeTruthy();
  });
});

