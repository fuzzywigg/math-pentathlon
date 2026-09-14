/**
 * Wave 36 — storage recordGameResult duration/moveCount matrix leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-14T18:00:00Z'));
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 36 storage-stats-duration — accumulation matrix', () => {
  const durations = [0, 1, 999, 60_000, 3_600_000];

  it.each(durations)('accumulates duration=%i across three results', (d) => {
    storage.resetAll();
    for (let i = 0; i < 3; i++) {
      storage.recordGameResult({
        gameId: 'dur',
        winner: 'player1',
        playerWon: true,
        duration: d,
        moveCount: i,
        playedAt: Date.now(),
      });
    }
    const stats = storage.getGameStats('dur');
    expect(stats.totalPlayTime).toBe(d * 3);
    expect(stats.gamesPlayed).toBe(3);
    expect(stats.bestWinStreak).toBe(3);
  });

  it('zero-duration games still increment play count and streak', () => {
    storage.recordGameResult({
      gameId: 'instant',
      winner: 'player1',
      playerWon: true,
      duration: 0,
      moveCount: 0,
      playedAt: Date.now(),
    });
    expect(storage.getGameStats('instant').gamesPlayed).toBe(1);
    expect(storage.getTotalPlayTime()).toBe(0);
    expect(storage.getStreak().currentStreak).toBe(1);
  });
});
