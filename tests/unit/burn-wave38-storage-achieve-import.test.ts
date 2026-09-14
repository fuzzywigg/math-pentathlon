/**
 * Wave 38 — storage achievements + import/export leftovers after #171.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-12T15:00:00Z'));
  localStorage.clear();
  storage.resetAll();
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 38 storage-achieve — unlock idempotency', () => {
  it('first unlock returns achievement; second returns null', () => {
    const first = storage.unlockAchievement('first-win');
    expect(first?.id).toBe('first-win');
    expect(first?.unlockedAt).toBe(Date.now());
    expect(storage.hasAchievement('first-win')).toBe(true);
    expect(storage.unlockAchievement('first-win')).toBeNull();
    expect(storage.getAchievements()).toHaveLength(1);
  });

  it('multiple distinct achievements accumulate in unlock order', () => {
    for (const id of ['a', 'b', 'c']) {
      expect(storage.unlockAchievement(id)).not.toBeNull();
    }
    expect(storage.getAchievements().map((a) => a.id)).toEqual(['a', 'b', 'c']);
  });
});

describe('Wave 38 storage-import — round-trip + reject corrupt', () => {
  it('export → reset → import restores profile, settings, achievements', () => {
    storage.createProfile('Nova', 'star');
    storage.updateSettings({ soundEnabled: false, owlFrequency: 'quiet' });
    storage.unlockAchievement('explorer');
    storage.recordGameResult({
      gameId: 'contig-60',
      winner: 'player1',
      playerWon: true,
      duration: 4000,
      moveCount: 8,
      playedAt: Date.now(),
    });
    const json = storage.exportData();
    storage.resetAll();
    expect(storage.getProfile()).toBeNull();
    expect(storage.importData(json)).toBe(true);
    expect(storage.getProfile()?.name).toBe('Nova');
    expect(storage.getSettings().soundEnabled).toBe(false);
    expect(storage.hasAchievement('explorer')).toBe(true);
    expect(storage.getGameStats('contig-60').gamesWon).toBe(1);
  });

  it('rejects malformed JSON without wiping live data', () => {
    storage.createProfile('Keep', 'k');
    expect(storage.importData('{not-json')).toBe(false);
    expect(storage.importData('null')).toBe(false);
    expect(storage.importData('{"version":1}')).toBe(true); // valid object shape
    // Profile may be cleared on valid but empty import — recreate and confirm rejects still work
    storage.createProfile('Keep2', 'k');
    expect(storage.importData('not-json-at-all')).toBe(false);
    expect(storage.getProfile()?.name).toBe('Keep2');
  });
});
