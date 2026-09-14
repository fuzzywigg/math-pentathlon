/**
 * Wave 36 — timer warning ladder drain simulation leftovers.
 * Beyond wave 31 thresholds / countup-clock. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createTimer,
  startTimer,
  pauseTimer,
  addTime,
  getTimerProgress,
  isTimerWarning,
  isTimerCritical,
  isTimerComplete,
  formatTime,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 36 timer — stepped drain ladder', () => {
  it('walks normal → warning → critical → complete with 1s steps', () => {
    let t = createTimer({
      direction: 'down',
      initialTime: 10_000,
      warningThreshold: 4_000,
      criticalThreshold: 2_000,
    });
    t = startTimer(t);

    const flags: Array<{
      remaining: number;
      warn: boolean;
      crit: boolean;
      done: boolean;
    }> = [];

    for (let step = 0; step < 11; step++) {
      flags.push({
        remaining: t.remaining,
        warn: isTimerWarning(t),
        crit: isTimerCritical(t),
        done: isTimerComplete(t),
      });
      t = addTime(t, -1_000);
    }

    expect(flags[0]).toMatchObject({
      remaining: 10_000,
      warn: false,
      crit: false,
      done: false,
    });
    expect(flags[6]).toMatchObject({
      remaining: 4_000,
      warn: true,
      crit: false,
      done: false,
    });
    expect(flags[8]).toMatchObject({
      remaining: 2_000,
      warn: false,
      crit: true,
      done: false,
    });
    expect(flags[10]).toMatchObject({
      remaining: 0,
      warn: false,
      crit: true,
      done: true,
    });
    expect(t.remaining).toBe(0);
    expect(getTimerProgress(t)).toBe(0);
    expect(formatTime(0)).toBe('00:00');
  });

  it('pause freezes remaining while wall clock advances', () => {
    let t = createTimer({ initialTime: 5_000 });
    t = startTimer(t);
    t = addTime(t, -1_000);
    t = pauseTimer(t);
    const frozen = t.remaining;
    vi.setSystemTime(60_000);
    // No auto-tick API — remaining stays until addTime
    expect(t.remaining).toBe(frozen);
    expect(t.state).toBe('paused');
    t = addTime(t, -500);
    expect(t.remaining).toBe(frozen - 500);
    expect(t.state).toBe('paused');
  });
});

describe('Wave 36 timer — count-up progress ladder', () => {
  it('progress grows with elapsed toward initialTime then clamps', () => {
    let t = createTimer({ direction: 'up', initialTime: 4_000 });
    const samples = [0, 1_000, 2_000, 4_000, 8_000];
    const progresses = samples.map((elapsed) =>
      getTimerProgress({ ...t, elapsed })
    );
    expect(progresses).toEqual([0, 25, 50, 100, 100]);
  });
});
