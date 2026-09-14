/**
 * Wave 36 — start/pause do not auto-tick elapsed/remaining.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createTimer,
  startTimer,
  pauseTimer,
  getTimerValue,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1_700_000_000_000);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 36 timer-wallclock — no implicit tick', () => {
  it('countdown remaining unchanged after wall-clock advance while running', () => {
    let t = createTimer({ initialTime: 10_000, direction: 'down' });
    t = startTimer(t);
    const before = getTimerValue(t);
    vi.setSystemTime(1_700_000_005_000);
    expect(getTimerValue(t)).toBe(before);
    expect(t.remaining).toBe(10_000);
    expect(t.elapsed).toBe(0);
  });

  it('pause stamps pauseTime without mutating remaining', () => {
    let t = createTimer({ initialTime: 8_000 });
    t = startTimer(t);
    vi.setSystemTime(1_700_000_002_000);
    t = pauseTimer(t);
    expect(t.state).toBe('paused');
    expect(t.pauseTime).toBe(1_700_000_002_000);
    expect(t.remaining).toBe(8_000);
  });
});
