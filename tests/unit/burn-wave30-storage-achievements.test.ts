/**
 * Wave 30 — storage achievements unlock / has / list idempotence.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';

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

describe('Wave 30 storage-achievements — unlock once', () => {
  it('first unlock returns Achievement with id and unlockedAt', () => {
    vi.setSystemTime(new Date('2026-09-14T04:00:00Z'));
    const a = storage.unlockAchievement('first-win');
    expect(a).toEqual({
      id: 'first-win',
      unlockedAt: Date.parse('2026-09-14T04:00:00Z'),
    });
    expect(storage.hasAchievement('first-win')).toBe(true);
  });

  it('second unlock of same id returns null and does not duplicate', () => {
    storage.unlockAchievement('first-win');
    expect(storage.unlockAchievement('first-win')).toBeNull();
    expect(storage.getAchievements()).toHaveLength(1);
  });

  it('distinct ids accumulate in unlock order', () => {
    vi.setSystemTime(new Date('2026-09-14T05:00:00Z'));
    storage.unlockAchievement('a');
    vi.setSystemTime(new Date('2026-09-14T05:01:00Z'));
    storage.unlockAchievement('b');
    vi.setSystemTime(new Date('2026-09-14T05:02:00Z'));
    storage.unlockAchievement('c');
    const list = storage.getAchievements();
    expect(list.map((x) => x.id)).toEqual(['a', 'b', 'c']);
    expect(list[0]!.unlockedAt).toBeLessThan(list[1]!.unlockedAt);
    expect(list[1]!.unlockedAt).toBeLessThan(list[2]!.unlockedAt);
  });
});

describe('Wave 30 storage-achievements — has / get copy', () => {
  it('hasAchievement is false for unknown ids', () => {
    expect(storage.hasAchievement('missing')).toBe(false);
    storage.unlockAchievement('present');
    expect(storage.hasAchievement('missing')).toBe(false);
    expect(storage.hasAchievement('present')).toBe(true);
  });

  it('getAchievements returns a shallow copy of the array', () => {
    storage.unlockAchievement('x');
    const list = storage.getAchievements();
    list.push({ id: 'injected', unlockedAt: 1 });
    expect(storage.getAchievements()).toHaveLength(1);
    expect(storage.hasAchievement('injected')).toBe(false);
  });

  it('resetAll clears achievements', () => {
    storage.unlockAchievement('gone');
    storage.resetAll();
    expect(storage.getAchievements()).toEqual([]);
    expect(storage.hasAchievement('gone')).toBe(false);
  });
});
