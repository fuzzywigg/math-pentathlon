/**
 * Overnight timer-penalty deepen — concurrent / interleaved timer ticks.
 * No shared auto-tick API; simulates independent clocks via addTime.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createTimer,
  startTimer,
  pauseTimer,
  addTime,
  isTimerComplete,
  isTimerWarning,
  isTimerCritical,
  getTimerProgress,
  getTimerValue,
  createScoringState,
  addScore,
  subtractScore,
  getPlayerScore,
  getRecentEntries,
  calculateGameResult,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(9_000_000);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 41 timer-penalty — concurrent timer ticks', () => {
  it('interleaved addTime on two countdowns never crosstalks remaining', () => {
    let a = createTimer({
      direction: 'down',
      initialTime: 10_000,
      warningThreshold: 4_000,
      criticalThreshold: 1_000,
    });
    let b = createTimer({
      direction: 'down',
      initialTime: 6_000,
      warningThreshold: 2_000,
      criticalThreshold: 500,
    });
    a = startTimer(a);
    b = startTimer(b);

    const aStart = a.startTime;
    const bStart = b.startTime;
    expect(aStart).toBe(bStart);

    // Round-robin ticks with different step sizes.
    const script: Array<{ which: 'a' | 'b'; delta: number }> = [
      { which: 'a', delta: -1_000 },
      { which: 'b', delta: -500 },
      { which: 'a', delta: -2_000 },
      { which: 'b', delta: -1_500 },
      { which: 'a', delta: -3_000 },
      { which: 'b', delta: -2_000 },
      { which: 'a', delta: -4_000 },
      { which: 'b', delta: -3_000 },
    ];

    for (const step of script) {
      if (step.which === 'a') a = addTime(a, step.delta);
      else b = addTime(b, step.delta);
    }

    expect(a.remaining).toBe(0);
    expect(b.remaining).toBe(0);
    expect(isTimerComplete(a)).toBe(true);
    expect(isTimerComplete(b)).toBe(true);
    expect(a.config.initialTime).toBe(10_000);
    expect(b.config.initialTime).toBe(6_000);
    expect(getTimerProgress(a)).toBe(0);
    expect(getTimerProgress(b)).toBe(0);
  });

  it('three clocks: one paused, one draining, one count-up — isolation holds', () => {
    let down = createTimer({ direction: 'down', initialTime: 4_000 });
    let paused = createTimer({ direction: 'down', initialTime: 4_000 });
    let up = createTimer({ direction: 'up', initialTime: 4_000 });

    down = startTimer(down);
    paused = startTimer(paused);
    up = startTimer(up);

    paused = pauseTimer(paused);
    const pausedFrozen = paused.remaining;

    for (let i = 0; i < 5; i++) {
      down = addTime(down, -800);
      up = { ...up, elapsed: up.elapsed + 800 };
      // paused clock intentionally not ticked
      vi.setSystemTime(9_000_000 + (i + 1) * 800);
    }

    expect(down.remaining).toBe(0);
    expect(isTimerComplete(down)).toBe(true);
    expect(paused.remaining).toBe(pausedFrozen);
    expect(paused.state).toBe('paused');
    expect(getTimerValue(up)).toBe(4_000);
    expect(isTimerComplete(up)).toBe(false);
    expect(getTimerProgress(up)).toBe(100);
  });

  it('concurrent overtime: per-seat penalties track which clock completed', () => {
    let redClock = createTimer({ direction: 'down', initialTime: 1_000 });
    let blueClock = createTimer({ direction: 'down', initialTime: 2_000 });
    redClock = startTimer(redClock);
    blueClock = startTimer(blueClock);

    let score = createScoringState(
      { minScore: 0, pointValues: { overtime: 1 } },
      ['red', 'blue']
    );
    score = addScore(score, 'red', 10);
    score = addScore(score, 'blue', 10);

    // Shared tick loop: each seat drains own clock; overtime only after complete.
    for (let tick = 0; tick < 6; tick++) {
      redClock = addTime(redClock, -500);
      blueClock = addTime(blueClock, -500);

      if (isTimerComplete(redClock)) {
        score = subtractScore(score, 'red', 1, 'overtime');
      }
      if (isTimerComplete(blueClock)) {
        score = subtractScore(score, 'blue', 1, 'overtime');
      }
    }

    expect(redClock.remaining).toBe(0);
    expect(blueClock.remaining).toBe(0);
    // red completed from tick 1 (after 1000ms) → ticks 1..5 = 5 penalties
    // blue completed from tick 3 (after 2000ms) → ticks 3..5 = 3 penalties
    expect(getPlayerScore(score, 'red')).toBe(5);
    expect(getPlayerScore(score, 'blue')).toBe(7);

    const redOt = getRecentEntries(score, 'red', 10).filter(
      (e) => e.reason === 'overtime'
    );
    const blueOt = getRecentEntries(score, 'blue', 10).filter(
      (e) => e.reason === 'overtime'
    );
    expect(redOt).toHaveLength(5);
    expect(blueOt).toHaveLength(3);

    const result = calculateGameResult(score, 3_000);
    expect(result.winnerId).toBe('blue');
    expect(result.finalScores.red).toBe(5);
    expect(result.finalScores.blue).toBe(7);
  });

  it('threshold flags stay independent across concurrent drains', () => {
    let slow = createTimer({
      direction: 'down',
      initialTime: 10_000,
      warningThreshold: 5_000,
      criticalThreshold: 2_000,
    });
    let fast = createTimer({
      direction: 'down',
      initialTime: 10_000,
      warningThreshold: 5_000,
      criticalThreshold: 2_000,
    });

    slow = addTime(slow, -4_000); // 6000 — neither
    fast = addTime(fast, -6_000); // 4000 — warning

    expect(isTimerWarning(slow)).toBe(false);
    expect(isTimerCritical(slow)).toBe(false);
    expect(isTimerWarning(fast)).toBe(true);
    expect(isTimerCritical(fast)).toBe(false);

    slow = addTime(slow, -5_000); // 1000 — critical
    fast = addTime(fast, -3_500); // 500 — critical

    expect(isTimerWarning(slow)).toBe(false);
    expect(isTimerCritical(slow)).toBe(true);
    expect(isTimerComplete(slow)).toBe(false);
    expect(isTimerCritical(fast)).toBe(true);
    expect(isTimerComplete(fast)).toBe(false);
  });
});
