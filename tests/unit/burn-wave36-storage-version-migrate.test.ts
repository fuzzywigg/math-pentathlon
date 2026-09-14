/**
 * Wave 36 — storage import version < CURRENT migrates via ensureDefaults.
 * Leftover beyond wave 30 corrupt-migrate partial payloads. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  storage,
  CURRENT_DATA_VERSION,
  DEFAULT_SETTINGS,
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

describe('Wave 36 storage — version migration on import', () => {
  it('version 0 payload is accepted and stamped to CURRENT_DATA_VERSION', () => {
    const legacy = {
      version: 0,
      profile: {
        id: 'legacy',
        name: 'Legacy',
        avatar: 'L',
        createdAt: 1,
        lastActiveAt: 2,
      },
      gameStats: {
        hex: {
          gameId: 'hex',
          gamesPlayed: 2,
          gamesWon: 1,
          gamesLost: 1,
          gamesDraw: 0,
          totalPlayTime: 2000,
          bestWinStreak: 1,
          currentWinStreak: 0,
          lastPlayed: 50,
          firstPlayed: 10,
        },
      },
    };
    expect(storage.importData(JSON.stringify(legacy))).toBe(true);
    expect(storage.getProfile()?.name).toBe('Legacy');
    expect(storage.getGameStats('hex').gamesPlayed).toBe(2);
    expect(storage.getSettings()).toEqual(DEFAULT_SETTINGS);

    const exported = JSON.parse(storage.exportData());
    expect(exported.version).toBe(CURRENT_DATA_VERSION);
  });

  it('missing version field is filled to CURRENT on ensureDefaults', () => {
    expect(
      storage.importData(
        JSON.stringify({
          profile: null,
          settings: { reducedMotion: true },
        })
      )
    ).toBe(true);
    const exported = JSON.parse(storage.exportData());
    expect(exported.version).toBe(CURRENT_DATA_VERSION);
    expect(storage.getSettings().reducedMotion).toBe(true);
    expect(storage.getSettings().owlEnabled).toBe(true);
  });

  it('future-looking version number is preserved when already current-or-higher', () => {
    // ensureDefaults keeps provided version if truthy; CURRENT is 1
    expect(
      storage.importData(
        JSON.stringify({
          version: CURRENT_DATA_VERSION,
          profile: null,
        })
      )
    ).toBe(true);
    expect(JSON.parse(storage.exportData()).version).toBe(CURRENT_DATA_VERSION);
  });
});

describe('Wave 36 storage — partial owl nested ensureDefaults', () => {
  it('owlState with only mood fills arrays and counters', () => {
    expect(
      storage.importData(
        JSON.stringify({
          version: CURRENT_DATA_VERSION,
          owlState: { mood: 'sleepy' },
        })
      )
    ).toBe(true);
    const owl = storage.getOwlState();
    expect(owl.mood).toBe('sleepy');
    expect(owl.messagesSeen).toEqual([]);
    expect(owl.tutorialsCompleted).toEqual([]);
    expect(owl.totalMessagesShown).toBe(0);
    expect(owl.lastInteraction).toBe(0);
  });

  it('owlState with nullish arrays becomes empty copies', () => {
    expect(
      storage.importData(
        JSON.stringify({
          version: CURRENT_DATA_VERSION,
          owlState: {
            mood: 'proud',
            lastInteraction: 42,
            messagesSeen: null,
            tutorialsCompleted: null,
            totalMessagesShown: 3,
          },
        })
      )
    ).toBe(true);
    const owl = storage.getOwlState();
    expect(owl.mood).toBe('proud');
    expect(owl.messagesSeen).toEqual([]);
    expect(owl.tutorialsCompleted).toEqual([]);
    expect(owl.totalMessagesShown).toBe(3);
    expect(owl.lastInteraction).toBe(42);
  });
});
