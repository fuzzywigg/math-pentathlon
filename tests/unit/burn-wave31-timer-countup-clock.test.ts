/**
 * Wave 31 — stop/reset / count-up clock field isolation edges.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createTimer,
  startTimer,
  pauseTimer,
  stopTimer,
  resetTimer,
  getTimerValue,
  addTime,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(10_000);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 31 timer — count-up field isolation', () => {
  it('addTime still mutates remaining on count-up timers', () => {
    let t = createTimer({ direction: 'up', initialTime: 0 });
    expect(getTimerValue(t)).toBe(0); // elapsed
    t = addTime(t, 5_000);
    expect(t.remaining).toBe(5_000);
    expect(getTimerValue(t)).toBe(0); // still elapsed-based
  });

  it('stop clears clocks even if elapsed was manually advanced', () => {
    let t = createTimer({ direction: 'up', initialTime: 1_000 });
    t = startTimer(t);
    t.elapsed = 500;
    t = stopTimer(t);
    expect(t.elapsed).toBe(0);
    expect(t.remaining).toBe(1_000);
    expect(t.startTime).toBeNull();
  });
});

describe('Wave 31 timer — pause clock stamps', () => {
  it('records distinct pauseTime after time advances', () => {
    let t = createTimer({ initialTime: 20_000 });
    t = startTimer(t);
    expect(t.startTime).toBe(10_000);
    vi.setSystemTime(10_250);
    t = pauseTimer(t);
    expect(t.pauseTime).toBe(10_250);
    vi.setSystemTime(11_000);
    t = startTimer(t);
    expect(t.startTime).toBe(11_000);
    expect(t.pauseTime).toBeNull();
  });

  it('resetTimer from paused clears pauseTime', () => {
    let t = startTimer(createTimer({ initialTime: 9_000 }));
    t = pauseTimer(t);
    t = resetTimer(t);
    expect(t.pauseTime).toBeNull();
    expect(t.state).toBe('stopped');
  });
});
