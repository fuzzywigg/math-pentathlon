/**
 * Wave 30 — storage multi-subsystem handshake (profile×stats×owl×settings).
 * End-to-end progress lifecycle invariants across the public StorageManager API.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';

const KEY = 'math-pentathlon-progress';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-10T12:00:00Z'));
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 30 storage-handshake — session progress montage', () => {
  it('profile + multi-day play + owl + settings survive export/import', () => {
    storage.createProfile('Montage', 'm');

    storage.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 1000,
      moveCount: 6,
      playedAt: Date.now(),
    });

    vi.setSystemTime(new Date('2026-09-11T12:00:00Z'));
    storage.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 800,
      moveCount: 5,
      playedAt: Date.now(),
    });
    storage.recordGameResult({
      gameId: 'calla',
      winner: 'ai',
      playerWon: false,
      duration: 500,
      moveCount: 4,
      playedAt: Date.now(),
    });

    storage.unlockAchievement('two-day');
    storage.updateOwlMood('celebrating');
    storage.markMessageSeen('day2-tip');
    storage.markTutorialCompleted('hex');
    storage.updateSettings({ owlFrequency: 'chatty', reducedMotion: true });

    expect(storage.getStreak().currentStreak).toBe(2);
    expect(storage.getTotalGamesPlayed()).toBe(3);
    expect(storage.getOverallWinRate()).toBeCloseTo(2 / 3);
    expect(storage.getGameStats('hex').currentWinStreak).toBe(2);

    const json = storage.exportData();
    storage.resetAll();
    expect(storage.importData(json)).toBe(true);

    expect(storage.getProfile()?.name).toBe('Montage');
    expect(storage.getStreak().currentStreak).toBe(2);
    expect(storage.getGameStats('hex').gamesWon).toBe(2);
    expect(storage.getGameStats('calla').gamesLost).toBe(1);
    expect(storage.hasAchievement('two-day')).toBe(true);
    expect(storage.getOwlState().mood).toBe('celebrating');
    expect(storage.hasSeenMessage('day2-tip')).toBe(true);
    expect(storage.hasTutorialCompleted('hex')).toBe(true);
    expect(storage.getSettings().owlFrequency).toBe('chatty');
    expect(storage.getSettings().reducedMotion).toBe(true);
  });

  it('localStorage snapshot after saveNow matches exportData parse', () => {
    storage.createProfile('Snap', 's');
    storage.unlockAchievement('snap');
    storage.saveNow();
    const fromLs = JSON.parse(localStorage.getItem(KEY)!);
    const fromExport = JSON.parse(storage.exportData());
    expect(fromLs.profile).toEqual(fromExport.profile);
    expect(fromLs.achievements).toEqual(fromExport.achievements);
    expect(fromLs.version).toBe(fromExport.version);
  });
});

describe('Wave 30 storage-handshake — isolation after reset', () => {
  it('post-reset mutations do not resurrect pre-reset achievements', () => {
    storage.unlockAchievement('old');
    storage.markMessageSeen('old-msg');
    storage.resetAll();
    storage.unlockAchievement('new');
    storage.markMessageSeen('new-msg');
    expect(storage.hasAchievement('old')).toBe(false);
    expect(storage.hasSeenMessage('old-msg')).toBe(false);
    expect(storage.hasAchievement('new')).toBe(true);
    expect(storage.hasSeenMessage('new-msg')).toBe(true);
    expect(storage.getAchievements()).toHaveLength(1);
  });

  it('win streak and calendar streak both reset independently', () => {
    storage.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 1,
      moveCount: 1,
      playedAt: Date.now(),
    });
    expect(storage.getGameStats('hex').currentWinStreak).toBe(1);
    expect(storage.getStreak().currentStreak).toBe(1);
    storage.resetAll();
    expect(storage.getGameStats('hex').currentWinStreak).toBe(0);
    expect(storage.getStreak().currentStreak).toBe(0);
  });
});
