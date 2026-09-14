/**
 * Wave 35 — width/height override matrix across renderers.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  renderHorizontalBar,
  renderVerticalBar,
  renderCircleBar,
} from '../../src/core/fractions/fraction-bar-ui';

describe('Wave 35 frac-bar-size-matrix', () => {
  it.each([
    [80, 20],
    [160, 32],
    [240, 48],
    [50, 50],
  ])('horizontal width=%i height=%i', (w, h) => {
    const svg = renderHorizontalBar(
      { numerator: 1, denominator: 2 },
      { width: w, height: h, showLabel: false }
    );
    expect(Number(svg.getAttribute('width'))).toBe(w);
    expect(Number(svg.getAttribute('height'))).toBe(h);
    expect(svg.getAttribute('viewBox')).toBe(`0 0 ${w} ${h}`);
  });

  it.each([
    [20, 100],
    [40, 160],
  ])('vertical width=%i height=%i without label', (w, h) => {
    const svg = renderVerticalBar(
      { numerator: 1, denominator: 3 },
      { width: w, height: h, showLabel: false }
    );
    expect(Number(svg.getAttribute('width'))).toBe(w);
    expect(Number(svg.getAttribute('height'))).toBe(h);
  });

  it('circle uses min(width,height) for square canvas', () => {
    const svg = renderCircleBar(
      { numerator: 1, denominator: 2 },
      { width: 120, height: 40, showLabel: false }
    );
    expect(Number(svg.getAttribute('width'))).toBe(40);
    expect(Number(svg.getAttribute('height'))).toBe(40);
  });
});

