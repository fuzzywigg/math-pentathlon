/**
 * Wave 35 — circle color merge + path/full fill catalog fallback.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { renderCircleBar } from '../../src/core/fractions/fraction-bar-ui';
import { FRACTION_COLORS } from '../../src/core/fractions/types';

describe('Wave 35 frac-bar-circle-colors', () => {
  it('custom colors tint bg stroke path and rays', () => {
    const svg = renderCircleBar(
      { numerator: 1, denominator: 4 },
      {
        width: 80,
        height: 80,
        showLabel: false,
        colors: { empty: '#111', border: '#eee', filled: '#0ff' },
      }
    );
    const bg = svg.querySelector('circle');
    expect(bg?.getAttribute('fill')).toBe('#111');
    expect(bg?.getAttribute('stroke')).toBe('#eee');
    expect(svg.querySelector('path')?.getAttribute('fill')).toBe('#0ff');
    expect(svg.querySelector('line')?.getAttribute('stroke')).toBe('#eee');
  });

  it('partial colors keep default filled on path', () => {
    const svg = renderCircleBar(
      { numerator: 1, denominator: 5 },
      {
        width: 80,
        height: 80,
        showLabel: false,
        colors: { empty: '#fff', border: '#000' },
      }
    );
    expect(svg.querySelector('path')?.getAttribute('fill')).toBe('#2196f3');
  });

  it('falsy filled on partial uses catalog', () => {
    const svg = renderCircleBar(
      { numerator: 1, denominator: 5 },
      {
        width: 80,
        height: 80,
        showLabel: false,
        colors: { empty: '#fff', border: '#000', filled: '' },
      }
    );
    expect(svg.querySelector('path')?.getAttribute('fill')).toBe(
      FRACTION_COLORS[5]
    );
  });

  it('falsy filled on full circle uses catalog', () => {
    const svg = renderCircleBar(
      { numerator: 4, denominator: 4 },
      {
        width: 60,
        height: 60,
        showLabel: false,
        colors: { empty: '#fff', border: '#000', filled: '' },
      }
    );
    const fill = svg.querySelectorAll('circle')[1];
    expect(fill.getAttribute('fill')).toBe(FRACTION_COLORS[1]);
  });
});

