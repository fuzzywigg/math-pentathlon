/**
 * Wave 36 — storage achievement unlock clock + export pretty-print stress.
 * Leftover beyond wave 30 achievements / export-import. Tests-only.
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

describe('Wave 36 storage-achievements — unlock timestamps', () => {
  it('stamps unlockedAt with Date.now and returns the achievement', () => {
    vi.setSystemTime(1_700_000_111_000);
    const a = storage.unlockAchievement('first-win');
    expect(a).toEqual({ id: 'first-win', unlockedAt: 1_700_000_111_000 });
    expect(storage.hasAchievement('first-win')).toBe(true);
  });

  it('second unlock returns null and keeps original unlockedAt', () => {
    vi.setSystemTime(1_000);
    storage.unlockAchievement('badge');
    vi.setSystemTime(2_000);
    expect(storage.unlockAchievement('badge')).toBeNull();
    expect(storage.getAchievements()[0]?.unlockedAt).toBe(1_000);
  });

  it('many unique unlocks preserve insertion order', () => {
    const ids = Array.from({ length: 40 }, (_, i) => `ach-${i}`);
    for (const id of ids) {
      expect(storage.unlockAchievement(id)).not.toBeNull();
    }
    expect(storage.getAchievements().map((a) => a.id)).toEqual(ids);
  });
});

describe('Wave 36 storage-export — pretty print + large catalog roundtrip', () => {
  it('exportData is indented JSON (null, 2)', () => {
    storage.createProfile('Pretty', 'p');
    const json = storage.exportData();
    expect(json.startsWith('{')).toBe(true);
    expect(json).toContain('\n');
    expect(json).toContain('  "version"');
    expect(JSON.parse(json).profile.name).toBe('Pretty');
  });

  it('round-trips a dense multi-game catalog', () => {
    storage.createProfile('Dense', 'd');
    for (let g = 0; g < 20; g++) {
      const gameId = `game-${g}`;
      for (let i = 0; i < 5; i++) {
        storage.recordGameResult({
          gameId,
          winner: i % 3 === 0 ? 'draw' : i % 2 === 0 ? 'player1' : 'ai',
          playerWon: i % 2 === 0 && i % 3 !== 0,
          duration: 100 * (i + 1),
          moveCount: i + 1,
          playedAt: Date.now() + g * 10 + i,
        });
      }
      storage.unlockAchievement(`a-${g}`);
      storage.markTutorialCompleted(`t-${g}`);
    }
    storage.updateSettings({ owlFrequency: 'quiet', reducedMotion: true });
    storage.updateOwlMood('celebrating');

    const json = storage.exportData();
    storage.resetAll();
    expect(storage.importData(json)).toBe(true);

    expect(storage.getProfile()?.name).toBe('Dense');
    expect(storage.getTotalGamesPlayed()).toBe(100);
    expect(storage.getAchievements()).toHaveLength(20);
    expect(storage.getOwlState().tutorialsCompleted).toHaveLength(20);
    expect(storage.getSettings().owlFrequency).toBe('quiet');
    expect(storage.getOwlState().mood).toBe('celebrating');
    expect(Object.keys(storage.getAllGameStats())).toHaveLength(20);
  });
});
