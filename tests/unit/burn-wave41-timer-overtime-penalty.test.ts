/**
 * Overnight timer-penalty deepen — overtime score penalties after countdown complete.
 * Existing timer-scoring APIs only. Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createTimer,
  startTimer,
  addTime,
  isTimerComplete,
  isTimerCritical,
  getTimerProgress,
  createScoringState,
  addScore,
  subtractScore,
  getPlayerScore,
  getRecentEntries,
  getPointValue,
  setPointValues,
  calculateGameResult,
  getLeaderboard,
  checkWinCondition,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(10_000_000);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 41 timer-penalty — overtime after complete', () => {
  it('clamps further drain at zero then applies overtime score penalties', () => {
    let timer = createTimer({
      direction: 'down',
      initialTime: 3_000,
      criticalThreshold: 500,
    });
    timer = startTimer(timer);

    let score = createScoringState(
      {
        // Allow negatives so overtime can drive below zero without clamp noise.
        minScore: -100,
        pointValues: { hit: 10, overtime: 3 },
      },
      ['p1', 'p2'],
      { p1: 'Red', p2: 'Blue' }
    );

    score = addScore(score, 'p1', getPointValue(score, 'hit'), 'hit');
    score = addScore(score, 'p2', getPointValue(score, 'hit'), 'hit');
    expect(getPlayerScore(score, 'p1')).toBe(10);

    // Drain past zero in uneven ticks — remaining clamps, complete sticks.
    for (const delta of [-1_000, -1_500, -2_000, -500]) {
      timer = addTime(timer, delta);
    }
    expect(timer.remaining).toBe(0);
    expect(isTimerComplete(timer)).toBe(true);
    expect(isTimerCritical(timer)).toBe(true);
    expect(getTimerProgress(timer)).toBe(0);

    // Overtime ticks: clock stays at 0; each tick levies a score penalty.
    const overtimeTicks = 4;
    for (let i = 0; i < overtimeTicks; i++) {
      timer = addTime(timer, -250);
      expect(timer.remaining).toBe(0);
      expect(isTimerComplete(timer)).toBe(true);
      score = subtractScore(
        score,
        'p1',
        getPointValue(score, 'overtime'),
        'overtime'
      );
    }

    expect(getPlayerScore(score, 'p1')).toBe(10 - overtimeTicks * 3);
    expect(getPlayerScore(score, 'p2')).toBe(10);
    const recent = getRecentEntries(score, 'p1', overtimeTicks);
    expect(recent.every((e) => e.reason === 'overtime' && e.amount === -3)).toBe(
      true
    );
  });

  it('overtime penalties honor minScore clamp and leave opponent untouched', () => {
    let timer = createTimer({ direction: 'down', initialTime: 500 });
    timer = addTime(timer, -500);
    expect(isTimerComplete(timer)).toBe(true);

    let score = createScoringState(
      { minScore: 0, pointValues: { overtime: 7 } },
      ['late', 'safe']
    );
    score = addScore(score, 'late', 10);
    score = addScore(score, 'safe', 20);

    // Three overtime penalties would go to -11 without clamp → floors at 0.
    for (let i = 0; i < 3; i++) {
      timer = addTime(timer, -100);
      score = subtractScore(
        score,
        'late',
        getPointValue(score, 'overtime'),
        'overtime'
      );
    }

    expect(timer.remaining).toBe(0);
    expect(getPlayerScore(score, 'late')).toBe(0);
    expect(getPlayerScore(score, 'safe')).toBe(20);
  });

  it('pointValues overtime can be updated mid-overtime via setPointValues', () => {
    let timer = {
      ...createTimer({ direction: 'down', initialTime: 100 }),
      remaining: 0,
    };
    expect(isTimerComplete(timer)).toBe(true);

    let score = createScoringState(
      { pointValues: { overtime: 2 } },
      ['solo']
    );
    score = addScore(score, 'solo', 20);

    score = subtractScore(score, 'solo', getPointValue(score, 'overtime'), 'ot1');
    expect(getPlayerScore(score, 'solo')).toBe(18);

    score = setPointValues(score, { overtime: 5 });
    expect(getPointValue(score, 'overtime')).toBe(5);
    score = subtractScore(score, 'solo', getPointValue(score, 'overtime'), 'ot2');
    expect(getPlayerScore(score, 'solo')).toBe(13);

    timer = addTime(timer, -999);
    expect(timer.remaining).toBe(0);
  });

  it('game result duration can include overtime wall beyond initialTime', () => {
    let timer = createTimer({ direction: 'down', initialTime: 2_000 });
    timer = addTime(timer, -2_000);
    expect(isTimerComplete(timer)).toBe(true);

    let score = createScoringState({}, ['a', 'b']);
    score = addScore(score, 'a', 15);
    score = addScore(score, 'b', 9);
    score = subtractScore(score, 'a', 1, 'overtime');

    const overtimeMs = 750;
    const duration = timer.config.initialTime + overtimeMs;
    const result = calculateGameResult(score, duration);
    expect(result.totalDuration).toBe(2_750);
    expect(result.winnerId).toBe('a');
    expect(result.finalScores.a).toBe(14);
    expect(getLeaderboard(score)[0].playerId).toBe('a');
    expect(checkWinCondition(score)).toBeNull();
  });
});
