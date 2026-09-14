/**
 * Wave 39 — unlockAchievement idempotent + tutorial/settings leftovers.
 * Beyond wave 38 winrate. Tests-only.
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

describe('Wave 39 storage — achievement idempotent', () => {
  it('first unlock returns achievement; second returns null', () => {
    const first = storage.unlockAchievement('first-win');
    expect(first).not.toBeNull();
    expect(first!.id).toBe('first-win');
    expect(storage.hasAchievement('first-win')).toBe(true);
    expect(storage.unlockAchievement('first-win')).toBeNull();
    expect(storage.getAchievements()).toHaveLength(1);
  });

  it('tutorial mark/has is idempotent', () => {
    expect(storage.hasTutorialCompleted('intro')).toBe(false);
    storage.markTutorialCompleted('intro');
    storage.markTutorialCompleted('intro');
    expect(storage.hasTutorialCompleted('intro')).toBe(true);
  });

  it('updateSettings merges partials', () => {
    const before = storage.getSettings();
    storage.updateSettings({ soundEnabled: !before.soundEnabled });
    const after = storage.getSettings();
    expect(after.soundEnabled).toBe(!before.soundEnabled);
    // other keys preserved
    expect(after.owlEnabled).toBe(before.owlEnabled);
    expect(after.owlFrequency).toBe(before.owlFrequency);
  });
});
