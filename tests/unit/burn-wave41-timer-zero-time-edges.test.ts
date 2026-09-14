/**
 * Overnight timer-penalty deepen — zero-time edges already handled by APIs.
 * Beyond wave 36 progress-zero / wave 39 format. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createTimer,
  startTimer,
  pauseTimer,
  stopTimer,
  addTime,
  getTimerValue,
  getTimerProgress,
  isTimerWarning,
  isTimerCritical,
  isTimerComplete,
  formatTime,
  parseTime,
  createScoringState,
  subtractScore,
  addScore,
  getPlayerScore,
  getPointValue,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(50_000);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 41 timer-penalty — zero initialTime edges', () => {
  it('countdown initialTime 0 starts complete and critical when threshold set', () => {
    let t = createTimer({
      direction: 'down',
      initialTime: 0,
      warningThreshold: 1_000,
      criticalThreshold: 0,
    });
    expect(t.remaining).toBe(0);
    expect(getTimerValue(t)).toBe(0);
    expect(getTimerProgress(t)).toBe(0);
    expect(isTimerComplete(t)).toBe(true);
    expect(isTimerCritical(t)).toBe(true);
    // warning requires remaining > critical; at 0 with critical 0 → not warning
    expect(isTimerWarning(t)).toBe(false);

    t = startTimer(t);
    expect(t.state).toBe('running');
    t = addTime(t, -1);
    expect(t.remaining).toBe(0);
    t = addTime(t, 250);
    expect(t.remaining).toBe(250);
    expect(isTimerComplete(t)).toBe(false);
  });

  it('count-up initialTime 0 never completes; progress stays 0 until elapsed', () => {
    let t = createTimer({ direction: 'up', initialTime: 0 });
    expect(getTimerValue(t)).toBe(0);
    expect(getTimerProgress(t)).toBe(0);
    expect(isTimerComplete(t)).toBe(false);

    t = { ...t, elapsed: 10_000 };
    expect(getTimerValue(t)).toBe(10_000);
    // initialTime 0 → progress helper short-circuits to 0
    expect(getTimerProgress(t)).toBe(0);
    expect(isTimerComplete(t)).toBe(false);
  });

  it('addTime from zero bonus then drain-to-zero is complete again', () => {
    let t = createTimer({ direction: 'down', initialTime: 0 });
    expect(isTimerComplete(t)).toBe(true);
    t = addTime(t, 1_000);
    expect(t.remaining).toBe(1_000);
    expect(isTimerComplete(t)).toBe(false);
    t = addTime(t, -1_000);
    expect(t.remaining).toBe(0);
    expect(isTimerComplete(t)).toBe(true);
    t = addTime(t, -50);
    expect(t.remaining).toBe(0);
  });

  it('format/parse round-trip at zero; stop restores initialTime 0', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(0, { showMilliseconds: true })).toBe('00:00.00');
    expect(parseTime('00:00')).toBe(0);
    expect(parseTime('00:00.00')).toBe(0);

    let t = createTimer({ initialTime: 0 });
    t = startTimer(t);
    t = addTime(t, 5_000);
    t = pauseTimer(t);
    expect(t.remaining).toBe(5_000);
    t = stopTimer(t);
    expect(t.remaining).toBe(0);
    expect(t.state).toBe('stopped');
    expect(isTimerComplete(t)).toBe(true);
  });
});

describe('Wave 41 timer-penalty — zero remaining + score ledger', () => {
  it('overtime penalty when clock already at zero and pointValues default missing', () => {
    const t = {
      ...createTimer({ direction: 'down', initialTime: 1 }),
      remaining: 0,
    };
    expect(isTimerComplete(t)).toBe(true);

    let score = createScoringState({ pointValues: { hit: 5 } }, ['p1']);
    expect(getPointValue(score, 'overtime')).toBe(0);
    score = addScore(score, 'p1', 5, 'hit');
    score = subtractScore(score, 'p1', getPointValue(score, 'overtime'), 'overtime');
    expect(getPlayerScore(score, 'p1')).toBe(5);
  });

  it('warning band collapses when criticalThreshold equals warning at zero', () => {
    const t = {
      ...createTimer({
        direction: 'down',
        initialTime: 5_000,
        warningThreshold: 0,
        criticalThreshold: 0,
      }),
      remaining: 0,
    };
    expect(isTimerComplete(t)).toBe(true);
    expect(isTimerCritical(t)).toBe(true);
    expect(isTimerWarning(t)).toBe(false);
  });
});
