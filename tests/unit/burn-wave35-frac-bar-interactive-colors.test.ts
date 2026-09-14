/**
 * Wave 35 — interactive color config edges + wrapper chrome (jsdom-observable).
 * Segment cssText is not applied by jsdom when border-right+display combine;
 * assert wrapper border + callback wiring instead. Tests-only.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import { createInteractiveFractionBar } from '../../src/core/fractions/fraction-bar-ui';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 35 frac-bar-interactive-colors', () => {
  it('custom border paints wrapper chrome', () => {
    const bar = createInteractiveFractionBar(
      { numerator: 2, denominator: 4 },
      4,
      () => {},
      {
        width: 202,
        height: 42,
        colors: { filled: '#111', empty: '#eee', border: '#f00' },
      }
    );
    expect(bar.style.border).toContain('rgb(255, 0, 0)');
    expect(bar.style.display).toBe('inline-flex');
    expect(bar.querySelectorAll('.fraction-segment')).toHaveLength(4);
  });

  it('default border uses #333 when colors omitted', () => {
    const bar = createInteractiveFractionBar(
      { numerator: 1, denominator: 3 },
      3,
      () => {}
    );
    expect(bar.style.border).toContain('rgb(51, 51, 51)');
  });

  it('partial colors still wire clicks with matching denom', () => {
    const seen: Array<{ numerator: number; denominator: number }> = [];
    const bar = createInteractiveFractionBar(
      { numerator: 1, denominator: 3 },
      3,
      (f) => seen.push(f),
      { colors: { empty: '#ccc', border: '#000' } }
    );
    expect(bar.style.border).toContain('rgb(0, 0, 0)');
    const segments = bar.querySelectorAll('.fraction-segment');
    (segments[2] as HTMLElement).click();
    expect(seen).toEqual([{ numerator: 3, denominator: 3 }]);
  });

  it('width/height config accepted without throw for many denoms', () => {
    for (const denom of [1, 2, 4, 6, 8, 12]) {
      const bar = createInteractiveFractionBar(
        { numerator: Math.min(1, denom), denominator: denom },
        denom,
        () => {},
        { width: 100 + denom, height: 20 + denom, colors: { filled: '#0a0' } }
      );
      expect(bar.querySelectorAll('.fraction-segment')).toHaveLength(denom);
    }
  });
});
