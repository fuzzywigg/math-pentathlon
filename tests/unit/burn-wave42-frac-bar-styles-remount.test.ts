/**
 * Wave 42 — injectFractionBarStyles remount / idempotency leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  injectFractionBarStyles,
  getFractionBarStyles,
  renderFractionBar,
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

describe('Wave 42 frac-bar — styles remount', () => {
  it('inject once creates style tag', () => {
    injectFractionBarStyles();
    const el = document.getElementById('fraction-bar-styles');
    expect(el).toBeTruthy();
    expect(el?.tagName.toLowerCase()).toBe('style');
  });

  it('inject twice does not duplicate', () => {
    injectFractionBarStyles();
    injectFractionBarStyles();
    injectFractionBarStyles();
    expect(document.querySelectorAll('#fraction-bar-styles').length).toBe(1);
  });

  it('getFractionBarStyles returns CSS with fraction-bar selectors', () => {
    const css = getFractionBarStyles();
    expect(css).toMatch(/fraction-bar/);
    expect(css.length).toBeGreaterThan(20);
  });

  it('re-inject after remove restores single tag', () => {
    injectFractionBarStyles();
    document.getElementById('fraction-bar-styles')?.remove();
    injectFractionBarStyles();
    expect(document.querySelectorAll('#fraction-bar-styles').length).toBe(1);
  });

  it('render still works after style injection', () => {
    injectFractionBarStyles();
    const svg = renderFractionBar(createFraction(2, 5), { style: 'circle' });
    expect(svg.tagName.toLowerCase()).toBe('svg');
  });
});
