/**
 * Wave 36 — storage types factory stress leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createDefaultProgress,
  createDefaultGameStats,
  CURRENT_DATA_VERSION,
  DEFAULT_SETTINGS,
  DEFAULT_OWL_STATE,
  DEFAULT_STREAK,
} from '../../src/core/storage';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(3_000_000_000_000);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 36 storage-types — factory isolation', () => {
  it('createDefaultProgress does not share nested arrays across calls', () => {
    const a = createDefaultProgress();
    const b = createDefaultProgress();
    expect(a).toEqual(b);
    expect(a.owlState.messagesSeen).not.toBe(b.owlState.messagesSeen);
    expect(a.owlState.tutorialsCompleted).not.toBe(
      b.owlState.tutorialsCompleted
    );
    expect(a.settings).not.toBe(b.settings);
    expect(a.streak).not.toBe(b.streak);
    a.owlState.messagesSeen.push('x');
    a.settings.soundEnabled = false;
    a.streak.currentStreak = 9;
    expect(b.owlState.messagesSeen).toEqual([]);
    expect(b.settings).toEqual(DEFAULT_SETTINGS);
    expect(b.streak).toEqual(DEFAULT_STREAK);
  });

  it('createDefaultGameStats stamps both clocks to now', () => {
    const stats = createDefaultGameStats('demo');
    expect(stats).toEqual({
      gameId: 'demo',
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      gamesDraw: 0,
      totalPlayTime: 0,
      bestWinStreak: 0,
      currentWinStreak: 0,
      lastPlayed: 3_000_000_000_000,
      firstPlayed: 3_000_000_000_000,
    });
  });

  it('defaults constants match progress seed fields', () => {
    const p = createDefaultProgress();
    expect(p.version).toBe(CURRENT_DATA_VERSION);
    expect(p.owlState.mood).toBe(DEFAULT_OWL_STATE.mood);
    expect(p.settings).toEqual(DEFAULT_SETTINGS);
  });
});
