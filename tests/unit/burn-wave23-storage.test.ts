/**
 * Wave 23 — storage profile / stats / streak / achievements / owl / settings.
 * First burn coverage of StorageManager singleton. Distinct from wave 22 toolkit UI
 * and wave 19 serialization (game state, not localStorage progress).
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  storage,
  CURRENT_DATA_VERSION,
  createDefaultProgress,
} from '../../src/core/storage';

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 23 storage — profile', () => {
  it('createProfile sets id/name/avatar and get/updateLastActive', () => {
    expect(storage.getProfile()).toBeNull();
    const profile = storage.createProfile('Ada', 'owl');
    expect(profile.name).toBe('Ada');
    expect(profile.avatar).toBe('owl');
    expect(profile.id).toBeTruthy();
    expect(storage.getProfile()?.name).toBe('Ada');

    const before = storage.getProfile()!.lastActiveAt;
    vi.setSystemTime(before + 5000);
    storage.updateLastActive();
    expect(storage.getProfile()!.lastActiveAt).toBeGreaterThanOrEqual(before);
  });

  it('setProfile round-trips via saveNow', () => {
    storage.setProfile({
      id: 'p1',
      name: 'Bo',
      avatar: 'star',
      createdAt: 1,
      lastActiveAt: 2,
    });
    storage.saveNow();
    const raw = localStorage.getItem('math-pentathlon-progress');
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw!).profile.name).toBe('Bo');
  });
});

describe('Wave 23 storage — game stats / aggregates', () => {
  it('recordGameResult win/loss/draw updates streaks and totals', () => {
    const win = storage.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 1000,
      moveCount: 5,
      playedAt: Date.now(),
    });
    expect(win.gamesPlayed).toBe(1);
    expect(win.gamesWon).toBe(1);
    expect(win.currentWinStreak).toBe(1);
    expect(win.bestWinStreak).toBe(1);

    storage.recordGameResult({
      gameId: 'hex',
      winner: 'ai',
      playerWon: false,
      duration: 500,
      moveCount: 3,
      playedAt: Date.now(),
    });
    const afterLoss = storage.getGameStats('hex');
    expect(afterLoss.gamesLost).toBe(1);
    expect(afterLoss.currentWinStreak).toBe(0);
    expect(afterLoss.bestWinStreak).toBe(1);

    storage.recordGameResult({
      gameId: 'hex',
      winner: 'draw',
      playerWon: false,
      duration: 200,
      moveCount: 2,
      playedAt: Date.now(),
    });
    expect(storage.getGameStats('hex').gamesDraw).toBe(1);

    expect(storage.getTotalGamesPlayed()).toBe(3);
    expect(storage.getTotalPlayTime()).toBe(1700);
    expect(storage.getOverallWinRate()).toBeCloseTo(1 / 3);
    expect(Object.keys(storage.getAllGameStats())).toContain('hex');
  });

  it('getGameStats lazy-creates defaults; empty win rate is 0', () => {
    const fresh = storage.getGameStats('calla');
    expect(fresh.gameId).toBe('calla');
    expect(fresh.gamesPlayed).toBe(0);
    expect(storage.getOverallWinRate()).toBe(0);
    expect(storage.getGamesPlayedByDivision()).toEqual({});
  });
});

describe('Wave 23 storage — streak / achievements / owl / settings', () => {
  it('updateStreak first play then same-day no-op then continue', () => {
    vi.setSystemTime(new Date('2026-09-13T12:00:00Z'));
    const first = storage.updateStreak();
    expect(first.currentStreak).toBe(1);
    expect(first.lastPlayDate).toBe('2026-09-13');
    expect(first.bestStreak).toBe(1);

    const sameDay = storage.updateStreak();
    expect(sameDay.currentStreak).toBe(1);

    vi.setSystemTime(new Date('2026-09-14T12:00:00Z'));
    const next = storage.updateStreak();
    expect(next.currentStreak).toBe(2);
    expect(next.bestStreak).toBe(2);

    vi.setSystemTime(new Date('2026-09-20T12:00:00Z'));
    const broken = storage.updateStreak();
    expect(broken.currentStreak).toBe(1);
    expect(broken.bestStreak).toBe(2);
    expect(storage.getStreak().bestStreak).toBe(2);
  });

  it('achievements unlock once; owl mood/messages/tutorials', () => {
    expect(storage.unlockAchievement('first-win')).toMatchObject({
      id: 'first-win',
    });
    expect(storage.unlockAchievement('first-win')).toBeNull();
    expect(storage.hasAchievement('first-win')).toBe(true);
    expect(storage.getAchievements()).toHaveLength(1);

    storage.updateOwlMood('proud');
    expect(storage.getOwlState().mood).toBe('proud');
    storage.markMessageSeen('welcome-1');
    expect(storage.hasSeenMessage('welcome-1')).toBe(true);
    expect(storage.getOwlState().totalMessagesShown).toBe(1);
    storage.markMessageSeen('welcome-1'); // no double-count
    expect(storage.getOwlState().totalMessagesShown).toBe(1);

    storage.markTutorialCompleted('hex');
    storage.markTutorialCompleted('hex');
    expect(storage.hasTutorialCompleted('hex')).toBe(true);
    expect(storage.getOwlState().tutorialsCompleted).toEqual(['hex']);
  });

  it('settings merge; export/import/reset; createDefaultProgress version', () => {
    storage.updateSettings({ soundEnabled: false, owlFrequency: 'quiet' });
    expect(storage.getSettings().soundEnabled).toBe(false);
    expect(storage.getSettings().owlEnabled).toBe(true);
    expect(storage.getSettings().owlFrequency).toBe('quiet');

    storage.createProfile('Export', 'x');
    const json = storage.exportData();
    expect(JSON.parse(json).version).toBe(CURRENT_DATA_VERSION);

    storage.resetAll();
    expect(storage.getProfile()).toBeNull();
    expect(storage.importData(json)).toBe(true);
    expect(storage.getProfile()?.name).toBe('Export');
    expect(storage.importData('not-json')).toBe(false);

    const defaults = createDefaultProgress();
    expect(defaults.version).toBe(CURRENT_DATA_VERSION);
    expect(defaults.profile).toBeNull();
  });

  it('markMessageSeen trims history beyond 50', () => {
    for (let i = 0; i < 55; i++) {
      storage.markMessageSeen(`msg-${i}`);
    }
    const seen = storage.getOwlState().messagesSeen;
    expect(seen.length).toBeLessThanOrEqual(50);
    expect(seen).not.toContain('msg-0');
    expect(seen).toContain('msg-54');
  });
});
