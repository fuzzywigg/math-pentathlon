/**
 * Wave 36 — timer getTimerProgress / getTimerValue clamp leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createTimer,
  getTimerProgress,
  getTimerValue,
  addTime,
} from '../../src/core/timer-scoring';

describe('Wave 36 timer-progress — zero initialTime', () => {
  it('returns 0 progress for both directions when initialTime is 0', () => {
    const down = createTimer({ direction: 'down', initialTime: 0 });
    const up = createTimer({ direction: 'up', initialTime: 0 });
    down.elapsed = 50;
    up.elapsed = 50;
    expect(getTimerProgress(down)).toBe(0);
    expect(getTimerProgress(up)).toBe(0);
  });
});

describe('Wave 36 timer-progress — clamp at 100', () => {
  it('count-up clamps when elapsed exceeds initialTime', () => {
    const t = createTimer({ direction: 'up', initialTime: 1_000 });
    t.elapsed = 2_500;
    expect(getTimerProgress(t)).toBe(100);
    expect(getTimerValue(t)).toBe(2_500);
  });

  it('countdown clamps when remaining exceeds initialTime via addTime', () => {
    let t = createTimer({ direction: 'down', initialTime: 1_000 });
    t = addTime(t, 5_000);
    expect(t.remaining).toBe(6_000);
    expect(getTimerProgress(t)).toBe(100);
    expect(getTimerValue(t)).toBe(6_000);
  });

  it('exact 50% and 100% for countdown', () => {
    const t = createTimer({ direction: 'down', initialTime: 8_000 });
    t.remaining = 4_000;
    expect(getTimerProgress(t)).toBe(50);
    t.remaining = 8_000;
    expect(getTimerProgress(t)).toBe(100);
    t.remaining = 0;
    expect(getTimerProgress(t)).toBe(0);
  });
});

describe('Wave 36 timer-progress — getTimerValue direction matrix', () => {
  it('up uses elapsed; down uses remaining', () => {
    const up = createTimer({ direction: 'up', initialTime: 9_000 });
    up.elapsed = 123;
    up.remaining = 999;
    expect(getTimerValue(up)).toBe(123);

    const down = createTimer({ direction: 'down', initialTime: 9_000 });
    down.elapsed = 123;
    down.remaining = 456;
    expect(getTimerValue(down)).toBe(456);
  });
});
