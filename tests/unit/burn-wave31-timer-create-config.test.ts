/**
 * Wave 31 — timer createTimer config defaults / overrides / immutability.
 * Deepens timer-scoring beyond wave 27 edges. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createTimer,
  startTimer,
  type TimerConfig,
} from '../../src/core/timer-scoring';

describe('Wave 31 timer — createTimer defaults', () => {
  it('defaults to countdown 60s stopped with null clocks', () => {
    const timer = createTimer();
    expect(timer.config.direction).toBe('down');
    expect(timer.config.initialTime).toBe(60_000);
    expect(timer.config.warningThreshold).toBeUndefined();
    expect(timer.config.criticalThreshold).toBeUndefined();
    expect(timer.state).toBe('stopped');
    expect(timer.elapsed).toBe(0);
    expect(timer.remaining).toBe(60_000);
    expect(timer.startTime).toBeNull();
    expect(timer.pauseTime).toBeNull();
  });

  it('merges partial overrides without inventing thresholds', () => {
    const timer = createTimer({
      direction: 'up',
      initialTime: 12_345,
      warningThreshold: 2_000,
    });
    expect(timer.config).toEqual({
      direction: 'up',
      initialTime: 12_345,
      warningThreshold: 2_000,
    });
    expect(timer.remaining).toBe(12_345);
    expect(timer.elapsed).toBe(0);
  });
});

describe('Wave 31 timer — createTimer isolation', () => {
  it('does not share config object identity across creates', () => {
    const a = createTimer({ initialTime: 1_000 });
    const b = createTimer({ initialTime: 1_000 });
    expect(a.config).not.toBe(b.config);
    expect(a).not.toBe(b);
  });

  it('ignores mutation of the partial input after create', () => {
    const partial: Partial<TimerConfig> = {
      direction: 'down',
      initialTime: 5_000,
    };
    const timer = createTimer(partial);
    partial.initialTime = 99_999;
    partial.direction = 'up';
    expect(timer.config.initialTime).toBe(5_000);
    expect(timer.config.direction).toBe('down');
    expect(timer.remaining).toBe(5_000);
  });

  it('startTimer returns a new object; original stays stopped', () => {
    const stopped = createTimer({ initialTime: 8_000 });
    const running = startTimer(stopped);
    expect(running).not.toBe(stopped);
    expect(stopped.state).toBe('stopped');
    expect(stopped.startTime).toBeNull();
    expect(running.state).toBe('running');
    expect(running.startTime).not.toBeNull();
  });
});

describe('Wave 31 timer — createTimer remaining mirrors initialTime', () => {
  const initials = [0, 1, 999, 60_000, 3_600_000];

  it.each(initials)('remaining === initialTime for %i ms', (ms) => {
    const timer = createTimer({ initialTime: ms });
    expect(timer.remaining).toBe(ms);
    expect(timer.elapsed).toBe(0);
  });
});
