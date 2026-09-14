/**
 * Wave 31 — getTimerValue / getTimerProgress up+down / zero initial.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createTimer,
  getTimerValue,
  getTimerProgress,
  addTime,
} from '../../src/core/timer-scoring';

describe('Wave 31 timer — getTimerValue direction matrix', () => {
  it('down returns remaining; up returns elapsed', () => {
    const down = createTimer({ direction: 'down', initialTime: 9_000 });
    down.remaining = 4_500;
    down.elapsed = 4_500;
    expect(getTimerValue(down)).toBe(4_500);

    const up = createTimer({ direction: 'up', initialTime: 9_000 });
    up.elapsed = 2_250;
    up.remaining = 9_000;
    expect(getTimerValue(up)).toBe(2_250);
  });

  it('tracks addTime on countdown remaining only', () => {
    let t = createTimer({ direction: 'down', initialTime: 10_000 });
    t = addTime(t, -2_500);
    expect(getTimerValue(t)).toBe(7_500);
    t = addTime(t, 1_000);
    expect(getTimerValue(t)).toBe(8_500);
  });
});

describe('Wave 31 timer — progress percentage matrix', () => {
  const cases: Array<{
    direction: 'up' | 'down';
    initial: number;
    elapsed: number;
    remaining: number;
    expected: number;
  }> = [
    {
      direction: 'down',
      initial: 10_000,
      elapsed: 0,
      remaining: 10_000,
      expected: 100,
    },
    {
      direction: 'down',
      initial: 10_000,
      elapsed: 2_500,
      remaining: 7_500,
      expected: 75,
    },
    {
      direction: 'down',
      initial: 10_000,
      elapsed: 10_000,
      remaining: 0,
      expected: 0,
    },
    {
      direction: 'up',
      initial: 10_000,
      elapsed: 0,
      remaining: 10_000,
      expected: 0,
    },
    {
      direction: 'up',
      initial: 10_000,
      elapsed: 2_500,
      remaining: 10_000,
      expected: 25,
    },
    {
      direction: 'up',
      initial: 10_000,
      elapsed: 10_000,
      remaining: 10_000,
      expected: 100,
    },
    {
      direction: 'up',
      initial: 10_000,
      elapsed: 50_000,
      remaining: 10_000,
      expected: 100,
    },
  ];

  it.each(cases)(
    '$direction initial=$initial elapsed=$elapsed remaining=$remaining → $expected%',
    ({ direction, initial, elapsed, remaining, expected }) => {
      const t = createTimer({ direction, initialTime: initial });
      t.elapsed = elapsed;
      t.remaining = remaining;
      expect(getTimerProgress(t)).toBe(expected);
    }
  );

  it('returns 0 when initialTime is 0 (both directions)', () => {
    const down = createTimer({ direction: 'down', initialTime: 0 });
    down.remaining = 0;
    expect(getTimerProgress(down)).toBe(0);

    const up = createTimer({ direction: 'up', initialTime: 0 });
    up.elapsed = 5_000;
    expect(getTimerProgress(up)).toBe(0);
  });

  it('clamps countdown progress when remaining exceeds initialTime', () => {
    const t = createTimer({ direction: 'down', initialTime: 5_000 });
    const boosted = addTime(t, 20_000);
    expect(boosted.remaining).toBe(25_000);
    expect(getTimerProgress(boosted)).toBe(100);
  });
});
