/**
 * Wave 35 — label text uses simplify() across reducible fractions.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  renderHorizontalBar,
  renderVerticalBar,
  renderCircleBar,
} from '../../src/core/fractions/fraction-bar-ui';

describe('Wave 35 frac-bar-simplify-labels', () => {
  it.each([
    [2, 4, '1/2'],
    [3, 6, '1/2'],
    [4, 8, '1/2'],
    [2, 6, '1/3'],
    [3, 9, '1/3'],
    [4, 6, '2/3'],
    [6, 8, '3/4'],
    [5, 10, '1/2'],
    [8, 12, '2/3'],
  ])('%i/%i labels as %s on all styles', (n, d, label) => {
    const h = renderHorizontalBar(
      { numerator: n, denominator: d },
      { showLabel: true, labelPosition: 'below' }
    );
    expect(h.querySelector('text')?.textContent).toBe(label);

    const v = renderVerticalBar(
      { numerator: n, denominator: d },
      { showLabel: true, labelPosition: 'right' }
    );
    expect(v.querySelector('text')?.textContent).toBe(label);

    const c = renderCircleBar(
      { numerator: n, denominator: d },
      { showLabel: true, labelPosition: 'below', width: 60, height: 60 }
    );
    expect(c.querySelector('text')?.textContent).toBe(label);
  });
});

