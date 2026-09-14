/**
 * Overnight timer-penalty deepen — paused clocks vs penalty / drain isolation.
 * Existing timer-scoring APIs only. Tests-only. No product inventing.
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
  getTimerValue,
  createScoringState,
  addScore,
  subtractScore,
  getPlayerScore,
  getRecentEntries,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1_000_000);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 41 timer-penalty — paused clock isolation', () => {
  it('pause freezes remaining; wall-clock advance alone levies no score penalty', () => {
    let timer = createTimer({ direction: 'down', initialTime: 8_000 });
    timer = startTimer(timer);
    timer = addTime(timer, -3_000);
    timer = pauseTimer(timer);

    let score = createScoringState({}, ['p1']);
    score = addScore(score, 'p1', 50);
    const frozenRemaining = timer.remaining;
    const frozenScore = getPlayerScore(score, 'p1');

    vi.setSystemTime(1_000_000 + 120_000);
    expect(timer.remaining).toBe(frozenRemaining);
    expect(timer.state).toBe('paused');
    expect(getPlayerScore(score, 'p1')).toBe(frozenScore);
    expect(getRecentEntries(score, 'p1', 5)).toHaveLength(1);
  });

  it('addTime while paused still drains; resume clears pauseTime without auto-penalty', () => {
    let timer = createTimer({ direction: 'down', initialTime: 5_000 });
    timer = startTimer(timer);
    expect(timer.startTime).toBe(1_000_000);

    vi.setSystemTime(1_000_500);
    timer = pauseTimer(timer);
    expect(timer.pauseTime).toBe(1_000_500);

    timer = addTime(timer, -2_000);
    expect(timer.remaining).toBe(3_000);
    expect(timer.state).toBe('paused');

    let score = createScoringState({ pointValues: { overtime: 4 } }, ['p1']);
    score = addScore(score, 'p1', 12);

    vi.setSystemTime(1_002_000);
    timer = startTimer(timer);
    expect(timer.state).toBe('running');
    expect(timer.pauseTime).toBeNull();
    expect(timer.startTime).toBe(1_002_000);
    // Resume alone does not subtract — caller must apply penalties.
    expect(getPlayerScore(score, 'p1')).toBe(12);
  });

  it('paused at complete: overtime penalties apply without requiring running state', () => {
    let timer = createTimer({
      direction: 'down',
      initialTime: 1_000,
      criticalThreshold: 100,
    });
    timer = startTimer(timer);
    timer = addTime(timer, -1_000);
    expect(isTimerComplete(timer)).toBe(true);
    timer = pauseTimer(timer);
    expect(timer.state).toBe('paused');

    let score = createScoringState({ minScore: -50 }, ['p1']);
    score = addScore(score, 'p1', 6);

    for (let i = 0; i < 3; i++) {
      timer = addTime(timer, -100);
      expect(timer.state).toBe('paused');
      expect(timer.remaining).toBe(0);
      score = subtractScore(score, 'p1', 2, 'overtime');
    }

    expect(getPlayerScore(score, 'p1')).toBe(0);
    expect(getRecentEntries(score, 'p1', 3).map((e) => e.reason)).toEqual([
      'overtime',
      'overtime',
      'overtime',
    ]);
  });

  it('pause on stopped is identity; stop/reset after overtime clears clock not score', () => {
    const stopped = createTimer({ initialTime: 4_000 });
    expect(pauseTimer(stopped)).toBe(stopped);

    let timer = startTimer(stopped);
    timer = addTime(timer, -4_000);
    expect(isTimerComplete(timer)).toBe(true);

    let score = createScoringState({}, ['p1']);
    score = addScore(score, 'p1', 9);
    score = subtractScore(score, 'p1', 3, 'overtime');
    expect(getPlayerScore(score, 'p1')).toBe(6);

    const afterStop = stopTimer(timer);
    expect(afterStop.state).toBe('stopped');
    expect(afterStop.remaining).toBe(4_000);
    expect(getTimerValue(afterStop)).toBe(4_000);
    expect(getPlayerScore(score, 'p1')).toBe(6);

    const afterReset = resetTimer(timer);
    expect(afterReset.state).toBe('stopped');
    expect(afterReset.remaining).toBe(4_000);
    expect(getPlayerScore(score, 'p1')).toBe(6);
  });

  it('double-pause during drain keeps same reference after first pause', () => {
    let timer = createTimer({ initialTime: 2_000 });
    timer = startTimer(timer);
    timer = addTime(timer, -500);
    const paused = pauseTimer(timer);
    expect(pauseTimer(paused)).toBe(paused);
    expect(paused.remaining).toBe(1_500);
  });
});
