/**
 * Wave 35 — circle fillRatio=0.5 largeArc boundary + half-path geometry.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { renderCircleBar } from '../../src/core/fractions/fraction-bar-ui';

describe('Wave 35 frac-bar-circle-half-boundary', () => {
  it('exactly half uses largeArc=0 (fillRatio > 0.5 is false)', () => {
    const svg = renderCircleBar(
      { numerator: 1, denominator: 2 },
      { width: 100, height: 100, showLabel: false }
    );
    const d = svg.querySelector('path')?.getAttribute('d') ?? '';
    expect(d).toMatch(/0 0 1 /);
  });

  it.each([
    [1, 3],
    [2, 5],
    [3, 7],
    [5, 12],
  ])('%i/%i below half keeps small arc', (n, d) => {
    const svg = renderCircleBar(
      { numerator: n, denominator: d },
      { width: 80, height: 80, showLabel: false }
    );
    expect(svg.querySelector('path')?.getAttribute('d') ?? '').toMatch(
      /0 0 1 /
    );
  });

  it.each([
    [2, 3],
    [3, 5],
    [5, 8],
    [7, 12],
  ])('%i/%i above half uses large arc', (n, d) => {
    const svg = renderCircleBar(
      { numerator: n, denominator: d },
      { width: 80, height: 80, showLabel: false }
    );
    expect(svg.querySelector('path')?.getAttribute('d') ?? '').toMatch(
      /0 1 1 /
    );
  });
});
