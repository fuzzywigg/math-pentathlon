/**
 * Wave 35 — horizontal custom colors + filled fallback via getFractionColor.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { renderHorizontalBar } from '../../src/core/fractions/fraction-bar-ui';
import { FRACTION_COLORS } from '../../src/core/fractions/types';

describe('Wave 35 frac-bar-horiz-colors', () => {
  it('custom empty/border/filled paint bg and fill', () => {
    const svg = renderHorizontalBar(
      { numerator: 1, denominator: 2 },
      {
        showLabel: false,
        colors: { empty: '#aaa', border: '#111', filled: '#0f0' },
      }
    );
    const [bg, fill] = Array.from(svg.querySelectorAll('rect'));
    expect(bg.getAttribute('fill')).toBe('#aaa');
    expect(bg.getAttribute('stroke')).toBe('#111');
    expect(fill.getAttribute('fill')).toBe('#0f0');
  });

  it('partial colors keep default filled from deep-merge', () => {
    const svg = renderHorizontalBar(
      { numerator: 2, denominator: 4 },
      { showLabel: false, colors: { empty: '#eee', border: '#000' } }
    );
    const fill = svg.querySelectorAll('rect')[1];
    expect(fill.getAttribute('fill')).toBe('#2196f3');
  });

  it('falsy filled falls through to catalog after simplify', () => {
    const svg = renderHorizontalBar(
      { numerator: 2, denominator: 4 },
      {
        showLabel: false,
        colors: { empty: '#eee', border: '#000', filled: '' },
      }
    );
    const fill = svg.querySelectorAll('rect')[1];
    expect(fill.getAttribute('fill')).toBe(FRACTION_COLORS[2]);
  });

  it('partial colors merge with defaults', () => {
    const svg = renderHorizontalBar(
      { numerator: 1, denominator: 3 },
      { showLabel: false, colors: { filled: '#abc' } }
    );
    const [bg, fill] = Array.from(svg.querySelectorAll('rect'));
    expect(bg.getAttribute('fill')).toBe('#e0e0e0');
    expect(bg.getAttribute('stroke')).toBe('#333');
    expect(fill.getAttribute('fill')).toBe('#abc');
  });
});

