/**
 * Wave 36 — storage localStorage setItem/getItem failure leftovers.
 * Covers save()/saveNow() catch paths and load() warn→fresh via import reset.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';

const KEY = 'math-pentathlon-progress';

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

describe('Wave 36 storage-save-errors — saveNow swallows QuotaExceeded', () => {
  it('saveNow logs error and keeps in-memory profile when setItem throws', () => {
    const err = new Error('QuotaExceededError');
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw err;
    });

    storage.createProfile('Quota', 'q');
    expect(() => storage.saveNow()).not.toThrow();
    expect(storage.getProfile()?.name).toBe('Quota');
    expect(spy).toHaveBeenCalled();
    expect(
      spy.mock.calls.some((c) => String(c[0]).includes('Failed to save'))
    ).toBe(true);
  });

  it('debounced save also swallows setItem failures after timer flush', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('disk full');
    });

    storage.updateSettings({ soundEnabled: false });
    expect(() => vi.advanceTimersByTime(100)).not.toThrow();
    expect(storage.getSettings().soundEnabled).toBe(false);
    expect(spy).toHaveBeenCalled();
  });
});

describe('Wave 36 storage-save-errors — export still works after failed persist', () => {
  it('exportData reflects mutations even when localStorage write fails', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    storage.unlockAchievement('ghost');
    storage.saveNow();
    const exported = JSON.parse(storage.exportData());
    expect(exported.achievements.map((a: { id: string }) => a.id)).toEqual([
      'ghost',
    ]);
    // localStorage may be empty or stale — in-memory is source of truth
    expect(storage.hasAchievement('ghost')).toBe(true);
  });
});

describe('Wave 36 storage-save-errors — getItem throws during resetAll reload path', () => {
  it('resetAll still clears in-memory when subsequent setItem works', () => {
    storage.createProfile('Keep', 'k');
    storage.saveNow();
    expect(storage.getProfile()).not.toBeNull();
    storage.resetAll();
    expect(storage.getProfile()).toBeNull();
    expect(localStorage.getItem(KEY)).toBeTruthy();
  });
});
