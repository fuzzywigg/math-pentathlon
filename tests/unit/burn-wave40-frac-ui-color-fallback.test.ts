/**
 * Wave 40 — frac-ui unknown denom color fallback + showLabel false + circle extremes.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createFraction,
  FRACTION_COLORS,
  getFractionColor,
  renderHorizontalBar,
  renderCircleBar,
  renderFractionBar,
  injectFractionBarStyles,
} from '../../src/core/fractions';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fraction-bar-styles')?.remove();
});

describe('Wave 40 frac-ui — color fallback + label/circle extremes', () => {
  it('unknown denominators fall back to #607d8b', () => {
    for (const den of [7, 9, 11, 13, 99, 0, -3]) {
      expect(getFractionColor(den)).toBe('#607d8b');
    }
  });

  it('catalog denominators map to FRACTION_COLORS entries', () => {
    for (const [den, color] of Object.entries(FRACTION_COLORS)) {
      expect(getFractionColor(Number(den))).toBe(color);
    }
  });

  it('showLabel false omits text nodes on horizontal and circle', () => {
    const f = createFraction(1, 2);
    const h = renderHorizontalBar(f, { showLabel: false, width: 100, height: 20 });
    expect(h.querySelector('text')).toBeNull();
    const c = renderCircleBar(f, {
      showLabel: false,
      width: 60,
      height: 60,
    });
    expect(c.querySelector('text')).toBeNull();
  });

  it('circle extremes: empty (0) has no fill slice; full (1) fills solid circle', () => {
    const empty = renderCircleBar(createFraction(0, 4), {
      showLabel: false,
      width: 80,
      height: 80,
      colors: { filled: '#abc123', empty: '#eee', border: '#000' },
    });
    expect(empty.querySelector('path')).toBeNull();
    expect(empty.querySelectorAll('circle').length).toBe(1);

    const full = renderCircleBar(createFraction(4, 4), {
      showLabel: false,
      width: 80,
      height: 80,
      colors: { filled: '#abc123', empty: '#eee', border: '#000' },
    });
    const circles = [...full.querySelectorAll('circle')];
    expect(circles.length).toBeGreaterThanOrEqual(2);
    expect(circles.some((c) => c.getAttribute('fill') === '#abc123')).toBe(
      true
    );
  });

  it('injectFractionBarStyles is idempotent', () => {
    injectFractionBarStyles();
    injectFractionBarStyles();
    expect(document.querySelectorAll('#fraction-bar-styles')).toHaveLength(1);
  });

  it('renderFractionBar default style is horizontal', () => {
    const svg = renderFractionBar(createFraction(1, 3), { showLabel: false });
    expect(svg.classList.contains('fraction-bar-horizontal')).toBe(true);
  });
});
