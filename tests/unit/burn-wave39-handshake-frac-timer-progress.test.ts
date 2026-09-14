/**
 * Wave 39 — handshake: timer progress → fraction after #172/#173.
 * Distinct from wave38 poly→frac. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createTimer,
  getTimerProgress,
  isTimerComplete,
} from '../../src/core/timer-scoring';
import {
  fromDecimal,
  compare,
  roundToDenominator,
  isZero,
} from '../../src/core/fractions';

describe('Wave 39 handshake — frac ← timer progress', () => {
  it('progress maps to fraction compare / round', () => {
    const t = {
      ...createTimer({ initialTime: 10000, direction: 'down' }),
      remaining: 7500,
    };
    const p = getTimerProgress(t);
    expect(p).toBe(75);
    const f = fromDecimal(p / 100);
    expect(compare(f, fromDecimal(0.5))).toBeGreaterThan(0);
    const rounded = roundToDenominator(f, 4);
    expect(rounded.denominator).toBe(4);
  });

  it('complete remaining 0 → progress 0 and zero fraction', () => {
    const t = {
      ...createTimer({ initialTime: 5000, direction: 'down' }),
      remaining: 0,
    };
    expect(isTimerComplete(t)).toBe(true);
    expect(getTimerProgress(t)).toBe(0);
    expect(isZero(fromDecimal(0))).toBe(true);
  });
});
