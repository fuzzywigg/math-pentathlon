/**
 * Wave 35 — SVG viewBox/class attributes across style × label growth.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  renderHorizontalBar,
  renderVerticalBar,
  renderCircleBar,
} from '../../src/core/fractions/fraction-bar-ui';

describe('Wave 35 frac-bar-viewbox-attrs', () => {
  it('horizontal below expands viewBox height', () => {
    const svg = renderHorizontalBar(
      { numerator: 1, denominator: 2 },
      { width: 200, height: 40, showLabel: true, labelPosition: 'below' }
    );
    expect(svg.getAttribute('viewBox')).toBe('0 0 200 65');
    expect(svg.getAttribute('class')).toContain('fraction-bar-horizontal');
  });

  it('vertical right expands viewBox width', () => {
    const svg = renderVerticalBar(
      { numerator: 1, denominator: 2 },
      { width: 30, height: 90, showLabel: true, labelPosition: 'right' }
    );
    expect(svg.getAttribute('viewBox')).toBe('0 0 70 90');
    expect(svg.getAttribute('class')).toContain('fraction-bar-vertical');
  });

  it('circle below expands viewBox on min size', () => {
    const svg = renderCircleBar(
      { numerator: 1, denominator: 2 },
      { width: 70, height: 90, showLabel: true, labelPosition: 'below' }
    );
    expect(svg.getAttribute('viewBox')).toBe('0 0 70 95');
    expect(svg.getAttribute('class')).toContain('fraction-bar-circle');
  });
});

