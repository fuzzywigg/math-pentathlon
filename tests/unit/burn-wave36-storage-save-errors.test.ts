/**
 * Wave 36 — storage save / saveNow swallow localStorage write failures.
 * Leftover beyond wave 30 persist-debounce happy path. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';

const STORAGE_KEY = 'math-pentathlon-progress';

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

describe('Wave 36 storage — saveNow write failures', () => {
  it('saveNow logs and continues when setItem throws', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const setItem = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

    expect(() => {
      storage.createProfile('Hard', 'h');
      storage.saveNow();
    }).not.toThrow();

    expect(errSpy).toHaveBeenCalled();
    expect(storage.getProfile()?.name).toBe('Hard');

    setItem.mockRestore();
    errSpy.mockRestore();
  });

  it('in-memory state survives failed saveNow and recovers on next write', () => {
    storage.createProfile('Recover', 'r');
    storage.unlockAchievement('a1');

    const setItem = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementationOnce(() => {
        throw new Error('QuotaExceededError');
      });
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    storage.saveNow();
    expect(storage.hasAchievement('a1')).toBe(true);
    expect(storage.getProfile()?.name).toBe('Recover');

    setItem.mockRestore();
    errSpy.mockRestore();

    storage.saveNow();
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.profile.name).toBe('Recover');
    expect(parsed.achievements).toHaveLength(1);
  });
});

describe('Wave 36 storage — debounced save failures', () => {
  it('debounced save catches setItem errors without crashing timers', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const setItem = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

    storage.updateSettings({ soundEnabled: false });
    expect(() => vi.advanceTimersByTime(100)).not.toThrow();
    expect(errSpy).toHaveBeenCalled();
    expect(storage.getSettings().soundEnabled).toBe(false);

    setItem.mockRestore();
    errSpy.mockRestore();
  });
});
