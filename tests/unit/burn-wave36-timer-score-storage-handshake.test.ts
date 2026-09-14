/**
 * Wave 36 — timer × scoring × storage cross-module handshake leftovers.
 * Prefer storage/timer slice; not dice/expression; not frac UI (#164/#165).
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';
import {
  createTimer,
  startTimer,
  pauseTimer,
  formatTime,
  getTimerValue,
  createScoringState,
  addScore,
  setPointValues,
  getPointValue,
  calculateGameResult,
  checkWinCondition,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-14T15:00:00Z'));
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 36 handshake — timed scored session into storage', () => {
  it('records duration from paused timer display into GameResult', () => {
    storage.createProfile('Racer', 'r');

    let timer = createTimer({ direction: 'up', initialTime: 120_000 });
    timer = startTimer(timer);
    vi.setSystemTime(new Date('2026-09-14T15:00:45Z'));
    // Manual elapsed mirror (API does not auto-tick): simulate wall accrual
    timer = { ...timer, elapsed: 45_000 };
    timer = pauseTimer(timer);

    let score = createScoringState(
      { winCondition: { type: 'target', value: 20 } },
      ['human', 'ai'],
      { human: 'Racer', ai: 'CPU' }
    );
    score = setPointValues(score, { capture: 5, default: 1 });
    score = addScore(score, 'human', getPointValue(score, 'capture'));
    score = addScore(score, 'human', getPointValue(score, 'capture'));
    score = addScore(score, 'human', getPointValue(score, 'capture'));
    score = addScore(score, 'human', getPointValue(score, 'capture'));
    expect(checkWinCondition(score)).toBe('human');

    const duration = getTimerValue(timer);
    expect(formatTime(duration)).toBe('00:45');

    const gameResult = calculateGameResult(score, duration);
    expect(gameResult.winnerId).toBe('human');

    const stats = storage.recordGameResult({
      gameId: 'timed-duel',
      winner: 'player1',
      playerWon: gameResult.winnerId === 'human',
      duration,
      moveCount: 4,
      playedAt: Date.now(),
    });

    expect(stats.totalPlayTime).toBe(45_000);
    expect(stats.gamesWon).toBe(1);
    expect(storage.getStreak().currentStreak).toBe(1);
    expect(storage.getProfile()?.name).toBe('Racer');

    const json = storage.exportData();
    storage.resetAll();
    expect(storage.importData(json)).toBe(true);
    expect(storage.getGameStats('timed-duel').totalPlayTime).toBe(45_000);
  });

  it('loss path still updates streak calendar and play time', () => {
    let timer = createTimer({ direction: 'down', initialTime: 60_000 });
    timer = { ...addPausedElapsed(timer, 12_500) };
    storage.recordGameResult({
      gameId: 'timed-duel',
      winner: 'ai',
      playerWon: false,
      duration: 12_500,
      moveCount: 2,
      playedAt: Date.now(),
    });
    expect(storage.getGameStats('timed-duel').gamesLost).toBe(1);
    expect(storage.getStreak().lastPlayDate).toBe('2026-09-14');
    expect(formatTime(12_500, { showMilliseconds: true })).toBe('00:12.50');
  });
});

function addPausedElapsed(
  timer: ReturnType<typeof createTimer>,
  elapsed: number
): ReturnType<typeof createTimer> {
  return { ...timer, elapsed, remaining: Math.max(0, timer.remaining - elapsed) };
}
