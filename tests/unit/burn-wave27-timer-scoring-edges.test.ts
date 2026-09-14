/**
 * Wave 27 — timer format/parse options + scoring multiplier/result edges.
 * Distinct from wave 15 clock-edges and wave 26 success-playthroughs.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createTimer,
  startTimer,
  pauseTimer,
  addTime,
  formatTime,
  parseTime,
  getTimerProgress,
  isTimerWarning,
  isTimerCritical,
  isTimerComplete,
  createScoringState,
  addPlayer,
  addScore,
  addMultiplier,
  removeMultiplier,
  checkWinCondition,
  calculateGameResult,
  getLeaderboard,
  getScoreDifference,
  setPointValues,
  getPointValue,
  startNewRound,
  getPlayerScore,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Wave 27 timer — format/parse option matrix', () => {
  it('formatTime respects pad flags, separator, and centiseconds', () => {
    expect(
      formatTime(65_000, {
        padMinutes: false,
        padSeconds: false,
        separator: '-',
      })
    ).toBe('1-5');
    expect(
      formatTime(5_250, { showMilliseconds: true, padMinutes: true })
    ).toBe('00:05.25');
    expect(formatTime(0, { showMilliseconds: true })).toBe('00:00.00');
  });

  it('parseTime supports HH:MM:SS and MM:SS.cs', () => {
    expect(parseTime('01:02:03')).toBe((1 * 3600 + 2 * 60 + 3) * 1000);
    expect(parseTime('01:05')).toBe(65_000);
    expect(parseTime('01:05.50')).toBe(65_000 + 500);
    expect(parseTime('00:00.05')).toBe(50);
  });

  it('progress / warning / critical / complete interact with addTime', () => {
    let timer = createTimer({
      direction: 'down',
      initialTime: 10_000,
      warningThreshold: 4_000,
      criticalThreshold: 1_000,
    });
    expect(getTimerProgress(timer)).toBe(100);
    timer = addTime(timer, -7_000);
    expect(timer.remaining).toBe(3_000);
    expect(isTimerWarning(timer)).toBe(true);
    expect(isTimerCritical(timer)).toBe(false);
    timer = addTime(timer, -2_500);
    expect(isTimerCritical(timer)).toBe(true);
    timer = addTime(timer, -10_000);
    expect(timer.remaining).toBe(0);
    expect(isTimerComplete(timer)).toBe(true);
    expect(getTimerProgress(timer)).toBe(0);
  });

  it('start then pause is idempotent for double-start', () => {
    vi.setSystemTime(1_000_000);
    let timer = createTimer({ direction: 'up', initialTime: 0 });
    timer = startTimer(timer);
    const firstStart = timer.startTime;
    timer = startTimer(timer);
    expect(timer.startTime).toBe(firstStart);
    timer = pauseTimer(timer);
    expect(timer.state).toBe('paused');
    timer = pauseTimer(timer);
    expect(timer.state).toBe('paused');
  });
});

describe('Wave 27 scoring — multipliers / win / results', () => {
  it('global multipliers scale addScore then remove restores 1x', () => {
    let state = createScoringState({
      winCondition: { type: 'target', value: 20 },
    });
    state = addPlayer(state, 'p1', 'Ada');
    state = addPlayer(state, 'p2', 'Bo');
    state = addMultiplier(state, { id: 'x2', name: 'Double', multiplier: 2 });
    state = addScore(state, 'p1', 5);
    expect(getPlayerScore(state, 'p1')).toBe(10);
    expect(checkWinCondition(state)).toBeNull();

    state = removeMultiplier(state, 'x2');
    state = addScore(state, 'p1', 5);
    expect(getPlayerScore(state, 'p1')).toBe(15);

    state = addScore(state, 'p1', 5);
    expect(checkWinCondition(state)).toBe('p1');
  });

  it('exact winCondition and startNewRound bump currentRound', () => {
    let state = createScoringState({
      winCondition: { type: 'exact', value: 12 },
    });
    state = addPlayer(state, 'a', 'A');
    state = addPlayer(state, 'b', 'B');
    state = addScore(state, 'a', 7);
    expect(checkWinCondition(state)).toBeNull();
    state = addScore(state, 'a', 5);
    expect(getPlayerScore(state, 'a')).toBe(12);
    expect(checkWinCondition(state)).toBe('a');
    expect(getScoreDifference(state, 'a', 'b')).toBe(12);

    const before = state.currentRound;
    state = startNewRound(state);
    expect(state.currentRound).toBe(before + 1);
  });

  it('calculateGameResult ranks winner and records duration', () => {
    let state = createScoringState();
    state = addPlayer(state, 'p1', 'One');
    state = addPlayer(state, 'p2', 'Two');
    state = addScore(state, 'p1', 30);
    state = addScore(state, 'p2', 10);
    const result = calculateGameResult(state, 90_000);
    expect(result.totalDuration).toBe(90_000);
    expect(result.winnerId).toBe('p1');
    expect(result.isTie).toBe(false);
    expect(getLeaderboard(state)[0].playerId).toBe('p1');
  });

  it('tie result when scores match; setPointValues round-trip', () => {
    let state = createScoringState();
    state = addPlayer(state, 'p1', 'One');
    state = addPlayer(state, 'p2', 'Two');
    state = addScore(state, 'p1', 10);
    state = addScore(state, 'p2', 10);
    const result = calculateGameResult(state, 1_000);
    expect(result.isTie).toBe(true);
    expect(result.winnerId).toBeNull();
    expect(result.tiedPlayerIds.sort()).toEqual(['p1', 'p2']);

    state = setPointValues(state, { bonus: 7, chip: 3 });
    expect(getPointValue(state, 'bonus')).toBe(7);
    expect(getPointValue(state, 'missing')).toBe(0);
  });
});
