/**
 * Wave 36 — importData ensureDefaults / version bump leftovers.
 * Tests-only.
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
});

describe('Wave 36 storage-migrate — sparse import', () => {
  it('fills missing owl/settings/streak and keeps profile', () => {
    const ok = storage.importData(
      JSON.stringify({
        version: 0,
        profile: {
          id: 'p1',
          name: 'Legacy',
          avatar: 'x',
          createdAt: 1,
          lastActiveAt: 2,
        },
      })
    );
    expect(ok).toBe(true);
    expect(storage.getProfile()?.name).toBe('Legacy');
    expect(storage.getSettings().owlEnabled).toBe(true);
    expect(storage.getOwlState().mood).toBe('happy');
    expect(storage.getStreak().currentStreak).toBe(0);
    expect(storage.getAchievements()).toEqual([]);
  });

  it('rejects non-JSON', () => {
    expect(storage.importData('{not-json')).toBe(false);
  });
});

describe('Wave 36 storage-migrate — version field presence', () => {
  it('round-trips CURRENT_DATA_VERSION via export', () => {
    storage.createProfile('V', 'v');
    const parsed = JSON.parse(storage.exportData());
    expect(parsed.version).toBe(CURRENT_DATA_VERSION);
  });
});
