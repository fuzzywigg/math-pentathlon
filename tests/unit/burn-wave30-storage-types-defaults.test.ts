/**
 * Wave 30 — storage types / DEFAULT_* / factory defaults.
 * Deepens beyond thin wave23 storage smoke. Distinct from #147 polyomino,
 * #146 seat-handoff, open #148 hex-coords, open #149 attributes.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  CURRENT_DATA_VERSION,
  DEFAULT_OWL_STATE,
  DEFAULT_SETTINGS,
  DEFAULT_STREAK,
  createDefaultGameStats,
  createDefaultProgress,
} from '../../src/core/storage';

describe('Wave 30 storage-types — version + default constants', () => {
  it('CURRENT_DATA_VERSION is a positive integer and matches progress.version', () => {
    expect(CURRENT_DATA_VERSION).toBeGreaterThanOrEqual(1);
    expect(Number.isInteger(CURRENT_DATA_VERSION)).toBe(true);
    expect(createDefaultProgress().version).toBe(CURRENT_DATA_VERSION);
  });

  it('DEFAULT_SETTINGS covers all UserSettings keys with expected shapes', () => {
    expect(DEFAULT_SETTINGS).toEqual({
      owlEnabled: true,
      soundEnabled: true,
      reducedMotion: false,
      owlFrequency: 'normal',
    });
    expect(['chatty', 'normal', 'quiet']).toContain(
      DEFAULT_SETTINGS.owlFrequency
    );
  });

  it('DEFAULT_OWL_STATE starts empty and happy', () => {
    expect(DEFAULT_OWL_STATE.mood).toBe('happy');
    expect(DEFAULT_OWL_STATE.lastInteraction).toBe(0);
    expect(DEFAULT_OWL_STATE.messagesSeen).toEqual([]);
    expect(DEFAULT_OWL_STATE.tutorialsCompleted).toEqual([]);
    expect(DEFAULT_OWL_STATE.totalMessagesShown).toBe(0);
  });

  it('DEFAULT_STREAK is zeroed with empty date strings', () => {
    expect(DEFAULT_STREAK).toEqual({
      currentStreak: 0,
      bestStreak: 0,
      lastPlayDate: '',
      streakStartDate: '',
    });
  });
});

describe('Wave 30 storage-types — createDefaultProgress isolation', () => {
  it('returns a fresh object graph each call (no shared mutable arrays)', () => {
    const a = createDefaultProgress();
    const b = createDefaultProgress();
    expect(a).not.toBe(b);
    expect(a.streak).not.toBe(b.streak);
    expect(a.achievements).not.toBe(b.achievements);
    expect(a.owlState).not.toBe(b.owlState);
    expect(a.settings).not.toBe(b.settings);
    expect(a.gameStats).not.toBe(b.gameStats);

    a.achievements.push({ id: 'x', unlockedAt: 1 });
    a.owlState.messagesSeen.push('m');
    a.settings.soundEnabled = false;
    expect(b.achievements).toEqual([]);
    expect(b.owlState.messagesSeen).toEqual([]);
    expect(b.settings.soundEnabled).toBe(true);
  });

  it('profile is null and gameStats empty on defaults', () => {
    const p = createDefaultProgress();
    expect(p.profile).toBeNull();
    expect(p.gameStats).toEqual({});
    expect(p.achievements).toEqual([]);
  });
});

describe('Wave 30 storage-types — createDefaultGameStats', () => {
  it('stamps gameId and zero counters with matching timestamps', () => {
    const before = Date.now();
    const stats = createDefaultGameStats('hex');
    const after = Date.now();
    expect(stats.gameId).toBe('hex');
    expect(stats.gamesPlayed).toBe(0);
    expect(stats.gamesWon).toBe(0);
    expect(stats.gamesLost).toBe(0);
    expect(stats.gamesDraw).toBe(0);
    expect(stats.totalPlayTime).toBe(0);
    expect(stats.bestWinStreak).toBe(0);
    expect(stats.currentWinStreak).toBe(0);
    expect(stats.lastPlayed).toBeGreaterThanOrEqual(before);
    expect(stats.lastPlayed).toBeLessThanOrEqual(after);
    expect(stats.firstPlayed).toBe(stats.lastPlayed);
  });

  it('independent gameIds do not share object identity', () => {
    const hex = createDefaultGameStats('hex');
    const calla = createDefaultGameStats('calla');
    expect(hex).not.toBe(calla);
    expect(hex.gameId).toBe('hex');
    expect(calla.gameId).toBe('calla');
  });
});
