/**
 * Wave 23 — storage streak calendar, achievements, owl/tutorial flags, settings.
 * Complements profile/stats file; still StorageManager only (no product inventing).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';
import { DEFAULT_SETTINGS } from '../../src/core/storage/types';

function isoDay(offsetDays: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

beforeEach(() => {
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  storage.resetAll();
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('Wave 23 storage — updateStreak calendar edges', () => {
  it('first play ever starts streak at 1 with today as start/last', () => {
    const streak = storage.updateStreak();
    const today = new Date().toISOString().split('T')[0];
    expect(streak.currentStreak).toBe(1);
    expect(streak.bestStreak).toBe(1);
    expect(streak.lastPlayDate).toBe(today);
    expect(streak.streakStartDate).toBe(today);
  });

  it('same-day second update is a no-op', () => {
    storage.updateStreak();
    const again = storage.updateStreak();
    expect(again.currentStreak).toBe(1);
    expect(again.bestStreak).toBe(1);
  });

  it('yesterday continue increments current and best', () => {
    const yesterday = isoDay(-1);
    storage.importData(
      JSON.stringify({
        version: 1,
        profile: null,
        streak: {
          currentStreak: 3,
          bestStreak: 3,
          lastPlayDate: yesterday,
          streakStartDate: isoDay(-3),
        },
        achievements: [],
        gameStats: {},
        owlState: {
          mood: 'happy',
          lastInteraction: 0,
          messagesSeen: [],
          tutorialsCompleted: [],
          totalMessagesShown: 0,
        },
        settings: { ...DEFAULT_SETTINGS },
      })
    );

    const streak = storage.updateStreak();
    expect(streak.currentStreak).toBe(4);
    expect(streak.bestStreak).toBe(4);
    expect(streak.lastPlayDate).toBe(new Date().toISOString().split('T')[0]);
  });

  it('gap day restarts streak at 1 without lowering best', () => {
    storage.importData(
      JSON.stringify({
        version: 1,
        profile: null,
        streak: {
          currentStreak: 5,
          bestStreak: 9,
          lastPlayDate: isoDay(-3),
          streakStartDate: isoDay(-7),
        },
        achievements: [],
        gameStats: {},
        owlState: {
          mood: 'happy',
          lastInteraction: 0,
          messagesSeen: [],
          tutorialsCompleted: [],
          totalMessagesShown: 0,
        },
        settings: { ...DEFAULT_SETTINGS },
      })
    );

    const streak = storage.updateStreak();
    const today = new Date().toISOString().split('T')[0];
    expect(streak.currentStreak).toBe(1);
    expect(streak.bestStreak).toBe(9);
    expect(streak.lastPlayDate).toBe(today);
    expect(streak.streakStartDate).toBe(today);
  });

  it('recordGameResult triggers streak update', () => {
    expect(storage.getStreak().currentStreak).toBe(0);
    storage.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 10,
      moveCount: 1,
      playedAt: Date.now(),
    });
    expect(storage.getStreak().currentStreak).toBe(1);
  });
});

describe('Wave 23 storage — achievements / messages / tutorials / settings', () => {
  it('unlockAchievement once then null on duplicate', () => {
    const first = storage.unlockAchievement('first-win');
    expect(first?.id).toBe('first-win');
    expect(first?.unlockedAt).toBeGreaterThan(0);
    expect(storage.hasAchievement('first-win')).toBe(true);
    expect(storage.unlockAchievement('first-win')).toBeNull();
    expect(storage.getAchievements()).toHaveLength(1);
  });

  it('markMessageSeen is idempotent and caps history at 50', () => {
    for (let i = 0; i < 55; i++) {
      storage.markMessageSeen(`msg-${i}`);
    }
    storage.markMessageSeen('msg-54'); // duplicate

    const owl = storage.getOwlState();
    expect(owl.messagesSeen).toHaveLength(50);
    expect(owl.messagesSeen[0]).toBe('msg-5');
    expect(owl.messagesSeen[49]).toBe('msg-54');
    expect(owl.totalMessagesShown).toBe(55);
    expect(storage.hasSeenMessage('msg-0')).toBe(false);
    expect(storage.hasSeenMessage('msg-54')).toBe(true);
  });

  it('markTutorialCompleted is idempotent', () => {
    storage.markTutorialCompleted('hex');
    storage.markTutorialCompleted('hex');
    expect(storage.hasTutorialCompleted('hex')).toBe(true);
    expect(storage.getOwlState().tutorialsCompleted).toEqual(['hex']);
    expect(storage.hasTutorialCompleted('fiar')).toBe(false);
  });

  it('updateOwlMood updates mood and lastInteraction', () => {
    const before = Date.now();
    storage.updateOwlMood('proud');
    const owl = storage.getOwlState();
    expect(owl.mood).toBe('proud');
    expect(owl.lastInteraction).toBeGreaterThanOrEqual(before);
  });

  it('updateSettings merges partials over defaults', () => {
    expect(storage.getSettings()).toEqual(DEFAULT_SETTINGS);
    storage.updateSettings({ owlEnabled: false, owlFrequency: 'quiet' });
    const settings = storage.getSettings();
    expect(settings.owlEnabled).toBe(false);
    expect(settings.owlFrequency).toBe('quiet');
    expect(settings.soundEnabled).toBe(true);
    expect(settings.reducedMotion).toBe(false);
  });
});
