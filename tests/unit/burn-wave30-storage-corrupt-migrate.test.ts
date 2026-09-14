/**
 * Wave 30 — storage corrupt / partial / ensureDefaults via importData.
 * Covers defensive defaults without re-constructing the singleton.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  storage,
  CURRENT_DATA_VERSION,
  DEFAULT_SETTINGS,
  DEFAULT_OWL_STATE,
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

describe('Wave 30 storage-corrupt — partial payloads fill defaults', () => {
  it('missing settings merges DEFAULT_SETTINGS', () => {
    expect(
      storage.importData(
        JSON.stringify({
          version: CURRENT_DATA_VERSION,
          profile: null,
        })
      )
    ).toBe(true);
    expect(storage.getSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('partial settings merge over defaults', () => {
    expect(
      storage.importData(
        JSON.stringify({
          version: CURRENT_DATA_VERSION,
          settings: { soundEnabled: false },
        })
      )
    ).toBe(true);
    expect(storage.getSettings()).toEqual({
      ...DEFAULT_SETTINGS,
      soundEnabled: false,
    });
  });

  it('missing owlState uses DEFAULT_OWL_STATE values', () => {
    expect(
      storage.importData(JSON.stringify({ version: CURRENT_DATA_VERSION }))
    ).toBe(true);
    expect(storage.getOwlState()).toEqual(DEFAULT_OWL_STATE);
  });

  it('missing streak / achievements / gameStats become empty defaults', () => {
    expect(
      storage.importData(JSON.stringify({ version: CURRENT_DATA_VERSION }))
    ).toBe(true);
    expect(storage.getStreak()).toEqual({
      currentStreak: 0,
      bestStreak: 0,
      lastPlayDate: '',
      streakStartDate: '',
    });
    expect(storage.getAchievements()).toEqual([]);
    expect(storage.getAllGameStats()).toEqual({});
  });
});

describe('Wave 30 storage-corrupt — malformed inputs rejected', () => {
  it('rejects non-JSON strings and JSON null', () => {
    storage.createProfile('Safe', 's');
    expect(storage.importData('')).toBe(false);
    // JSON.parse('null') === null → ensureDefaults throws → importData false
    expect(storage.importData('null')).toBe(false);
    expect(storage.getProfile()?.name).toBe('Safe');
  });

  it('rejects truncated objects that are not valid JSON', () => {
    storage.createProfile('Keep', 'k');
    expect(storage.importData('{"version":')).toBe(false);
    expect(storage.getProfile()?.name).toBe('Keep');
  });
});

describe('Wave 30 storage-corrupt — profile + stats survive ensureDefaults', () => {
  it('imports a populated progress blob faithfully', () => {
    const blob = {
      version: CURRENT_DATA_VERSION,
      profile: {
        id: 'id-1',
        name: 'Pat',
        avatar: 'p',
        createdAt: 10,
        lastActiveAt: 20,
      },
      streak: {
        currentStreak: 4,
        bestStreak: 7,
        lastPlayDate: '2026-09-13',
        streakStartDate: '2026-09-10',
      },
      achievements: [{ id: 'badge', unlockedAt: 99 }],
      gameStats: {
        hex: {
          gameId: 'hex',
          gamesPlayed: 3,
          gamesWon: 2,
          gamesLost: 1,
          gamesDraw: 0,
          totalPlayTime: 3000,
          bestWinStreak: 2,
          currentWinStreak: 0,
          lastPlayed: 50,
          firstPlayed: 40,
        },
      },
      owlState: {
        mood: 'proud' as const,
        lastInteraction: 123,
        messagesSeen: ['m'],
        tutorialsCompleted: ['hex'],
        totalMessagesShown: 1,
      },
      settings: {
        owlEnabled: false,
        soundEnabled: true,
        reducedMotion: true,
        owlFrequency: 'quiet' as const,
      },
    };
    expect(storage.importData(JSON.stringify(blob))).toBe(true);
    expect(storage.getProfile()?.name).toBe('Pat');
    expect(storage.getStreak().bestStreak).toBe(7);
    expect(storage.getGameStats('hex').gamesWon).toBe(2);
    expect(storage.hasAchievement('badge')).toBe(true);
    expect(storage.getOwlState().mood).toBe('proud');
    expect(storage.getSettings().owlFrequency).toBe('quiet');
  });
});
