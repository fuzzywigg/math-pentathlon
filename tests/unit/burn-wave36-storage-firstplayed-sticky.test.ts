/**
 * Wave 36 — storage firstPlayed sticky across recordGameResult chronology.
 * Leftover beyond wave 30 stats-record / types-defaults. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage, type GameResult } from '../../src/core/storage';

function result(
  partial: Partial<GameResult> & Pick<GameResult, 'gameId' | 'playerWon'>
): GameResult {
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
  vi.setSystemTime(new Date('2026-09-01T10:00:00Z'));
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 36 storage — firstPlayed sticky stamp', () => {
  it('lazy getGameStats stamps firstPlayed=lastPlayed at creation time', () => {
    const t0 = Date.parse('2026-09-01T10:00:00Z');
    const fresh = storage.getGameStats('hex');
    expect(fresh.firstPlayed).toBe(t0);
    expect(fresh.lastPlayed).toBe(t0);
    expect(fresh.gamesPlayed).toBe(0);
  });

  it('firstPlayed stays fixed while lastPlayed advances with later results', () => {
    const t0 = Date.parse('2026-09-01T10:00:00Z');
    storage.recordGameResult(
      result({ gameId: 'hex', playerWon: true, playedAt: t0, duration: 100 })
    );

    vi.setSystemTime(new Date('2026-09-05T15:00:00Z'));
    const t1 = Date.parse('2026-09-05T15:00:00Z');
    storage.recordGameResult(
      result({ gameId: 'hex', playerWon: false, playedAt: t1, duration: 200 })
    );

    vi.setSystemTime(new Date('2026-09-14T08:00:00Z'));
    const t2 = Date.parse('2026-09-14T08:00:00Z');
    storage.recordGameResult(
      result({ gameId: 'hex', playerWon: true, playedAt: t2, duration: 300 })
    );

    const stats = storage.getGameStats('hex');
    expect(stats.firstPlayed).toBe(t0);
    expect(stats.lastPlayed).toBe(t2);
    expect(stats.gamesPlayed).toBe(3);
    expect(stats.totalPlayTime).toBe(600);
  });

  it('per-game firstPlayed is independent across gameIds', () => {
    const tHex = Date.parse('2026-09-01T10:00:00Z');
    storage.recordGameResult(
      result({ gameId: 'hex', playerWon: true, playedAt: tHex })
    );

    vi.setSystemTime(new Date('2026-09-10T12:00:00Z'));
    const tCalla = Date.parse('2026-09-10T12:00:00Z');
    storage.recordGameResult(
      result({ gameId: 'calla', playerWon: true, playedAt: tCalla })
    );

    expect(storage.getGameStats('hex').firstPlayed).toBe(tHex);
    expect(storage.getGameStats('calla').firstPlayed).toBe(tCalla);
  });

  it('import preserves firstPlayed even when lastPlayed is newer', () => {
    const blob = {
      version: 1,
      profile: null,
      streak: {
        currentStreak: 0,
        bestStreak: 0,
        lastPlayDate: '',
        streakStartDate: '',
      },
      achievements: [],
      gameStats: {
        fiar: {
          gameId: 'fiar',
          gamesPlayed: 5,
          gamesWon: 2,
          gamesLost: 3,
          gamesDraw: 0,
          totalPlayTime: 9000,
          bestWinStreak: 2,
          currentWinStreak: 0,
          lastPlayed: 9_000,
          firstPlayed: 1_000,
        },
      },
      owlState: {
        mood: 'happy' as const,
        lastInteraction: 0,
        messagesSeen: [],
        tutorialsCompleted: [],
        totalMessagesShown: 0,
      },
      settings: {
        owlEnabled: true,
        soundEnabled: true,
        reducedMotion: false,
        owlFrequency: 'normal' as const,
      },
    };
    expect(storage.importData(JSON.stringify(blob))).toBe(true);
    expect(storage.getGameStats('fiar').firstPlayed).toBe(1_000);
    expect(storage.getGameStats('fiar').lastPlayed).toBe(9_000);
  });
});
