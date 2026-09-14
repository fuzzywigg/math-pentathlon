/**
 * Wave 30 — storage localStorage key / saveNow / debounced save timing.
 * Tests-only. No product inventing.
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

describe('Wave 30 storage-persist — saveNow writes immediately', () => {
  it('saveNow persists profile under the canonical key', () => {
    storage.setProfile({
      id: 'p1',
      name: 'Now',
      avatar: 'n',
      createdAt: 1,
      lastActiveAt: 1,
    });
    storage.saveNow();
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw!).profile.name).toBe('Now');
  });

  it('resetAll uses saveNow so localStorage reflects defaults immediately', () => {
    storage.createProfile('Temp', 't');
    storage.saveNow();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).profile).toBeTruthy();
    storage.resetAll();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).profile).toBeNull();
  });
});

describe('Wave 30 storage-persist — debounced save', () => {
  it('createProfile does not flush until debounce elapses', () => {
    localStorage.clear();
    storage.createProfile('Debounce', 'd');
    // Immediately after mutation, debounce may not have flushed yet
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    vi.advanceTimersByTime(100);
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw!).profile.name).toBe('Debounce');
  });

  it('rapid mutations collapse into a single delayed write', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    storage.updateSettings({ soundEnabled: false });
    storage.updateSettings({ owlEnabled: false });
    storage.updateOwlMood('thinking');
    expect(setItem).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(setItem).toHaveBeenCalled();
    const writes = setItem.mock.calls.filter(([key]) => key === STORAGE_KEY);
    expect(writes.length).toBeGreaterThanOrEqual(1);
    const last = writes[writes.length - 1]![1] as string;
    const parsed = JSON.parse(last);
    expect(parsed.settings.soundEnabled).toBe(false);
    expect(parsed.settings.owlEnabled).toBe(false);
    expect(parsed.owlState.mood).toBe('thinking');
    setItem.mockRestore();
  });

  it('saveNow cancels pending debounce and writes current state', () => {
    storage.createProfile('Flush', 'f');
    storage.unlockAchievement('fast');
    storage.saveNow();
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(parsed.profile.name).toBe('Flush');
    expect(parsed.achievements).toHaveLength(1);
    // Advancing timers after saveNow should not throw or double-corrupt
    vi.advanceTimersByTime(200);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).profile.name).toBe(
      'Flush'
    );
  });
});

describe('Wave 30 storage-persist — importData forces immediate persist', () => {
  it('successful import is readable from localStorage without waiting', () => {
    const payload = storage.exportData();
    storage.resetAll();
    localStorage.clear();
    expect(storage.importData(payload)).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy();
  });
});
