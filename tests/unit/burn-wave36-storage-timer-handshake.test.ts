/**
 * Wave 36 — storage × timer-scoring cross-domain session handshake.
 * Distinct from wave 31 timer-score-only handshake. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';
import {
  createTimer,
  startTimer,
  pauseTimer,
  addTime,
  formatTime,
  parseTime,
  isTimerWarning,
  isTimerComplete,
  createScoringState,
  addScore,
  addMultiplier,
  checkWinCondition,
  calculateGameResult,
  getPlayerScore,
  getTimerValue,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-14T12:00:00Z'));
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 36 handshake — timed match persists via storage', () => {
  it('records match duration from timer remaining into game stats', () => {
    storage.createProfile('Racer', 'r');

    let timer = createTimer({
      direction: 'down',
      initialTime: 60_000,
      warningThreshold: 15_000,
      criticalThreshold: 5_000,
    });
    timer = startTimer(timer);

    let score = createScoringState(
      { winCondition: { type: 'target', value: 20 }, maxScore: 100 },
      ['human', 'cpu'],
      { human: 'Racer', cpu: 'CPU' }
    );
    score = addMultiplier(score, { id: 'x2', name: 'Hot', multiplier: 2 });
    score = addScore(score, 'human', 5, 'hit'); // 10
    score = addScore(score, 'cpu', 4, 'hit'); // 8
    score = addScore(score, 'human', 5, 'hit'); // 20
    expect(checkWinCondition(score)).toBe('human');

    timer = addTime(timer, -48_000);
    expect(getTimerValue(timer)).toBe(12_000);
    expect(isTimerWarning(timer)).toBe(true);
    timer = pauseTimer(timer);

    const duration = 60_000 - timer.remaining;
    const result = calculateGameResult(score, duration);
    expect(result.winnerId).toBe('human');
    expect(result.totalDuration).toBe(duration);

    storage.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: result.totalDuration,
      moveCount: 3,
      playedAt: Date.now(),
    });
    storage.unlockAchievement('speed-win');
    storage.updateOwlMood('celebrating');
    storage.saveNow();

    expect(storage.getGameStats('hex').totalPlayTime).toBe(48_000);
    expect(storage.getGameStats('hex').gamesWon).toBe(1);
    expect(storage.hasAchievement('speed-win')).toBe(true);

    const exported = storage.exportData();
    storage.resetAll();
    expect(storage.importData(exported)).toBe(true);
    expect(storage.getProfile()?.name).toBe('Racer');
    expect(storage.getGameStats('hex').totalPlayTime).toBe(48_000);
    expect(storage.getOwlState().mood).toBe('celebrating');
  });
});

describe('Wave 36 handshake — multi-day timed sessions', () => {
  it('aggregates play time across days while advancing calendar streak', () => {
    storage.createProfile('Marathon', 'm');

    for (const [day, drain] of [
      ['2026-09-10', 10_000],
      ['2026-09-11', 20_000],
      ['2026-09-12', 5_000],
    ] as const) {
      vi.setSystemTime(new Date(`${day}T18:00:00Z`));
      let timer = createTimer({ initialTime: 30_000 });
      timer = startTimer(timer);
      timer = addTime(timer, -drain);
      expect(isTimerComplete(timer)).toBe(drain >= 30_000);

      let score = createScoringState({}, ['p1']);
      score = addScore(score, 'p1', drain / 1_000);
      expect(getPlayerScore(score, 'p1')).toBe(drain / 1_000);

      storage.recordGameResult({
        gameId: 'calla',
        winner: 'player1',
        playerWon: true,
        duration: drain,
        moveCount: 2,
        playedAt: Date.now(),
      });
    }

    expect(storage.getStreak().currentStreak).toBe(3);
    expect(storage.getTotalPlayTime()).toBe(35_000);
    expect(storage.getOverallWinRate()).toBe(1);
    expect(formatTime(storage.getTotalPlayTime())).toBe('00:35');
    expect(parseTime(formatTime(storage.getTotalPlayTime()))).toBe(35_000);
  });
});
