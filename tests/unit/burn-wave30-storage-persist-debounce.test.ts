/**
 * Wave 30 — storage debounced save vs saveNow persistence edges.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';
import { resetStorageHarness } from './helpers/storage-test-harness';

const KEY = 'math-pentathlon-progress';

beforeEach(() => {
  vi.useFakeTimers();
  resetStorageHarness();
  // resetAll calls saveNow — clear again so debounce tests start empty-or-default
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  resetStorageHarness();
  vi.restoreAllMocks();
});

describe('Wave 30 storage-persist — saveNow immediate write', () => {
  it('saveNow writes profile synchronously', () => {
    storage.createProfile('Sync', 's');
    // createProfile uses debounced save; force flush
    storage.saveNow();
    const raw = localStorage.getItem(KEY);
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw!).profile.name).toBe('Sync');
  });

  it('saveNow after clear still writes current in-memory state', () => {
    storage.createProfile('Keep', 'k');
    storage.saveNow();
    localStorage.removeItem(KEY);
    expect(localStorage.getItem(KEY)).toBeNull();
    storage.saveNow();
    expect(JSON.parse(localStorage.getItem(KEY)!).profile.name).toBe('Keep');
  });
});

describe('Wave 30 storage-persist — debounce coalescing', () => {
  it('debounced save flushes after 100ms', () => {
    localStorage.clear();
    storage.createProfile('Debounce', 'd');
    // Immediately after create, debounce may not have fired
    vi.advanceTimersByTime(99);
    // may or may not be written yet depending on prior resetAll; force isolation:
    localStorage.clear();
    storage.updateSettings({ soundEnabled: false });
    expect(localStorage.getItem(KEY)).toBeNull();
    vi.advanceTimersByTime(100);
    const raw = localStorage.getItem(KEY);
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw!).settings.soundEnabled).toBe(false);
  });

  it('rapid mutations coalesce into one write after final delay', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    localStorage.clear();
    setItem.mockClear();

    storage.updateSettings({ soundEnabled: false });
    storage.updateSettings({ owlEnabled: false });
    storage.updateSettings({ owlFrequency: 'quiet' });
    storage.unlockAchievement('burst');
    // only debounce timers scheduled — should not have flushed yet
    const callsBefore = setItem.mock.calls.filter(([k]) => k === KEY).length;
    expect(callsBefore).toBe(0);

    vi.advanceTimersByTime(100);
    const callsAfter = setItem.mock.calls.filter(([k]) => k === KEY).length;
    expect(callsAfter).toBe(1);
    expect(JSON.parse(localStorage.getItem(KEY)!).settings.owlFrequency).toBe(
      'quiet'
    );
    expect(JSON.parse(localStorage.getItem(KEY)!).achievements).toHaveLength(1);
  });

  it('saveNow cancels pending debounce and writes once', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    localStorage.clear();
    setItem.mockClear();

    storage.updateSettings({ reducedMotion: true });
    storage.saveNow();
    const mid = setItem.mock.calls.filter(([k]) => k === KEY).length;
    expect(mid).toBe(1);

    vi.advanceTimersByTime(200);
    const after = setItem.mock.calls.filter(([k]) => k === KEY).length;
    expect(after).toBe(1);
  });
});

describe('Wave 30 storage-persist — quota / error resilience', () => {
  it('saveNow swallows localStorage setItem failures', () => {
    storage.createProfile('Err', 'e');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    expect(() => storage.saveNow()).not.toThrow();
    // in-memory still intact
    expect(storage.getProfile()?.name).toBe('Err');
  });

  it('debounced save swallows setItem failures', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    expect(() => {
      storage.updateSettings({ soundEnabled: false });
      vi.advanceTimersByTime(100);
    }).not.toThrow();
    expect(storage.getSettings().soundEnabled).toBe(false);
  });
});

describe('Wave 30 storage-persist — key constant', () => {
  it('only writes under math-pentathlon-progress', () => {
    storage.createProfile('Key', 'k');
    storage.saveNow();
    expect(localStorage.getItem(KEY)).toBeTruthy();
    expect(localStorage.getItem('progress')).toBeNull();
    expect(localStorage.getItem('math-pentathlon')).toBeNull();
  });
});
