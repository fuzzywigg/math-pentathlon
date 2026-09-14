/**
 * Wave 36 — timer lifecycle multi-cycle stress leftovers.
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
  isTimerComplete,
  getTimerProgress,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 36 timer-lifecycle — many pause/resume cycles', () => {
  it('100 start/pause cycles keep state machine healthy', () => {
    let t = createTimer({ initialTime: 30_000, direction: 'down' });
    for (let i = 0; i < 100; i++) {
      vi.setSystemTime(i * 1000);
      t = startTimer(t);
      expect(t.state).toBe('running');
      expect(t.startTime).toBe(i * 1000);
      vi.setSystemTime(i * 1000 + 500);
      t = pauseTimer(t);
      expect(t.state).toBe('paused');
      expect(t.pauseTime).toBe(i * 1000 + 500);
    }
    t = stopTimer(t);
    expect(t.state).toBe('stopped');
    expect(t.remaining).toBe(30_000);
  });

  it('countdown drain via addTime then reset restores initial', () => {
    let t = createTimer({ initialTime: 5_000 });
    for (let i = 0; i < 10; i++) {
      t = addTime(t, -500);
    }
    expect(t.remaining).toBe(0);
    expect(isTimerComplete(t)).toBe(true);
    expect(getTimerProgress(t)).toBe(0);
    t = resetTimer(t);
    expect(t.remaining).toBe(5_000);
    expect(isTimerComplete(t)).toBe(false);
    expect(getTimerProgress(t)).toBe(100);
  });

  it('createTimer partial override leaves other defaults', () => {
    const t = createTimer({ warningThreshold: 1_000 });
    expect(t.config.direction).toBe('down');
    expect(t.config.initialTime).toBe(60_000);
    expect(t.config.warningThreshold).toBe(1_000);
    expect(t.config.criticalThreshold).toBeUndefined();
  });
});
