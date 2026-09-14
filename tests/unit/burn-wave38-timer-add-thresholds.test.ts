/**
 * Wave 38 — timer addTime / threshold leftovers after #171.
 * Distinct from wave 36 inverted thresholds. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createTimer,
  startTimer,
  pauseTimer,
  addTime,
  getTimerValue,
  getTimerProgress,
  isTimerWarning,
  isTimerCritical,
  isTimerComplete,
  formatTime,
  parseTime,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 38 timer — addTime ladder + thresholds', () => {
  it('countdown addTime clamps at 0 and climbs warning→critical→complete', () => {
    let t = createTimer({
      direction: 'down',
      initialTime: 10_000,
      warningThreshold: 4_000,
      criticalThreshold: 2_000,
    });
    t = startTimer(t);
    t = { ...t, remaining: 5_000, elapsed: 5_000 };
    expect(isTimerWarning(t)).toBe(false);

    t = addTime(t, -1_500); // 3500 → warning
    expect(t.remaining).toBe(3_500);
    expect(isTimerWarning(t)).toBe(true);
    expect(isTimerCritical(t)).toBe(false);

    t = addTime(t, -2_000); // 1500 → critical
    expect(isTimerCritical(t)).toBe(true);
    expect(isTimerComplete(t)).toBe(false);

    t = addTime(t, -5_000); // clamp 0
    expect(t.remaining).toBe(0);
    expect(isTimerComplete(t)).toBe(true);
    // countdown progress is remaining/initial (0% left when complete)
    expect(getTimerProgress(t)).toBe(0);
  });

  it('count-up getTimerValue tracks elapsed; addTime still mutates remaining', () => {
    let t = createTimer({ direction: 'up', initialTime: 0 });
    t = startTimer(t);
    t = { ...t, elapsed: 2_500 };
    expect(getTimerValue(t)).toBe(2_500);
    t = addTime(t, 1_000);
    expect(t.remaining).toBe(1_000);
  });

  it('pause freezes state; format/parse round-trip padded mm:ss', () => {
    let t = createTimer({ direction: 'down', initialTime: 125_000 });
    t = startTimer(t);
    t = { ...t, remaining: 120_000, elapsed: 5_000 };
    t = pauseTimer(t);
    expect(t.state).toBe('paused');
    expect(formatTime(t.remaining)).toBe('02:00');
    expect(parseTime('02:05')).toBe(125_000);
    expect(parseTime('00:07')).toBe(7_000);
  });
});
