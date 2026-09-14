/**
 * Wave 36 — storage achievement unlock/idempotency/order leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1_700_000_100_000);
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 36 storage-achievements — unlock matrix', () => {
  it('unlock returns Achievement with unlockedAt = now', () => {
    const a = storage.unlockAchievement('first-win');
    expect(a).toEqual({ id: 'first-win', unlockedAt: 1_700_000_100_000 });
    expect(storage.hasAchievement('first-win')).toBe(true);
  });

  it('second unlock of same id returns null and keeps original timestamp', () => {
    storage.unlockAchievement('dup');
    vi.setSystemTime(1_700_000_200_000);
    expect(storage.unlockAchievement('dup')).toBeNull();
    expect(storage.getAchievements()).toEqual([
      { id: 'dup', unlockedAt: 1_700_000_100_000 },
    ]);
  });

  it('many distinct unlocks preserve insertion order and timestamps', () => {
    const ids = Array.from({ length: 20 }, (_, i) => `ach-${i}`);
    for (const id of ids) {
      vi.setSystemTime(1_700_000_100_000 + ids.indexOf(id) * 1000);
      storage.unlockAchievement(id);
    }
    const all = storage.getAchievements();
    expect(all.map((a) => a.id)).toEqual(ids);
    expect(all[0]!.unlockedAt).toBe(1_700_000_100_000);
    expect(all[19]!.unlockedAt).toBe(1_700_000_100_000 + 19_000);
  });

  it('hasAchievement false for unknown; true after unlock', () => {
    expect(storage.hasAchievement('nope')).toBe(false);
    storage.unlockAchievement('nope');
    expect(storage.hasAchievement('nope')).toBe(true);
  });
});
