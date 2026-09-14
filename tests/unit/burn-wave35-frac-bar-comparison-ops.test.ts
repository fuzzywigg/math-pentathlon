/**
 * Wave 35 — renderFractionComparison operator matrix + style passthrough.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { renderFractionComparison } from '../../src/core/fractions/fraction-bar-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 35 frac-bar-comparison-ops', () => {
  it.each([
    [1, 4, 1, 2, '<'],
    [1, 2, 1, 4, '>'],
    [1, 2, 2, 4, '='],
    [0, 5, 0, 3, '='],
    [3, 4, 5, 8, '>'],
    [1, 8, 1, 3, '<'],
    [7, 8, 7, 8, '='],
  ])('%i/%i vs %i/%i → %s', (an, ad, bn, bd, op) => {
    const el = renderFractionComparison(
      { numerator: an, denominator: ad },
      { numerator: bn, denominator: bd }
    );
    expect(el.classList.contains('fraction-comparison')).toBe(true);
    expect(el.querySelector('.operator')?.textContent).toBe(op);
    expect(el.querySelectorAll('svg')).toHaveLength(2);
  });

  it('passes style config to both bars', () => {
    const el = renderFractionComparison(
      { numerator: 1, denominator: 3 },
      { numerator: 2, denominator: 3 },
      { style: 'circle', showLabel: false, width: 40, height: 40 }
    );
    const svgs = el.querySelectorAll('svg');
    expect(svgs[0].classList.contains('fraction-bar-circle')).toBe(true);
    expect(svgs[1].classList.contains('fraction-bar-circle')).toBe(true);
  });

  it('vertical comparison embeds vertical bars', () => {
    const el = renderFractionComparison(
      { numerator: 1, denominator: 5 },
      { numerator: 4, denominator: 5 },
      { style: 'vertical', showLabel: false }
    );
    for (const svg of el.querySelectorAll('svg')) {
      expect(svg.classList.contains('fraction-bar-vertical')).toBe(true);
    }
  });
});

