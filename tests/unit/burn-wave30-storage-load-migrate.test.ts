/**
 * Wave 30 — storage load / migrate / corrupt localStorage rehydrate.
 * Covers StorageManager constructor paths via vi.resetModules.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const KEY = 'math-pentathlon-progress';

beforeEach(() => {
  localStorage.clear();
  vi.resetModules();
});

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  vi.resetModules();
});

async function loadStorage() {
  const mod = await import('../../src/core/storage');
  // sanitize shared default arrays (shallow-copied into ProgressData)
  mod.DEFAULT_OWL_STATE.messagesSeen.length = 0;
  mod.DEFAULT_OWL_STATE.tutorialsCompleted.length = 0;
  return mod;
}

describe('Wave 30 storage-load — fresh / valid', () => {
  it('missing key starts with default progress', async () => {
    const { storage, CURRENT_DATA_VERSION } = await loadStorage();
    expect(storage.getProfile()).toBeNull();
    expect(storage.getSettings().owlEnabled).toBe(true);
    expect(JSON.parse(storage.exportData()).version).toBe(CURRENT_DATA_VERSION);
  });

  it('valid stored payload hydrates profile and stats', async () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        version: 1,
        profile: {
          id: 'hydrated',
          name: 'Hydra',
          avatar: 'h',
          createdAt: 10,
          lastActiveAt: 20,
        },
        streak: {
          currentStreak: 3,
          bestStreak: 5,
          lastPlayDate: '2026-09-13',
          streakStartDate: '2026-09-11',
        },
        achievements: [{ id: 'boot', unlockedAt: 1 }],
        gameStats: {
          hex: {
            gameId: 'hex',
            gamesPlayed: 2,
            gamesWon: 1,
            gamesLost: 1,
            gamesDraw: 0,
            totalPlayTime: 3000,
            bestWinStreak: 1,
            currentWinStreak: 0,
            lastPlayed: 99,
            firstPlayed: 50,
          },
        },
        owlState: {
          mood: 'proud',
          lastInteraction: 42,
          messagesSeen: ['hi'],
          tutorialsCompleted: ['hex'],
          totalMessagesShown: 1,
        },
        settings: {
          owlEnabled: false,
          soundEnabled: true,
          reducedMotion: true,
          owlFrequency: 'chatty',
        },
      })
    );

    const { storage } = await loadStorage();
    expect(storage.getProfile()?.name).toBe('Hydra');
    expect(storage.getStreak().bestStreak).toBe(5);
    expect(storage.hasAchievement('boot')).toBe(true);
    expect(storage.getGameStats('hex').gamesPlayed).toBe(2);
    expect(storage.getOwlState().mood).toBe('proud');
    expect(storage.getSettings().owlFrequency).toBe('chatty');
    expect(storage.getSettings().owlEnabled).toBe(false);
  });
});

describe('Wave 30 storage-load — migrate older version', () => {
  it('version 0 payload is migrated to CURRENT_DATA_VERSION', async () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        version: 0,
        profile: {
          id: 'old',
          name: 'Legacy',
          avatar: 'l',
          createdAt: 1,
          lastActiveAt: 2,
        },
        streak: {
          currentStreak: 1,
          bestStreak: 1,
          lastPlayDate: '2026-01-01',
          streakStartDate: '2026-01-01',
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
        settings: {
          owlEnabled: true,
          soundEnabled: true,
          reducedMotion: false,
          owlFrequency: 'normal',
        },
      })
    );

    const { storage, CURRENT_DATA_VERSION } = await loadStorage();
    expect(storage.getProfile()?.name).toBe('Legacy');
    expect(JSON.parse(storage.exportData()).version).toBe(CURRENT_DATA_VERSION);
  });
});

describe('Wave 30 storage-load — corrupt / partial recovery', () => {
  it('invalid JSON falls back to defaults', async () => {
    localStorage.setItem(KEY, '{not-json');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { storage } = await loadStorage();
    expect(storage.getProfile()).toBeNull();
    expect(storage.getAchievements()).toEqual([]);
    expect(warn).toHaveBeenCalled();
  });

  it('partial object gets ensureDefaults fill-ins', async () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        version: 1,
        profile: {
          id: 'p',
          name: 'Partial',
          avatar: 'p',
          createdAt: 1,
          lastActiveAt: 1,
        },
      })
    );
    const { storage } = await loadStorage();
    expect(storage.getProfile()?.name).toBe('Partial');
    expect(storage.getStreak().currentStreak).toBe(0);
    expect(storage.getOwlState().mood).toBe('happy');
    expect(storage.getSettings().owlEnabled).toBe(true);
    expect(storage.getAllGameStats()).toEqual({});
  });

  it('null fields are replaced with defaults', async () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        version: 1,
        profile: null,
        streak: null,
        achievements: null,
        gameStats: null,
        owlState: null,
        settings: null,
      })
    );
    const { storage } = await loadStorage();
    expect(storage.getProfile()).toBeNull();
    expect(storage.getStreak().bestStreak).toBe(0);
    expect(storage.getAchievements()).toEqual([]);
    expect(storage.getOwlState().messagesSeen).toEqual([]);
    expect(storage.getSettings().soundEnabled).toBe(true);
  });
});

describe('Wave 30 storage-load — settings merge on hydrate', () => {
  it('partial settings merge with DEFAULT_SETTINGS', async () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        version: 1,
        settings: { soundEnabled: false },
      })
    );
    const { storage } = await loadStorage();
    expect(storage.getSettings()).toEqual({
      owlEnabled: true,
      soundEnabled: false,
      reducedMotion: false,
      owlFrequency: 'normal',
    });
  });
});
