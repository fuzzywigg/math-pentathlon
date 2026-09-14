/**
 * Wave 35 — createInteractiveFractionBar click/hover leftover matrix.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import { createInteractiveFractionBar } from '../../src/core/fractions/fraction-bar-ui';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 35 frac-bar-interactive — segment click matrix', () => {
  it.each([2, 3, 4, 5, 6, 8, 10, 12])(
    'denominator %i yields den segments and click sets numerator i+1',
    (den) => {
      const seen: Array<{ numerator: number; denominator: number }> = [];
      const bar = createInteractiveFractionBar(
        { numerator: 0, denominator: den },
        den,
        (f) => seen.push(f),
        { width: 200, height: 30 }
      );
      const segments = [
        ...bar.querySelectorAll('.fraction-segment'),
      ] as HTMLElement[];
      expect(segments).toHaveLength(den);
      segments[den - 1].click();
      expect(seen.at(-1)).toEqual({ numerator: den, denominator: den });
      segments[0].click();
      expect(seen.at(-1)).toEqual({ numerator: 1, denominator: den });
    }
  );

  it('pre-filled numerator does not change segment count or click targets', () => {
    const seen: number[] = [];
    const bar = createInteractiveFractionBar(
      { numerator: 2, denominator: 4 },
      4,
      (f) => seen.push(f.numerator),
      { colors: { filled: '#111', empty: '#eee', border: '#000' }, width: 120 }
    );
    const segments = [
      ...bar.querySelectorAll('.fraction-segment'),
    ] as HTMLElement[];
    expect(segments).toHaveLength(4);
    // click last segment → numerator 4 regardless of initial fill
    segments[3].click();
    expect(seen).toEqual([4]);
    segments[1].click();
    expect(seen).toEqual([4, 2]);
  });

  it('hover highlights prefix opacity then restores on leave', () => {
    const bar = createInteractiveFractionBar(
      { numerator: 1, denominator: 5 },
      5,
      () => {}
    );
    const segments = [
      ...bar.querySelectorAll('.fraction-segment'),
    ] as HTMLElement[];
    segments[2].dispatchEvent(new Event('mouseenter'));
    expect(segments[0].style.opacity).toBe('0.8');
    expect(segments[1].style.opacity).toBe('0.8');
    expect(segments[2].style.opacity).toBe('0.8');
    expect(segments[3].style.opacity).toBe('');
    segments[2].dispatchEvent(new Event('mouseleave'));
    for (const s of segments) {
      expect(s.style.opacity).toBe('1');
    }
  });

  it('wrapper carries interactive class and border styling', () => {
    const bar = createInteractiveFractionBar(
      { numerator: 1, denominator: 3 },
      3,
      () => {},
      { colors: { border: '#abc' } }
    );
    expect(bar.classList.contains('interactive-fraction-bar')).toBe(true);
    // jsdom normalizes #abc → rgb(170, 187, 204)
    expect(bar.style.border).toMatch(/rgb\(170,\s*187,\s*204\)|#abc/);
    expect(bar.style.display).toBe('inline-flex');
  });
});
