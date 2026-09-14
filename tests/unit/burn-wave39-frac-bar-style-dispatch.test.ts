/**
 * Wave 39 — fraction bar style dispatch leftovers after #172/#173.
 * Beyond wave38 compare-equal. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  renderFractionBar,
  getFractionColor,
  injectFractionBarStyles,
  createFraction,
} from '../../src/core/fractions';

beforeEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fraction-bar-styles')?.remove();
});
afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fraction-bar-styles')?.remove();
});

describe('Wave 39 frac-bar — style dispatch', () => {
  it('routes horizontal / vertical / circle', () => {
    const f = createFraction(1, 3);
    const h = renderFractionBar(f, { style: 'horizontal' });
    const v = renderFractionBar(f, { style: 'vertical' });
    const c = renderFractionBar(f, { style: 'circle' });
    expect(h.tagName.toLowerCase()).toBe('svg');
    expect(v.tagName.toLowerCase()).toBe('svg');
    expect(c.tagName.toLowerCase()).toBe('svg');
    // circle typically has path or circle elements
    expect(c.querySelectorAll('circle, path').length).toBeGreaterThan(0);
  });

  it('getFractionColor fallback for unknown denom; inject styles once', () => {
    expect(getFractionColor(99)).toBe('#607d8b');
    injectFractionBarStyles();
    injectFractionBarStyles();
    expect(document.querySelectorAll('#fraction-bar-styles').length).toBe(1);
  });
});
