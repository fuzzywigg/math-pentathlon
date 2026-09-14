/**
 * Wave 36 — timer transition immutability leftovers.
 * Tests-only. No product inventing.
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
  vi.setSystemTime(5_000_000);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 36 timer-immutability — config object identity', () => {
  it('start/pause/stop share config reference from createTimer', () => {
    const t0 = createTimer({
      direction: 'down',
      initialTime: 12_000,
      warningThreshold: 3_000,
    });
    const t1 = startTimer(t0);
    const t2 = pauseTimer(t1);
    const t3 = stopTimer(t2);
    expect(t1.config).toBe(t0.config);
    expect(t2.config).toBe(t0.config);
    expect(t3.config).toBe(t0.config);
  });

  it('addTime does not mutate original remaining', () => {
    const t0 = createTimer({ initialTime: 5_000 });
    const t1 = addTime(t0, -100);
    expect(t0.remaining).toBe(5_000);
    expect(t1.remaining).toBe(4_900);
    expect(t1).not.toBe(t0);
    expect(t1.config).toBe(t0.config);
  });

  it('resetTimer equals stopTimer and leaves prior object untouched', () => {
    let t = createTimer({ initialTime: 2_000 });
    t = startTimer(t);
    vi.setSystemTime(5_000_500);
    t = pauseTimer(t);
    const frozen = { ...t, config: { ...t.config } };
    const reset = resetTimer(t);
    expect(t.state).toBe('paused');
    expect(t.pauseTime).toBe(5_000_500);
    expect(reset.state).toBe('stopped');
    expect(reset.elapsed).toBe(0);
    expect(reset.remaining).toBe(2_000);
    expect(t.state).toBe(frozen.state);
  });
});

describe('Wave 36 timer-immutability — noop same-reference contract', () => {
  it('start while running returns identical object', () => {
    let t = createTimer();
    t = startTimer(t);
    expect(startTimer(t)).toBe(t);
  });

  it('pause while stopped/paused returns identical object', () => {
    const stopped = createTimer();
    expect(pauseTimer(stopped)).toBe(stopped);
    let t = startTimer(stopped);
    t = pauseTimer(t);
    expect(pauseTimer(t)).toBe(t);
  });
});
