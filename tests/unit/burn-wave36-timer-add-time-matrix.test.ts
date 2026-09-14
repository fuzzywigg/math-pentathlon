/**
 * Wave 36 — timer addTime clamp matrix leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { createTimer, addTime, isTimerComplete } from '../../src/core/timer-scoring';

describe('Wave 36 timer-add-time — clamp and identity', () => {
  const deltas = [0, 1, -1, 100, -100, -10_000, 10_000];

  it('never yields negative remaining across delta matrix from 5s', () => {
    for (const d of deltas) {
      const t = addTime(createTimer({ initialTime: 5_000 }), d);
      expect(t.remaining).toBeGreaterThanOrEqual(0);
      if (d <= -5_000) {
        expect(t.remaining).toBe(0);
        expect(isTimerComplete(t)).toBe(true);
      }
    }
  });

  it('addTime(0) still returns a new object with same remaining', () => {
    const t0 = createTimer({ initialTime: 3_000 });
    const t1 = addTime(t0, 0);
    expect(t1).not.toBe(t0);
    expect(t1.remaining).toBe(3_000);
    expect(t1.state).toBe(t0.state);
  });

  it('chained adds accumulate until floor', () => {
    let t = createTimer({ initialTime: 1_000 });
    t = addTime(t, -300);
    t = addTime(t, -300);
    t = addTime(t, -300);
    t = addTime(t, -300);
    expect(t.remaining).toBe(0);
  });
});
