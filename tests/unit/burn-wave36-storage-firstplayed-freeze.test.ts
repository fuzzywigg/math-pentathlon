/**
 * Wave 36 — storage firstPlayed freeze across later results.
 * Leftover after wave30 (defaults-only firstPlayed===lastPlayed). Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage, type GameResult } from '../../src/core/storage';

function result(partial: Partial<GameResult> & Pick<GameResult, 'gameId' | 'playerWon'>): GameResult {
  return {
    winner: partial.winner ?? (partial.playerWon ? 'player1' : 'ai'),
    duration: partial.duration ?? 1000,
    moveCount: partial.moveCount ?? 4,
    playedAt: partial.playedAt ?? Date.now(),
    ...partial,
  };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-01T12:00:00Z'));
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 36 storage-firstPlayed — freeze', () => {
  it('keeps firstPlayed while lastPlayed / gamesPlayed advance', () => {
    const t0 = Date.parse('2026-09-01T12:00:00Z');
    storage.recordGameResult(
      result({ gameId: 'hex', playerWon: true, playedAt: t0, duration: 500 })
    );
    const first = storage.getGameStats('hex').firstPlayed;
    expect(first).toBeGreaterThan(0);

    vi.setSystemTime(new Date('2026-09-05T18:00:00Z'));
    const t1 = Date.parse('2026-09-05T18:00:00Z');
    storage.recordGameResult(
      result({ gameId: 'hex', playerWon: false, playedAt: t1, duration: 800 })
    );

    const stats = storage.getGameStats('hex');
    expect(stats.firstPlayed).toBe(first);
    expect(stats.lastPlayed).toBe(t1);
    expect(stats.gamesPlayed).toBe(2);
    expect(stats.totalPlayTime).toBe(1300);
  });

  it('isolates firstPlayed per gameId', () => {
    storage.recordGameResult(result({ gameId: 'hex', playerWon: true }));
    const hexFirst = storage.getGameStats('hex').firstPlayed;
    vi.setSystemTime(new Date('2026-09-10T12:00:00Z'));
    storage.recordGameResult(result({ gameId: 'calla', playerWon: true }));
    expect(storage.getGameStats('calla').firstPlayed).toBeGreaterThan(hexFirst);
    expect(storage.getGameStats('hex').firstPlayed).toBe(hexFirst);
  });
});
