/**
 * Wave 35 — vertical color merge + catalog filled fallback + border stroke.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { renderVerticalBar } from '../../src/core/fractions/fraction-bar-ui';
import { FRACTION_COLORS } from '../../src/core/fractions/types';

describe('Wave 35 frac-bar-vert-colors', () => {
  it('custom palette paints bg stroke and fill', () => {
    const svg = renderVerticalBar(
      { numerator: 1, denominator: 2 },
      {
        showLabel: false,
        colors: { empty: '#fed', border: '#321', filled: '#abc' },
      }
    );
    const [bg, fill] = Array.from(svg.querySelectorAll('rect'));
    expect(bg.getAttribute('fill')).toBe('#fed');
    expect(bg.getAttribute('stroke')).toBe('#321');
    expect(fill.getAttribute('fill')).toBe('#abc');
    const line = svg.querySelector('line');
    expect(line?.getAttribute('stroke')).toBe('#321');
  });

  it('partial colors keep default filled from deep-merge', () => {
    const svg = renderVerticalBar(
      { numerator: 3, denominator: 6 },
      { showLabel: false, colors: { empty: '#fff', border: '#000' } }
    );
    expect(svg.querySelectorAll('rect')[1].getAttribute('fill')).toBe(
      '#2196f3'
    );
  });

  it('falsy filled falls through to catalog after simplify', () => {
    const svg = renderVerticalBar(
      { numerator: 3, denominator: 6 },
      {
        showLabel: false,
        colors: { empty: '#fff', border: '#000', filled: '' },
      }
    );
    expect(svg.querySelectorAll('rect')[1].getAttribute('fill')).toBe(
      FRACTION_COLORS[2]
    );
  });
});

