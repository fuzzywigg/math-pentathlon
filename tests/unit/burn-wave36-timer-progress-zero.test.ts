/**
 * Wave 36 — getTimerProgress initialTime 0 / clamp leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createTimer, getTimerProgress } from '../../src/core/timer-scoring';

describe('Wave 36 timer-progress — zero initial + clamps', () => {
  it('initialTime 0 → progress 0 for both directions', () => {
    expect(getTimerProgress(createTimer({ initialTime: 0, direction: 'down' }))).toBe(0);
    expect(getTimerProgress(createTimer({ initialTime: 0, direction: 'up' }))).toBe(0);
  });

  it('count-up elapsed beyond initial clamps to 100', () => {
    const t = {
      ...createTimer({ initialTime: 1000, direction: 'up' }),
      elapsed: 5000,
    };
    expect(getTimerProgress(t)).toBe(100);
  });

  it('countdown remaining above initial clamps to 100', () => {
    const t = {
      ...createTimer({ initialTime: 1000, direction: 'down' }),
      remaining: 2000,
    };
    expect(getTimerProgress(t)).toBe(100);
  });
});
