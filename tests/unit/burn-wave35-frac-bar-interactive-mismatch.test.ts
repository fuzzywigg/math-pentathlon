/**
 * Wave 35 — interactive numerator vs segment-count mismatch edges.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import { createInteractiveFractionBar } from '../../src/core/fractions/fraction-bar-ui';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 35 frac-bar-interactive-mismatch', () => {
  it('segment count follows denominator arg, not fraction.denominator', () => {
    const bar = createInteractiveFractionBar(
      { numerator: 1, denominator: 2 },
      8,
      () => {}
    );
    expect(bar.querySelectorAll('.fraction-segment')).toHaveLength(8);
  });

  it('click reports denominator arg even when fraction.denominator differs', () => {
    const seen: Array<{ numerator: number; denominator: number }> = [];
    const bar = createInteractiveFractionBar(
      { numerator: 3, denominator: 4 },
      6,
      (f) => seen.push(f)
    );
    (bar.querySelectorAll('.fraction-segment')[1] as HTMLElement).click();
    expect(seen).toEqual([{ numerator: 2, denominator: 6 }]);
  });

  it('numerator larger than denom paints via i < numerator for all segs', () => {
    // All segments considered filled for paint path; still clickable
    const seen: number[] = [];
    const bar = createInteractiveFractionBar(
      { numerator: 10, denominator: 3 },
      3,
      (f) => seen.push(f.numerator)
    );
    expect(bar.querySelectorAll('.fraction-segment')).toHaveLength(3);
    (bar.querySelectorAll('.fraction-segment')[0] as HTMLElement).click();
    expect(seen).toEqual([1]);
  });

  it('hover last segment dims all when denom=1', () => {
    const bar = createInteractiveFractionBar(
      { numerator: 1, denominator: 1 },
      1,
      () => {}
    );
    const seg = bar.querySelector('.fraction-segment') as HTMLElement;
    seg.dispatchEvent(new Event('mouseenter'));
    expect(seg.style.opacity).toBe('0.8');
    seg.dispatchEvent(new Event('mouseleave'));
    expect(seg.style.opacity).toBe('1');
  });
});
