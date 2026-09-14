/**
 * Wave 31 — addTime clamp / isolation / large delta stress.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createTimer,
  addTime,
  isTimerComplete,
  getTimerProgress,
} from '../../src/core/timer-scoring';

describe('Wave 31 timer — addTime clamps and isolation', () => {
  it('returns a new object and leaves prior remaining intact', () => {
    const original = createTimer({ initialTime: 10_000 });
    const next = addTime(original, -3_000);
    expect(next).not.toBe(original);
    expect(original.remaining).toBe(10_000);
    expect(next.remaining).toBe(7_000);
    expect(next.state).toBe(original.state);
    expect(next.config).toBe(original.config); // shallow spread shares config
  });

  it('clamps at zero under large negative deltas', () => {
    let t = createTimer({ initialTime: 1_000 });
    for (const delta of [-1, -999, -1_000, -50_000, -1_000_000]) {
      t = addTime(createTimer({ initialTime: 1_000 }), delta);
      expect(t.remaining).toBeGreaterThanOrEqual(0);
      if (delta <= -1_000) expect(t.remaining).toBe(0);
    }
  });

  it('allows remaining to grow above initialTime', () => {
    const t = addTime(createTimer({ initialTime: 5_000 }), 100_000);
    expect(t.remaining).toBe(105_000);
    expect(getTimerProgress(t)).toBe(100);
  });
});

describe('Wave 31 timer — addTime stepwise countdown path', () => {
  it('drains to complete across equal steps', () => {
    let t = createTimer({ initialTime: 1_000 });
    const steps = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
    for (const step of steps) {
      expect(isTimerComplete(t)).toBe(false);
      t = addTime(t, -step);
    }
    expect(t.remaining).toBe(0);
    expect(isTimerComplete(t)).toBe(true);
  });

  it('mixed bonus and penalty deltas conserve arithmetic until clamp', () => {
    let t = createTimer({ initialTime: 10_000 });
    const deltas = [500, -200, 1_000, -3_000, -50, 25];
    let expected = 10_000;
    for (const d of deltas) {
      expected = Math.max(0, expected + d);
      t = addTime(t, d);
      expect(t.remaining).toBe(expected);
    }
  });
});

describe('Wave 31 timer — addTime zero and identity', () => {
  it('addTime(..., 0) yields remaining unchanged new object', () => {
    const t = createTimer({ initialTime: 2_222 });
    const same = addTime(t, 0);
    expect(same.remaining).toBe(2_222);
    expect(same).not.toBe(t);
  });
});
