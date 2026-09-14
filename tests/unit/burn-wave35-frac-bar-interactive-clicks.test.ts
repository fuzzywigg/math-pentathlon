/**
 * Wave 35 — interactive click matrix across denominators and indices.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import { createInteractiveFractionBar } from '../../src/core/fractions/fraction-bar-ui';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 35 frac-bar-interactive-clicks', () => {
  it.each([
    [2, 0, 1],
    [2, 1, 2],
    [5, 0, 1],
    [5, 4, 5],
    [8, 3, 4],
    [12, 11, 12],
  ])('denom %i click index %i → numerator %i', (denom, idx, num) => {
    const seen: Array<{ numerator: number; denominator: number }> = [];
    const bar = createInteractiveFractionBar(
      { numerator: 0, denominator: denom },
      denom,
      (f) => seen.push(f)
    );
    const segments = bar.querySelectorAll('.fraction-segment');
    expect(segments).toHaveLength(denom);
    (segments[idx] as HTMLElement).click();
    expect(seen).toEqual([{ numerator: num, denominator: denom }]);
  });

  it('multiple clicks accumulate callbacks in order', () => {
    const seen: number[] = [];
    const bar = createInteractiveFractionBar(
      { numerator: 1, denominator: 3 },
      3,
      (f) => seen.push(f.numerator)
    );
    const segments = bar.querySelectorAll('.fraction-segment');
    (segments[0] as HTMLElement).click();
    (segments[2] as HTMLElement).click();
    (segments[1] as HTMLElement).click();
    expect(seen).toEqual([1, 3, 2]);
  });
});

