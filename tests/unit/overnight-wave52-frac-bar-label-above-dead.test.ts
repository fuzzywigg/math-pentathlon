/**
 * Overnight HEAVY leftover after #234 — fraction-bar labelPosition 'above' dead branch.
 * Prior dead-branch tests covered right/inside/below only — never 'above'. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  renderHorizontalBar,
  renderVerticalBar,
  renderCircleBar,
} from '../../src/core/fractions/fraction-bar-ui';
import { createFraction } from '../../src/core/fractions/arithmetic';

describe('Wave 52 frac-bar — labelPosition above', () => {
  it('omits text for above on horizontal/vertical/circle despite showLabel', () => {
    const f = createFraction(2, 5);
    // 'above' is outside the public union — residual dead branch at runtime
    const above = 'above' as 'inside' | 'below' | 'right';
    expect(
      renderHorizontalBar(f, { showLabel: true, labelPosition: above }).querySelector(
        'text'
      )
    ).toBeNull();
    expect(
      renderVerticalBar(f, {
        showLabel: true,
        labelPosition: above,
        width: 40,
        height: 120,
      }).querySelector('text')
    ).toBeNull();
    expect(
      renderCircleBar(f, {
        showLabel: true,
        labelPosition: above,
        width: 80,
        height: 80,
      }).querySelector('text')
    ).toBeNull();
  });
});
