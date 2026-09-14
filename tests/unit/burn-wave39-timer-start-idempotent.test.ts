/**
 * Wave 39 — timer start idempotent / pause noop leftovers after #172/#173.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { createTimer, startTimer, pauseTimer } from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-14T12:00:00Z'));
});
afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 39 timer — start idempotent', () => {
  it('second startTimer while running returns same object', () => {
    let t = createTimer({ initialTime: 30000 });
    t = startTimer(t);
    const started = t;
    expect(t.state).toBe('running');
    expect(t.startTime).toBe(Date.now());
    t = startTimer(t);
    expect(t).toBe(started);
  });

  it('pauseTimer on non-running is identity', () => {
    const stopped = createTimer();
    expect(pauseTimer(stopped)).toBe(stopped);
    const paused = pauseTimer(startTimer(createTimer()));
    expect(paused.state).toBe('paused');
    expect(pauseTimer(paused)).toBe(paused);
  });
});
