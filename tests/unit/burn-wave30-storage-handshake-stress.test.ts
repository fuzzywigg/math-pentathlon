/**
 * Wave 30 — storage cross-domain handshake stress (profile×stats×streak×owl).
 * Combinatorial invariants over existing public StorageManager APIs.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage, CURRENT_DATA_VERSION } from '../../src/core/storage';
import { resetStorageHarness } from './helpers/storage-test-harness';

beforeEach(() => {
  vi.useFakeTimers();
  resetStorageHarness();
});

afterEach(() => {
  vi.useRealTimers();
  resetStorageHarness();
  vi.restoreAllMocks();
});

describe('Wave 30 storage-handshake — session simulation', () => {
  it('full play session preserves cross-domain consistency', () => {
    vi.setSystemTime(new Date('2026-09-01T10:00:00Z'));
    storage.createProfile('Session', 's');
    storage.updateSettings({ owlFrequency: 'chatty' });

    // Day 1: two wins
    storage.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 1000,
      moveCount: 5,
      playedAt: Date.now(),
    });
    storage.recordGameResult({
      gameId: 'calla',
      winner: 'player1',
      playerWon: true,
      duration: 2000,
      moveCount: 8,
      playedAt: Date.now(),
    });
    storage.unlockAchievement('day1');
    storage.updateOwlMood('encouraging');
    storage.markMessageSeen('welcome');
    storage.markTutorialCompleted('hex');

    expect(storage.getStreak().currentStreak).toBe(1);
    expect(storage.getTotalGamesPlayed()).toBe(2);
    expect(storage.getOverallWinRate()).toBe(1);

    // Day 2: continue streak, one loss
    vi.setSystemTime(new Date('2026-09-02T10:00:00Z'));
    storage.updateLastActive();
    storage.recordGameResult({
      gameId: 'hex',
      winner: 'ai',
      playerWon: false,
      duration: 1500,
      moveCount: 4,
      playedAt: Date.now(),
    });
    storage.unlockAchievement('day2');
    storage.updateOwlMood('thinking');

    expect(storage.getStreak().currentStreak).toBe(2);
    expect(storage.getGameStats('hex').gamesLost).toBe(1);
    expect(storage.getGameStats('hex').bestWinStreak).toBe(1);
    expect(storage.getTotalGamesPlayed()).toBe(3);
    expect(storage.getOverallWinRate()).toBeCloseTo(2 / 3);

    // Export / wipe / restore
    const snap = storage.exportData();
    storage.resetAll();
    expect(storage.importData(snap)).toBe(true);

    expect(storage.getProfile()?.name).toBe('Session');
    expect(storage.getProfile()?.lastActiveAt).toBe(
      new Date('2026-09-02T10:00:00Z').getTime()
    );
    expect(storage.getStreak()).toMatchObject({
      currentStreak: 2,
      bestStreak: 2,
      lastPlayDate: '2026-09-02',
      streakStartDate: '2026-09-01',
    });
    expect(storage.hasAchievement('day1')).toBe(true);
    expect(storage.hasAchievement('day2')).toBe(true);
    expect(storage.getOwlState().mood).toBe('thinking');
    expect(storage.hasSeenMessage('welcome')).toBe(true);
    expect(storage.hasTutorialCompleted('hex')).toBe(true);
    expect(storage.getSettings().owlFrequency).toBe('chatty');
    expect(storage.getTotalPlayTime()).toBe(4500);
  });
});

describe('Wave 30 storage-handshake — streak break mid-session', () => {
  it('gap day breaks streak while game win-streaks stay per-game', () => {
    vi.setSystemTime(new Date('2026-05-01T12:00:00Z'));
    storage.recordGameResult({
      gameId: 'fiar',
      winner: 'player1',
      playerWon: true,
      duration: 100,
      moveCount: 1,
      playedAt: Date.now(),
    });
    vi.setSystemTime(new Date('2026-05-02T12:00:00Z'));
    storage.recordGameResult({
      gameId: 'fiar',
      winner: 'player1',
      playerWon: true,
      duration: 100,
      moveCount: 1,
      playedAt: Date.now(),
    });
    expect(storage.getStreak().currentStreak).toBe(2);
    expect(storage.getGameStats('fiar').currentWinStreak).toBe(2);

    // Skip May 3
    vi.setSystemTime(new Date('2026-05-04T12:00:00Z'));
    storage.recordGameResult({
      gameId: 'fiar',
      winner: 'player1',
      playerWon: true,
      duration: 100,
      moveCount: 1,
      playedAt: Date.now(),
    });
    expect(storage.getStreak().currentStreak).toBe(1);
    expect(storage.getStreak().bestStreak).toBe(2);
    // game win streak continues across calendar gap
    expect(storage.getGameStats('fiar').currentWinStreak).toBe(3);
    expect(storage.getGameStats('fiar').bestWinStreak).toBe(3);
  });
});

describe('Wave 30 storage-handshake — message trim + achievements coexistence', () => {
  it('heavy message history does not drop achievements or settings', () => {
    storage.unlockAchievement('keep');
    storage.updateSettings({ reducedMotion: true });
    for (let i = 0; i < 60; i++) {
      storage.markMessageSeen(`m-${i}`);
    }
    expect(storage.hasAchievement('keep')).toBe(true);
    expect(storage.getSettings().reducedMotion).toBe(true);
    expect(storage.getOwlState().messagesSeen).toHaveLength(50);
    expect(storage.getOwlState().totalMessagesShown).toBe(60);
  });
});

describe('Wave 30 storage-handshake — version stamp invariant', () => {
  it('every mutating path keeps export version at CURRENT_DATA_VERSION', () => {
    const paths = [
      () => storage.createProfile('V', 'v'),
      () => storage.unlockAchievement('v-ach'),
      () => storage.updateOwlMood('sleepy'),
      () => storage.updateSettings({ soundEnabled: false }),
      () =>
        storage.recordGameResult({
          gameId: 'hex',
          winner: 'draw',
          playerWon: false,
          duration: 1,
          moveCount: 1,
          playedAt: Date.now(),
        }),
      () => storage.markTutorialCompleted('hex'),
    ];
    for (const step of paths) {
      step();
      expect(JSON.parse(storage.exportData()).version).toBe(
        CURRENT_DATA_VERSION
      );
    }
  });
});

describe('Wave 30 storage-handshake — many gameIds stress', () => {
  it('100 distinct gameIds remain addressable after saveNow', () => {
    for (let i = 0; i < 100; i++) {
      storage.recordGameResult({
        gameId: `g-${i}`,
        winner: i % 3 === 0 ? 'draw' : i % 2 === 0 ? 'player1' : 'ai',
        playerWon: i % 2 === 0 && i % 3 !== 0,
        duration: i + 1,
        moveCount: i,
        playedAt: Date.now(),
      });
    }
    storage.saveNow();
    expect(storage.getTotalGamesPlayed()).toBe(100);
    expect(Object.keys(storage.getAllGameStats())).toHaveLength(100);
    expect(storage.getGameStats('g-0').gamesDraw).toBe(1);
    expect(storage.getGameStats('g-1').gamesLost).toBe(1);
    expect(storage.getGameStats('g-2').gamesWon).toBe(1);

    const json = storage.exportData();
    storage.resetAll();
    expect(storage.importData(json)).toBe(true);
    expect(storage.getTotalGamesPlayed()).toBe(100);
    expect(storage.getTotalPlayTime()).toBe((100 * 101) / 2);
  });
});
