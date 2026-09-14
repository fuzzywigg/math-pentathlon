/**
 * Wave 31 — timer start/pause/stop/reset state-machine matrix.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createTimer,
  startTimer,
  pauseTimer,
  stopTimer,
  resetTimer,
  type Timer,
  type TimerState,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1_700_000_000_000);
});

afterEach(() => {
  vi.useRealTimers();
});

function expectState(timer: Timer, state: TimerState): void {
  expect(timer.state).toBe(state);
}

describe('Wave 31 timer — lifecycle transitions', () => {
  it('stopped → running → paused → running → stopped', () => {
    let t = createTimer({ initialTime: 10_000 });
    expectState(t, 'stopped');

    t = startTimer(t);
    expectState(t, 'running');
    expect(t.startTime).toBe(1_700_000_000_000);
    expect(t.pauseTime).toBeNull();

    vi.setSystemTime(1_700_000_000_500);
    t = pauseTimer(t);
    expectState(t, 'paused');
    expect(t.pauseTime).toBe(1_700_000_000_500);

    vi.setSystemTime(1_700_000_001_000);
    t = startTimer(t);
    expectState(t, 'running');
    expect(t.startTime).toBe(1_700_000_001_000);
    expect(t.pauseTime).toBeNull();

    t = stopTimer(t);
    expectState(t, 'stopped');
    expect(t.elapsed).toBe(0);
    expect(t.remaining).toBe(10_000);
    expect(t.startTime).toBeNull();
    expect(t.pauseTime).toBeNull();
  });

  it('resetTimer aliases stopTimer output shape', () => {
    let t = createTimer({ initialTime: 4_000, direction: 'up' });
    t = startTimer(t);
    t = pauseTimer(t);
    const stopped = stopTimer(t);
    const reset = resetTimer(t);
    expect(reset).toEqual(stopped);
    expect(reset.state).toBe('stopped');
    expect(reset.remaining).toBe(4_000);
  });
});

describe('Wave 31 timer — idempotent / no-op transitions', () => {
  it('start on running returns same reference', () => {
    let t = createTimer();
    t = startTimer(t);
    const again = startTimer(t);
    expect(again).toBe(t);
  });

  it('pause on stopped or paused returns same reference', () => {
    const stopped = createTimer();
    expect(pauseTimer(stopped)).toBe(stopped);

    let t = startTimer(createTimer());
    t = pauseTimer(t);
    expect(pauseTimer(t)).toBe(t);
  });

  it('stop from every state restores initial remaining', () => {
    const states: Array<(t: Timer) => Timer> = [
      (t) => t,
      (t) => startTimer(t),
      (t) => pauseTimer(startTimer(t)),
    ];
    for (const prep of states) {
      const base = createTimer({ initialTime: 7_777 });
      const prepared = prep(base);
      const stopped = stopTimer(prepared);
      expect(stopped.state).toBe('stopped');
      expect(stopped.remaining).toBe(7_777);
      expect(stopped.elapsed).toBe(0);
      expect(stopped.startTime).toBeNull();
      expect(stopped.pauseTime).toBeNull();
    }
  });
});

describe('Wave 31 timer — immutability under transitions', () => {
  it('does not mutate the prior timer object', () => {
    const a = createTimer({ initialTime: 3_000 });
    const b = startTimer(a);
    const c = pauseTimer(b);
    const d = stopTimer(c);

    expect(a.state).toBe('stopped');
    expect(a.startTime).toBeNull();
    expect(b.state).toBe('running');
    expect(b.pauseTime).toBeNull();
    expect(c.state).toBe('paused');
    expect(d.state).toBe('stopped');
    expect(d).not.toBe(a);
    expect(d).not.toBe(b);
    expect(d).not.toBe(c);
  });
});
