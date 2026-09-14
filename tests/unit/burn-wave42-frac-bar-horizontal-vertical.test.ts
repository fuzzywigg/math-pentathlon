/**
 * Wave 42 — horizontal vs vertical fraction bar leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  createFraction,
  renderHorizontalBar,
  renderVerticalBar,
  renderFractionBar,
} from '../../src/core/fractions';

beforeEach(() => {
  document.body.innerHTML = '';
});
afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 42 frac-bar — horizontal vertical', () => {
  const f = createFraction(1, 4);

  it('horizontal bar has horizontal class', () => {
    const svg = renderHorizontalBar(f);
    expect(svg.classList.contains('fraction-bar-horizontal')).toBe(true);
    expect(svg.querySelectorAll('rect').length).toBeGreaterThan(0);
  });

  it('vertical bar has vertical class', () => {
    const svg = renderVerticalBar(f);
    expect(svg.classList.contains('fraction-bar-vertical')).toBe(true);
  });

  it('renderFractionBar style routes match dedicated renderers', () => {
    const h = renderFractionBar(f, { style: 'horizontal' });
    const v = renderFractionBar(f, { style: 'vertical' });
    expect(h.getAttribute('class')).toContain('horizontal');
    expect(v.getAttribute('class')).toContain('vertical');
  });

  it('custom width/height applied to horizontal svg', () => {
    const svg = renderHorizontalBar(f, { width: 120, height: 30, showLabel: false });
    expect(svg.getAttribute('width')).toBe('120');
  });

  it('zero numerator still renders empty track', () => {
    const svg = renderHorizontalBar(createFraction(0, 5), { showLabel: false });
    expect(svg.querySelectorAll('rect').length).toBeGreaterThan(0);
  });
});
