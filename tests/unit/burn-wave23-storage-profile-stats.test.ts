/**
 * Wave 23 — storage profile + game stats / aggregates / export-import.
 * First burn coverage of StorageManager persistence APIs (not stats-dashboard UI).
 * Distinct from #125/#126 toolkit UI and #119/#121 seat-handoff.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';
import {
  CURRENT_DATA_VERSION,
  createDefaultGameStats,
} from '../../src/core/storage/types';

beforeEach(() => {
  localStorage.clear();
  storage.resetAll();
  vi.useRealTimers();
});

afterEach(() => {
  storage.resetAll();
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('Wave 23 storage — profile create / active / shape', () => {
  it('createProfile returns shaped profile and getProfile mirrors it', () => {
    const profile = storage.createProfile('Ada', 'owl');
    expect(profile.name).toBe('Ada');
    expect(profile.avatar).toBe('owl');
    expect(typeof profile.id).toBe('string');
    expect(profile.id.length).toBeGreaterThan(8);
    expect(profile.createdAt).toBeGreaterThan(0);
    expect(profile.lastActiveAt).toBe(profile.createdAt);

    const loaded = storage.getProfile();
    expect(loaded).toEqual(profile);
  });

  it('updateLastActive bumps lastActiveAt when a profile exists', () => {
    storage.createProfile('Bo', 'fox');
    const before = storage.getProfile()!.lastActiveAt;
    vi.spyOn(Date, 'now').mockReturnValue(before + 60_000);
    storage.updateLastActive();
    expect(storage.getProfile()!.lastActiveAt).toBe(before + 60_000);
  });

  it('updateLastActive is a no-op without a profile', () => {
    expect(storage.getProfile()).toBeNull();
    storage.updateLastActive();
    expect(storage.getProfile()).toBeNull();
  });

  it('setProfile replaces the stored profile', () => {
    storage.createProfile('Old', 'a');
    storage.setProfile({
      id: 'custom-id',
      name: 'New',
      avatar: 'b',
      createdAt: 10,
      lastActiveAt: 20,
    });
    expect(storage.getProfile()?.name).toBe('New');
    expect(storage.getProfile()?.id).toBe('custom-id');
  });
});

describe('Wave 23 storage — recordGameResult win / loss / draw', () => {
  it('win increments gamesWon and win streak + best', () => {
    const stats = storage.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 12_000,
      moveCount: 8,
      playedAt: 1_700_000_000_000,
    });
    expect(stats.gamesPlayed).toBe(1);
    expect(stats.gamesWon).toBe(1);
    expect(stats.gamesLost).toBe(0);
    expect(stats.gamesDraw).toBe(0);
    expect(stats.totalPlayTime).toBe(12_000);
    expect(stats.currentWinStreak).toBe(1);
    expect(stats.bestWinStreak).toBe(1);
    expect(stats.lastPlayed).toBe(1_700_000_000_000);
    expect(storage.getGameStats('hex')).toEqual(stats);
  });

  it('loss increments gamesLost and resets current win streak', () => {
    storage.recordGameResult({
      gameId: 'fiar',
      winner: 'player1',
      playerWon: true,
      duration: 1000,
      moveCount: 3,
      playedAt: 100,
    });
    const afterLoss = storage.recordGameResult({
      gameId: 'fiar',
      winner: 'ai',
      playerWon: false,
      duration: 2000,
      moveCount: 5,
      playedAt: 200,
    });
    expect(afterLoss.gamesPlayed).toBe(2);
    expect(afterLoss.gamesWon).toBe(1);
    expect(afterLoss.gamesLost).toBe(1);
    expect(afterLoss.currentWinStreak).toBe(0);
    expect(afterLoss.bestWinStreak).toBe(1);
    expect(afterLoss.totalPlayTime).toBe(3000);
  });

  it('draw increments gamesDraw and clears current win streak', () => {
    storage.recordGameResult({
      gameId: 'calla',
      winner: 'player1',
      playerWon: true,
      duration: 500,
      moveCount: 2,
      playedAt: 1,
    });
    const afterDraw = storage.recordGameResult({
      gameId: 'calla',
      winner: 'draw',
      playerWon: false,
      duration: 700,
      moveCount: 4,
      playedAt: 2,
    });
    expect(afterDraw.gamesDraw).toBe(1);
    expect(afterDraw.currentWinStreak).toBe(0);
    expect(afterDraw.bestWinStreak).toBe(1);
  });

  it('getGameStats lazily creates defaults for unknown game ids', () => {
    const stats = storage.getGameStats('never-played-yet');
    const defaults = createDefaultGameStats('never-played-yet');
    expect(stats.gameId).toBe(defaults.gameId);
    expect(stats.gamesPlayed).toBe(0);
    expect(stats.gamesWon).toBe(0);
    expect(Object.keys(storage.getAllGameStats())).toContain('never-played-yet');
  });
});

describe('Wave 23 storage — aggregates / export / import / reset', () => {
  it('getTotalGamesPlayed / getOverallWinRate / getTotalPlayTime aggregate', () => {
    expect(storage.getTotalGamesPlayed()).toBe(0);
    expect(storage.getOverallWinRate()).toBe(0);
    expect(storage.getTotalPlayTime()).toBe(0);

    storage.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 1000,
      moveCount: 1,
      playedAt: 1,
    });
    storage.recordGameResult({
      gameId: 'fiar',
      winner: 'ai',
      playerWon: false,
      duration: 3000,
      moveCount: 2,
      playedAt: 2,
    });

    expect(storage.getTotalGamesPlayed()).toBe(2);
    expect(storage.getTotalPlayTime()).toBe(4000);
    expect(storage.getOverallWinRate()).toBe(0.5);
  });

  it('exportData / importData round-trip preserves profile and stats', () => {
    storage.createProfile('Casey', 'star');
    storage.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 111,
      moveCount: 9,
      playedAt: 99,
    });
    const exported = storage.exportData();
    expect(JSON.parse(exported).version).toBe(CURRENT_DATA_VERSION);

    storage.resetAll();
    expect(storage.getProfile()).toBeNull();
    expect(storage.getTotalGamesPlayed()).toBe(0);

    expect(storage.importData(exported)).toBe(true);
    expect(storage.getProfile()?.name).toBe('Casey');
    expect(storage.getGameStats('hex').gamesWon).toBe(1);
    expect(storage.getGameStats('hex').totalPlayTime).toBe(111);
  });

  it('importData returns false on invalid JSON and leaves data intact', () => {
    storage.createProfile('Keep', 'me');
    expect(storage.importData('{not-json')).toBe(false);
    expect(storage.getProfile()?.name).toBe('Keep');
  });

  it('resetAll clears profile, stats, and localStorage key', () => {
    storage.createProfile('Zap', 'z');
    storage.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 1,
      moveCount: 1,
      playedAt: 1,
    });
    storage.saveNow();
    expect(localStorage.getItem('math-pentathlon-progress')).toBeTruthy();

    storage.resetAll();
    expect(storage.getProfile()).toBeNull();
    expect(storage.getTotalGamesPlayed()).toBe(0);
    expect(storage.getAchievements()).toEqual([]);
    const stored = JSON.parse(
      localStorage.getItem('math-pentathlon-progress')!
    );
    expect(stored.profile).toBeNull();
    expect(stored.gameStats).toEqual({});
  });

  it('getGamesPlayedByDivision returns empty stub object', () => {
    expect(storage.getGamesPlayedByDivision()).toEqual({});
  });
});
