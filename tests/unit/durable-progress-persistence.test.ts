/**
 * Durable on-device progress persistence — constructor load() path.
 *
 * Exercises real localStorage → StorageManager construction via vi.resetModules
 * (not just importData on the live singleton). Covers round-trip save/load,
 * older/missing schema versions, corrupted/truncated JSON, quota / unavailable
 * storage, and clear/reset. Isolated project — see vitest.config.ts.
 *
 * Distinct from wave 30/36 importData corrupt suites and state-roundtrip fuzz
 * (in-memory game engines, not progress localStorage).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  CURRENT_DATA_VERSION,
  DEFAULT_SETTINGS,
  DEFAULT_OWL_STATE,
  createDefaultProgress,
  type ProgressData,
} from '../../src/core/storage/types';
import { resetSettingsFlagsForTests } from '../../src/core/settings-flags';

const STORAGE_KEY = 'math-pentathlon-progress';

type StorageModule = typeof import('../../src/core/storage');

async function loadFreshStorage(): Promise<StorageModule['storage']> {
  vi.resetModules();
  resetSettingsFlagsForTests();
  const mod = (await import('../../src/core/storage')) as StorageModule;
  return mod.storage;
}

function sampleProgress(overrides: Partial<ProgressData> = {}): ProgressData {
  return {
    version: CURRENT_DATA_VERSION,
    profile: {
      id: 'durable-1',
      name: 'DurableKid',
      avatar: 'owl',
      createdAt: 100,
      lastActiveAt: 200,
    },
    streak: {
      currentStreak: 3,
      bestStreak: 5,
      lastPlayDate: '2026-10-07',
      streakStartDate: '2026-10-05',
    },
    achievements: [{ id: 'first-win', unlockedAt: 150 }],
    gameStats: {
      hex: {
        gameId: 'hex',
        gamesPlayed: 4,
        gamesWon: 2,
        gamesLost: 1,
        gamesDraw: 1,
        totalPlayTime: 4000,
        bestWinStreak: 2,
        currentWinStreak: 0,
        lastPlayed: 200,
        firstPlayed: 100,
      },
    },
    owlState: {
      mood: 'proud',
      lastInteraction: 180,
      messagesSeen: ['tip-1'],
      tutorialsCompleted: ['hex'],
      totalMessagesShown: 1,
    },
    settings: {
      owlEnabled: true,
      soundEnabled: false,
      reducedMotion: true,
      owlFrequency: 'quiet',
    },
    ...overrides,
  };
}

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  resetSettingsFlagsForTests();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  resetSettingsFlagsForTests();
  vi.restoreAllMocks();
});

describe('durable progress — round-trip save/load via constructor', () => {
  it('saveNow blob reloads intact after module remount', async () => {
    const first = await loadFreshStorage();
    first.createProfile('RoundTrip', 'rt');
    first.unlockAchievement('badge-a');
    first.updateSettings({ soundEnabled: false, owlFrequency: 'chatty' });
    first.updateOwlMood('celebrating');
    first.markMessageSeen('welcome');
    first.markTutorialCompleted('hex');
    first.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 1200,
      moveCount: 8,
      playedAt: Date.now(),
    });
    first.saveNow();

    const snapshot = localStorage.getItem(STORAGE_KEY);
    expect(snapshot).toBeTruthy();

    const second = await loadFreshStorage();
    expect(second.getProfile()?.name).toBe('RoundTrip');
    expect(second.hasAchievement('badge-a')).toBe(true);
    expect(second.getSettings().soundEnabled).toBe(false);
    expect(second.getSettings().owlFrequency).toBe('chatty');
    expect(second.getOwlState().mood).toBe('celebrating');
    expect(second.hasSeenMessage('welcome')).toBe(true);
    expect(second.hasTutorialCompleted('hex')).toBe(true);
    expect(second.getGameStats('hex').gamesWon).toBe(1);
    expect(second.getTotalGamesPlayed()).toBe(1);

    // Disk bytes still match what the remounted singleton exports
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).profile.name).toBe(
      'RoundTrip'
    );
    expect(JSON.parse(second.exportData()).profile.name).toBe('RoundTrip');
    expect(snapshot).toBe(localStorage.getItem(STORAGE_KEY));
  });

  it('missing localStorage key starts from createDefaultProgress shape', async () => {
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    const storage = await loadFreshStorage();
    const defaults = createDefaultProgress();
    expect(storage.getProfile()).toBeNull();
    expect(storage.getSettings()).toEqual(defaults.settings);
    expect(storage.getOwlState()).toEqual(defaults.owlState);
    expect(storage.getAchievements()).toEqual([]);
    expect(storage.getAllGameStats()).toEqual({});
    expect(JSON.parse(storage.exportData()).version).toBe(CURRENT_DATA_VERSION);
  });
});

describe('durable progress — older / missing schema versions on load', () => {
  it('version 0 blob migrates to CURRENT and keeps profile/stats', async () => {
    // Legacy sparse payload: old version, no settings block.
    const legacy = sampleProgress({ version: 0 });
    const { settings: _drop, ...sparse } = legacy;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sparse));

    const storage = await loadFreshStorage();
    expect(storage.getProfile()?.name).toBe('DurableKid');
    expect(storage.getGameStats('hex').gamesPlayed).toBe(4);
    expect(storage.getSettings()).toEqual(DEFAULT_SETTINGS);
    expect(JSON.parse(storage.exportData()).version).toBe(CURRENT_DATA_VERSION);
    void _drop;
  });

  it('missing version field is filled on load', async () => {
    const { version: _v, ...noVersion } = sampleProgress();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(noVersion));
    const storage = await loadFreshStorage();
    expect(storage.getProfile()?.name).toBe('DurableKid');
    expect(JSON.parse(storage.exportData()).version).toBe(CURRENT_DATA_VERSION);
    void _v;
  });
});

describe('durable progress — corrupted / truncated JSON on load', () => {
  it.each([
    ['truncated object', '{"version":1,"profile":'],
    ['non-JSON text', 'NOT_JSON{{{'],
    ['JSON null', 'null'],
    ['JSON array', '[1,2,3]'],
    ['JSON primitive number', '42'],
    ['JSON primitive string', '"oops"'],
    ['JSON boolean', 'true'],
  ] as const)(
    'falls back to fresh state for %s without throwing',
    async (_label, raw) => {
      localStorage.setItem(STORAGE_KEY, raw);
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const storage = await loadFreshStorage();

      expect(storage.getProfile()).toBeNull();
      expect(storage.getAchievements()).toEqual([]);
      expect(storage.getSettings()).toEqual(DEFAULT_SETTINGS);
      expect(storage.getOwlState().mood).toBe(DEFAULT_OWL_STATE.mood);
      expect(warn).toHaveBeenCalled();
    }
  );

  it('wrong-typed achievements/gameStats/streak do not crash API reads', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: CURRENT_DATA_VERSION,
        profile: {
          id: 'p',
          name: 'Safe',
          avatar: 'a',
          createdAt: 1,
          lastActiveAt: 1,
        },
        achievements: 'not-an-array',
        gameStats: 'not-an-object',
        streak: 'not-streak',
        settings: 'not-settings',
        owlState: 'not-owl',
      })
    );

    const storage = await loadFreshStorage();
    expect(storage.getProfile()?.name).toBe('Safe');
    expect(() => storage.hasAchievement('x')).not.toThrow();
    expect(storage.getAchievements()).toEqual([]);
    expect(storage.getAllGameStats()).toEqual({});
    expect(storage.getStreak().currentStreak).toBe(0);
    expect(storage.getSettings()).toEqual(DEFAULT_SETTINGS);
    expect(storage.getOwlState().messagesSeen).toEqual([]);
  });
});

describe('durable progress — quota / unavailable storage', () => {
  it('getItem SecurityError (private mode) yields fresh state', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('The operation is insecure.', 'SecurityError');
    });

    const storage = await loadFreshStorage();
    expect(storage.getProfile()).toBeNull();
    expect(storage.getSettings()).toEqual(DEFAULT_SETTINGS);
    expect(warn).toHaveBeenCalled();
  });

  it('setItem QuotaExceededError on saveNow does not throw; memory kept', async () => {
    const storage = await loadFreshStorage();
    storage.createProfile('Quota', 'q');
    storage.unlockAchievement('keep');

    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException(
        'Failed to execute a storage request',
        'QuotaExceededError'
      );
    });

    expect(() => storage.saveNow()).not.toThrow();
    expect(storage.getProfile()?.name).toBe('Quota');
    expect(storage.hasAchievement('keep')).toBe(true);
    expect(errSpy).toHaveBeenCalled();
  });

  it('debounced save swallows unavailable-storage errors', async () => {
    const storage = await loadFreshStorage();
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('insecure', 'SecurityError');
    });

    storage.updateSettings({ reducedMotion: true });
    expect(() => vi.advanceTimersByTime(150)).not.toThrow();
    expect(storage.getSettings().reducedMotion).toBe(true);
    expect(errSpy).toHaveBeenCalled();
  });
});

describe('durable progress — clear / reset', () => {
  it('resetAll writes defaults immediately and remount sees clean state', async () => {
    const first = await loadFreshStorage();
    first.createProfile('WipeMe', 'w');
    first.unlockAchievement('gone');
    first.updateSettings({ soundEnabled: false });
    first.saveNow();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).profile.name).toBe(
      'WipeMe'
    );

    first.resetAll();
    const afterReset = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(afterReset.profile).toBeNull();
    expect(afterReset.achievements).toEqual([]);
    expect(afterReset.settings).toEqual(DEFAULT_SETTINGS);

    const second = await loadFreshStorage();
    expect(second.getProfile()).toBeNull();
    expect(second.hasAchievement('gone')).toBe(false);
    expect(second.getSettings().soundEnabled).toBe(true);
  });

  it('clearing the storage key then remounting is equivalent to first run', async () => {
    const first = await loadFreshStorage();
    first.createProfile('Temp', 't');
    first.saveNow();
    localStorage.removeItem(STORAGE_KEY);

    const second = await loadFreshStorage();
    expect(second.getProfile()).toBeNull();
    expect(second.getTotalGamesPlayed()).toBe(0);
  });
});
