/**
 * Wave 36 — storage getter copy / live-ref isolation matrix.
 * Deepens wave 30 owl-mood / stats shallow-copy leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';

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

describe('Wave 36 storage — defensive copies on getters', () => {
  it('getStreak returns a shallow copy', () => {
    storage.updateStreak();
    const snap = storage.getStreak();
    snap.currentStreak = 999;
    snap.lastPlayDate = 'mutated';
    expect(storage.getStreak().currentStreak).toBe(1);
    expect(storage.getStreak().lastPlayDate).toBe('2026-09-14');
  });

  it('getAchievements returns a new array copy', () => {
    storage.unlockAchievement('alpha');
    storage.unlockAchievement('beta');
    const list = storage.getAchievements();
    list.pop();
    list.push({ id: 'fake', unlockedAt: 0 });
    expect(
      storage
        .getAchievements()
        .map((a) => a.id)
        .sort()
    ).toEqual(['alpha', 'beta']);
  });

  it('getSettings returns a shallow copy', () => {
    const settings = storage.getSettings();
    settings.soundEnabled = false;
    settings.owlFrequency = 'chatty';
    expect(storage.getSettings().soundEnabled).toBe(true);
    expect(storage.getSettings().owlFrequency).toBe('normal');
  });

  it('getOwlState deep-copies message and tutorial arrays', () => {
    storage.markMessageSeen('m1');
    storage.markTutorialCompleted('t1');
    const owl = storage.getOwlState();
    owl.messagesSeen.push('injected');
    owl.tutorialsCompleted.push('injected');
    owl.mood = 'thinking';
    expect(storage.getOwlState().messagesSeen).toEqual(['m1']);
    expect(storage.getOwlState().tutorialsCompleted).toEqual(['t1']);
    expect(storage.getOwlState().mood).toBe('happy');
  });

  it('getAllGameStats map copy does not drop internal entries', () => {
    storage.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 100,
      moveCount: 2,
      playedAt: Date.now(),
    });
    const all = storage.getAllGameStats();
    all['injected'] = {
      gameId: 'injected',
      gamesPlayed: 9,
      gamesWon: 9,
      gamesLost: 0,
      gamesDraw: 0,
      totalPlayTime: 9,
      bestWinStreak: 9,
      currentWinStreak: 9,
      lastPlayed: 9,
      firstPlayed: 9,
    };
    delete all.hex;
    expect(Object.keys(storage.getAllGameStats()).sort()).toEqual(['hex']);
    expect(storage.getTotalGamesPlayed()).toBe(1);
  });
});

describe('Wave 36 storage — live profile reference hazard documented', () => {
  it('mutating getProfile() fields reflects in subsequent getProfile', () => {
    // Public API returns the live profile object; callers must not mutate.
    storage.createProfile('Live', 'L');
    const profile = storage.getProfile()!;
    profile.name = 'Mutated';
    expect(storage.getProfile()?.name).toBe('Mutated');
  });

  it('setProfile replaces the live reference entirely', () => {
    storage.createProfile('Old', 'o');
    storage.setProfile({
      id: 'new-id',
      name: 'New',
      avatar: 'n',
      createdAt: 10,
      lastActiveAt: 20,
    });
    expect(storage.getProfile()?.id).toBe('new-id');
    expect(storage.getProfile()?.name).toBe('New');
  });
});
