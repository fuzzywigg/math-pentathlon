/**
 * Wave 36 — storage aggregates / profile / settings leftover stress.
 * Beyond wave 30 aggregates / profile / settings. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  storage,
  DEFAULT_SETTINGS,
  createDefaultProgress,
  createDefaultGameStats,
} from '../../src/core/storage';

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

describe('Wave 36 storage — aggregate conservation under mixed outcomes', () => {
  it('win rate and totals track a mixed catalog', () => {
    const catalog = [
      {
        gameId: 'hex',
        playerWon: true,
        winner: 'player1' as const,
        duration: 100,
      },
      { gameId: 'hex', playerWon: false, winner: 'ai' as const, duration: 200 },
      {
        gameId: 'hex',
        playerWon: false,
        winner: 'draw' as const,
        duration: 50,
      },
      {
        gameId: 'fiar',
        playerWon: true,
        winner: 'player1' as const,
        duration: 300,
      },
      {
        gameId: 'fiar',
        playerWon: true,
        winner: 'player1' as const,
        duration: 400,
      },
      {
        gameId: 'calla',
        playerWon: false,
        winner: 'ai' as const,
        duration: 10,
      },
    ];
    for (const row of catalog) {
      storage.recordGameResult({
        ...row,
        moveCount: 1,
        playedAt: Date.now(),
      });
    }
    expect(storage.getTotalGamesPlayed()).toBe(6);
    expect(storage.getTotalPlayTime()).toBe(1060);
    // wins: hex1 + fiar2 = 3 of 6
    expect(storage.getOverallWinRate()).toBeCloseTo(0.5);
    expect(storage.getGamesPlayedByDivision()).toEqual({});
  });

  it('overall win rate is 0 with no games', () => {
    expect(storage.getOverallWinRate()).toBe(0);
    expect(storage.getTotalGamesPlayed()).toBe(0);
    expect(storage.getTotalPlayTime()).toBe(0);
  });
});

describe('Wave 36 storage — profile create uniqueness + lastActive', () => {
  it('createProfile generates distinct ids across calls', () => {
    const a = storage.createProfile('A', 'a');
    storage.resetAll();
    const b = storage.createProfile('B', 'b');
    expect(a.id).not.toBe(b.id);
    expect(a.createdAt).toBe(Date.parse('2026-09-14T12:00:00Z'));
  });

  it('updateLastActive is a no-op without a profile', () => {
    expect(storage.getProfile()).toBeNull();
    expect(() => storage.updateLastActive()).not.toThrow();
    expect(storage.getProfile()).toBeNull();
  });

  it('updateLastActive advances lastActiveAt with the clock', () => {
    storage.createProfile('Clock', 'c');
    const created = storage.getProfile()!.createdAt;
    vi.setSystemTime(new Date('2026-09-14T13:00:00Z'));
    storage.updateLastActive();
    expect(storage.getProfile()!.lastActiveAt).toBe(
      Date.parse('2026-09-14T13:00:00Z')
    );
    expect(storage.getProfile()!.createdAt).toBe(created);
  });
});

describe('Wave 36 storage — settings partial merge leftovers', () => {
  it('partial update keeps unspecified keys at prior values', () => {
    storage.updateSettings({ soundEnabled: false, owlFrequency: 'chatty' });
    storage.updateSettings({ reducedMotion: true });
    expect(storage.getSettings()).toEqual({
      ...DEFAULT_SETTINGS,
      soundEnabled: false,
      owlFrequency: 'chatty',
      reducedMotion: true,
    });
  });

  it('empty partial update is effectively a no-op copy merge', () => {
    storage.updateSettings({ owlEnabled: false });
    storage.updateSettings({});
    expect(storage.getSettings().owlEnabled).toBe(false);
  });
});

describe('Wave 36 storage — factory defaults stay isolated', () => {
  it('createDefaultProgress does not share nested arrays across calls', () => {
    const a = createDefaultProgress();
    const b = createDefaultProgress();
    a.owlState.messagesSeen.push('x');
    a.achievements.push({ id: 'y', unlockedAt: 1 });
    expect(b.owlState.messagesSeen).toEqual([]);
    expect(b.achievements).toEqual([]);
  });

  it('createDefaultGameStats stamps both play times to now', () => {
    vi.setSystemTime(5_555);
    const stats = createDefaultGameStats('prime');
    expect(stats.gameId).toBe('prime');
    expect(stats.firstPlayed).toBe(5_555);
    expect(stats.lastPlayed).toBe(5_555);
    expect(stats.gamesPlayed).toBe(0);
  });
});
