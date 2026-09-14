/**
 * Wave 30 — storage achievements unlock / catalog / ordering edges.
 * Distinct from wave 23 single unlock smoke. Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';
import { resetStorageHarness } from './helpers/storage-test-harness';

beforeEach(() => {
  vi.useFakeTimers();
  resetStorageHarness();
});

afterEach(() => {
  vi.useRealTimers();
  resetStorageHarness();
  vi.restoreAllMocks();
});

const CATALOG = [
  'first-win',
  'first-loss',
  'streak-3',
  'streak-7',
  'play-10',
  'play-50',
  'division-alpha',
  'division-beta',
  'owl-fan',
  'tutorial-complete',
] as const;

describe('Wave 30 storage-achievements — unlock once semantics', () => {
  it('first unlock returns Achievement with id and unlockedAt', () => {
    vi.setSystemTime(new Date('2026-09-14T01:30:00Z'));
    const a = storage.unlockAchievement('first-win');
    expect(a).not.toBeNull();
    expect(a!.id).toBe('first-win');
    expect(a!.unlockedAt).toBe(Date.now());
    expect(storage.hasAchievement('first-win')).toBe(true);
  });

  it('duplicate unlock returns null and does not grow list', () => {
    storage.unlockAchievement('dup');
    expect(storage.unlockAchievement('dup')).toBeNull();
    expect(storage.unlockAchievement('dup')).toBeNull();
    expect(storage.getAchievements()).toHaveLength(1);
  });

  it('hasAchievement is false for unknown ids', () => {
    expect(storage.hasAchievement('missing')).toBe(false);
    storage.unlockAchievement('present');
    expect(storage.hasAchievement('missing')).toBe(false);
    expect(storage.hasAchievement('present')).toBe(true);
  });
});

describe('Wave 30 storage-achievements — catalog batch', () => {
  it('unlocks full catalog with unique unlockedAt progression', () => {
    const times: number[] = [];
    for (let i = 0; i < CATALOG.length; i++) {
      vi.setSystemTime(new Date(Date.UTC(2026, 8, 14, 0, 0, i)));
      const a = storage.unlockAchievement(CATALOG[i]);
      expect(a).not.toBeNull();
      times.push(a!.unlockedAt);
    }
    expect(storage.getAchievements()).toHaveLength(CATALOG.length);
    expect(new Set(times).size).toBe(CATALOG.length);
    for (const id of CATALOG) {
      expect(storage.hasAchievement(id)).toBe(true);
      expect(storage.unlockAchievement(id)).toBeNull();
    }
  });

  it('getAchievements returns a copy (push does not mutate store)', () => {
    storage.unlockAchievement('safe');
    const list = storage.getAchievements();
    list.push({ id: 'injected', unlockedAt: 1 });
    expect(storage.getAchievements()).toHaveLength(1);
    expect(storage.hasAchievement('injected')).toBe(false);
  });

  it('preserves unlock order as insertion order', () => {
    const order = ['c', 'a', 'b'];
    for (const id of order) {
      storage.unlockAchievement(id);
    }
    expect(storage.getAchievements().map((a) => a.id)).toEqual(order);
  });
});

describe('Wave 30 storage-achievements — persistence / reset', () => {
  it('survives saveNow + export/import round-trip', () => {
    storage.unlockAchievement('persist-a');
    storage.unlockAchievement('persist-b');
    storage.saveNow();
    const json = storage.exportData();
    storage.resetAll();
    expect(storage.getAchievements()).toEqual([]);
    expect(storage.importData(json)).toBe(true);
    expect(storage.getAchievements().map((a) => a.id)).toEqual([
      'persist-a',
      'persist-b',
    ]);
  });

  it('resetAll clears achievements', () => {
    for (const id of CATALOG.slice(0, 5)) {
      storage.unlockAchievement(id);
    }
    storage.resetAll();
    expect(storage.getAchievements()).toEqual([]);
    for (const id of CATALOG.slice(0, 5)) {
      expect(storage.hasAchievement(id)).toBe(false);
    }
  });

  it('achievements are independent of game stats', () => {
    storage.unlockAchievement('solo');
    storage.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 1,
      moveCount: 1,
      playedAt: Date.now(),
    });
    expect(storage.hasAchievement('solo')).toBe(true);
    expect(storage.getGameStats('hex').gamesPlayed).toBe(1);
  });
});
