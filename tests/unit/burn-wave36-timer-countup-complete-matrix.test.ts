/**
 * Wave 36 — timer count-up complete/value leftovers vs countdown.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createTimer,
  isTimerComplete,
  isTimerWarning,
  isTimerCritical,
  getTimerValue,
  getTimerProgress,
  addTime,
} from '../../src/core/timer-scoring';

describe('Wave 36 timer-countup — complete never fires', () => {
  const remainings = [0, -1, 1, 100, 10_000];
  const elapseds = [0, 1, 10_000, 999_999];

  it('isTimerComplete false across remaining×elapsed grid for up', () => {
    for (const remaining of remainings) {
      for (const elapsed of elapseds) {
        const t = createTimer({
          direction: 'up',
          initialTime: 10_000,
          warningThreshold: 2_000,
          criticalThreshold: 500,
        });
        t.remaining = remaining;
        t.elapsed = elapsed;
        expect(isTimerComplete(t)).toBe(false);
        expect(getTimerValue(t)).toBe(elapsed);
      }
    }
  });

  it('warning/critical still inspect remaining even in count-up mode', () => {
    const t = createTimer({
      direction: 'up',
      initialTime: 10_000,
      warningThreshold: 4_000,
      criticalThreshold: 1_000,
    });
    t.remaining = 3_000;
    expect(isTimerWarning(t)).toBe(true);
    t.remaining = 500;
    expect(isTimerCritical(t)).toBe(true);
    expect(isTimerWarning(t)).toBe(false);
  });

  it('addTime on count-up still mutates remaining not elapsed', () => {
    let t = createTimer({ direction: 'up', initialTime: 5_000 });
    t.elapsed = 100;
    t = addTime(t, -2_000);
    expect(t.remaining).toBe(3_000);
    expect(t.elapsed).toBe(100);
    expect(getTimerProgress(t)).toBe(2); // 100/5000*100
  });
});
