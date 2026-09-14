/**
 * Wave 36 — storage export pretty-print + import version leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage, CURRENT_DATA_VERSION } from '../../src/core/storage';

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

describe('Wave 36 storage-export — pretty JSON shape', () => {
  it('exportData is indented with two spaces and parses back', () => {
    storage.createProfile('Pretty', 'p');
    storage.unlockAchievement('a1');
    const raw = storage.exportData();
    expect(raw.startsWith('{')).toBe(true);
    expect(raw.includes('\n')).toBe(true);
    expect(raw.includes('  "version"')).toBe(true);
    const parsed = JSON.parse(raw);
    expect(parsed.version).toBe(CURRENT_DATA_VERSION);
    expect(parsed.profile.name).toBe('Pretty');
  });

  it('re-import of export is idempotent for aggregates', () => {
    storage.createProfile('Round', 'r');
    for (let i = 0; i < 3; i++) {
      storage.recordGameResult({
        gameId: 'hex',
        winner: i === 1 ? 'draw' : 'player1',
        playerWon: i !== 1,
        duration: 100 * (i + 1),
        moveCount: i + 1,
        playedAt: Date.now(),
      });
    }
    const json = storage.exportData();
    const winRate = storage.getOverallWinRate();
    const played = storage.getTotalGamesPlayed();
    const time = storage.getTotalPlayTime();

    storage.resetAll();
    expect(storage.importData(json)).toBe(true);
    expect(storage.getOverallWinRate()).toBe(winRate);
    expect(storage.getTotalGamesPlayed()).toBe(played);
    expect(storage.getTotalPlayTime()).toBe(time);
    expect(storage.getProfile()?.name).toBe('Round');
  });
});

describe('Wave 36 storage-export — version field handling', () => {
  it('import with missing version still yields CURRENT via ensureDefaults', () => {
    expect(storage.importData(JSON.stringify({ profile: null }))).toBe(true);
    const parsed = JSON.parse(storage.exportData());
    expect(parsed.version).toBe(CURRENT_DATA_VERSION);
  });

  it('import with future version number is preserved as-is', () => {
    expect(
      storage.importData(
        JSON.stringify({
          version: 99,
          profile: null,
          streak: {
            currentStreak: 0,
            bestStreak: 0,
            lastPlayDate: '',
            streakStartDate: '',
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
      )
    ).toBe(true);
    expect(JSON.parse(storage.exportData()).version).toBe(99);
  });
});
