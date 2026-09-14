/**
 * Wave 36 — timer lifecycle immutability + config isolation leftovers.
 * Beyond wave 31 lifecycle / create-config. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createTimer,
  startTimer,
  pauseTimer,
  stopTimer,
  resetTimer,
  addTime,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1_000_000);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 36 timer — config object isolation', () => {
  it('mutating input Partial config after create does not alter timer', () => {
    const partial = {
      direction: 'up' as const,
      initialTime: 5_000,
      warningThreshold: 1_000,
    };
    const t = createTimer(partial);
    partial.initialTime = 99;
    partial.direction = 'down';
    expect(t.config.initialTime).toBe(5_000);
    expect(t.config.direction).toBe('up');
  });

  it('start/pause/stop preserve config identity across transitions', () => {
    let t = createTimer({
      direction: 'down',
      initialTime: 8_000,
      criticalThreshold: 500,
    });
    const cfg = t.config;
    t = startTimer(t);
    t = pauseTimer(t);
    t = startTimer(t);
    t = stopTimer(t);
    expect(t.config).toBe(cfg);
    expect(t.config.criticalThreshold).toBe(500);
  });
});

describe('Wave 36 timer — state machine leftovers', () => {
  it('stop then start is a fresh run (clears pauseTime)', () => {
    let t = createTimer({ initialTime: 3_000 });
    t = startTimer(t);
    vi.setSystemTime(1_000_500);
    t = pauseTimer(t);
    expect(t.pauseTime).toBe(1_000_500);
    t = stopTimer(t);
    expect(t.state).toBe('stopped');
    expect(t.pauseTime).toBeNull();
    expect(t.startTime).toBeNull();
    expect(t.remaining).toBe(3_000);

    vi.setSystemTime(2_000_000);
    t = startTimer(t);
    expect(t.state).toBe('running');
    expect(t.startTime).toBe(2_000_000);
  });

  it('resetTimer equals stopTimer after addTime drain', () => {
    let t = createTimer({ initialTime: 2_000 });
    t = startTimer(t);
    t = addTime(t, -1_500);
    const stopped = stopTimer(t);
    const reset = resetTimer(t);
    expect(reset).toEqual(stopped);
    expect(reset.remaining).toBe(2_000);
    expect(reset.elapsed).toBe(0);
  });

  it('pause on already-paused returns same reference', () => {
    let t = createTimer();
    t = startTimer(t);
    t = pauseTimer(t);
    const again = pauseTimer(t);
    expect(again).toBe(t);
  });
});
