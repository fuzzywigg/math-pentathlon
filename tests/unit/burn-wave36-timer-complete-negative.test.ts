/**
 * Wave 36 — isTimerComplete with negative remaining + addTime clamp.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createTimer,
  isTimerComplete,
  addTime,
} from '../../src/core/timer-scoring';

describe('Wave 36 timer-complete — negatives', () => {
  it('countdown remaining < 0 is complete', () => {
    const t = { ...createTimer({ initialTime: 1000, direction: 'down' }), remaining: -1 };
    expect(isTimerComplete(t)).toBe(true);
  });

  it('count-up never completes even at remaining 0', () => {
    const t = { ...createTimer({ initialTime: 1000, direction: 'up' }), remaining: 0, elapsed: 5000 };
    expect(isTimerComplete(t)).toBe(false);
  });

  it('addTime clamps remaining to >= 0', () => {
    const t = addTime(createTimer({ initialTime: 100 }), -500);
    expect(t.remaining).toBe(0);
    expect(isTimerComplete(t)).toBe(true);
  });
});
