/**
 * Wave 36 — timer progress / complete / threshold leftovers matrix.
 * Beyond wave 31 value-progress / thresholds. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createTimer,
  addTime,
  getTimerProgress,
  getTimerValue,
  isTimerWarning,
  isTimerCritical,
  isTimerComplete,
} from '../../src/core/timer-scoring';

describe('Wave 36 timer — progress when remaining exceeds initialTime', () => {
  it('clamps countdown progress to 100 after addTime overshoot', () => {
    let t = createTimer({ direction: 'down', initialTime: 10_000 });
    t = addTime(t, 5_000);
    expect(t.remaining).toBe(15_000);
    expect(getTimerProgress(t)).toBe(100);
    expect(getTimerValue(t)).toBe(15_000);
  });

  it('count-up progress clamps at 100 when elapsed exceeds initialTime', () => {
    let t = createTimer({ direction: 'up', initialTime: 1_000 });
    t = { ...t, elapsed: 2_500 };
    expect(getTimerProgress(t)).toBe(100);
    expect(getTimerValue(t)).toBe(2_500);
  });

  it('zero initialTime yields 0 progress for both directions', () => {
    const down = createTimer({ direction: 'down', initialTime: 0 });
    const up = createTimer({ direction: 'up', initialTime: 0 });
    expect(getTimerProgress(down)).toBe(0);
    expect(getTimerProgress({ ...up, elapsed: 500 })).toBe(0);
  });
});

describe('Wave 36 timer — warning / critical / complete combos', () => {
  it('warning without critical uses critical=0 floor', () => {
    let t = createTimer({
      direction: 'down',
      initialTime: 10_000,
      warningThreshold: 3_000,
    });
    t = { ...t, remaining: 2_000 };
    expect(isTimerWarning(t)).toBe(true);
    expect(isTimerCritical(t)).toBe(false);

    t = { ...t, remaining: 0 };
    expect(isTimerWarning(t)).toBe(false); // remaining > critical(0) fails at 0
    expect(isTimerComplete(t)).toBe(true);
  });

  it('critical without warning never reports warning', () => {
    let t = createTimer({
      direction: 'down',
      initialTime: 10_000,
      criticalThreshold: 1_000,
    });
    t = { ...t, remaining: 500 };
    expect(isTimerWarning(t)).toBe(false);
    expect(isTimerCritical(t)).toBe(true);
  });

  it('exact warning boundary is warning; exact critical is critical not warning', () => {
    let t = createTimer({
      direction: 'down',
      initialTime: 60_000,
      warningThreshold: 10_000,
      criticalThreshold: 2_000,
    });
    t = { ...t, remaining: 10_000 };
    expect(isTimerWarning(t)).toBe(true);
    expect(isTimerCritical(t)).toBe(false);

    t = { ...t, remaining: 2_000 };
    expect(isTimerWarning(t)).toBe(false);
    expect(isTimerCritical(t)).toBe(true);
  });

  it('count-up never completes even at remaining 0', () => {
    const t = createTimer({ direction: 'up', initialTime: 5_000 });
    expect(isTimerComplete({ ...t, remaining: 0, elapsed: 5_000 })).toBe(false);
  });
});

describe('Wave 36 timer — addTime clamp edges', () => {
  it('negative addTime clamps remaining at 0 and marks complete', () => {
    let t = createTimer({ initialTime: 1_000 });
    t = addTime(t, -5_000);
    expect(t.remaining).toBe(0);
    expect(isTimerComplete(t)).toBe(true);
  });

  it('addTime does not mutate prior timer object', () => {
    const before = createTimer({ initialTime: 4_000 });
    const after = addTime(before, -1_000);
    expect(before.remaining).toBe(4_000);
    expect(after.remaining).toBe(3_000);
    expect(after).not.toBe(before);
  });
});
