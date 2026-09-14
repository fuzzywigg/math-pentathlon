/**
 * Overnight TOKENMAXX HEAVY — interactive bar cannot reach zero + stale DOM leftover.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInteractiveFractionBar } from '../../src/core/fractions/fraction-bar-ui';
import type { Fraction } from '../../src/core/fractions/types';

describe('Overnight frac-bar — interactive zero + stale fill', () => {
  it('clicks only yield numerators 1..den; never 0', () => {
    const seen: Fraction[] = [];
    const bar = createInteractiveFractionBar(
      { numerator: 3, denominator: 4 },
      4,
      (f) => seen.push(f)
    );
    const segments = [
      ...bar.querySelectorAll('.fraction-segment'),
    ] as HTMLElement[];
    expect(segments).toHaveLength(4);
    segments.forEach((s) => s.click());
    expect(seen.map((f) => f.numerator)).toEqual([1, 2, 3, 4]);
    expect(seen.every((f) => f.numerator > 0)).toBe(true);
  });

  it('click fires onChange but does not repaint segment backgrounds', () => {
    const bar = createInteractiveFractionBar(
      { numerator: 1, denominator: 4 },
      4,
      () => {}
    );
    const segments = [
      ...bar.querySelectorAll('.fraction-segment'),
    ] as HTMLElement[];
    const before = segments.map((s) => s.style.background);
    segments[3].click(); // would be 4/4 if DOM updated
    const after = segments.map((s) => s.style.background);
    expect(after).toEqual(before);
  });
});
