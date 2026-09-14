/**
 * Wave 35 — interactive segment mouseenter/mouseleave opacity leftover paths.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import { createInteractiveFractionBar } from '../../src/core/fractions/fraction-bar-ui';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 35 frac-bar-interactive-hover', () => {
  it('mouseenter dims segments up to hover index; mouseleave resets', () => {
    const bar = createInteractiveFractionBar(
      { numerator: 1, denominator: 4 },
      4,
      () => {}
    );
    document.body.appendChild(bar);
    const segments = Array.from(
      bar.querySelectorAll('.fraction-segment')
    ) as HTMLElement[];
    expect(segments).toHaveLength(4);

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

  it('hover first segment only dims itself', () => {
    const bar = createInteractiveFractionBar(
      { numerator: 0, denominator: 3 },
      3,
      () => {}
    );
    const segments = Array.from(
      bar.querySelectorAll('.fraction-segment')
    ) as HTMLElement[];
    segments[0].dispatchEvent(new Event('mouseenter'));
    expect(segments[0].style.opacity).toBe('0.8');
    expect(segments[1].style.opacity).toBe('');
    expect(segments[2].style.opacity).toBe('');
  });

  it('click after hover still reports numerator', () => {
    const seen: number[] = [];
    const bar = createInteractiveFractionBar(
      { numerator: 2, denominator: 5 },
      5,
      (f) => seen.push(f.numerator)
    );
    const segments = Array.from(
      bar.querySelectorAll('.fraction-segment')
    ) as HTMLElement[];
    segments[3].dispatchEvent(new Event('mouseenter'));
    segments[3].click();
    expect(seen).toEqual([4]);
  });
});

