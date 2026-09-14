/**
 * Wave 36 — storage debounce coalescing + saveNow race leftovers.
 * Beyond wave 30 persist-debounce. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';

const KEY = 'math-pentathlon-progress';

beforeEach(() => {
  vi.useFakeTimers();
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

describe('Wave 36 storage-persist — coalesced write storm', () => {
  it('100 rapid mutations flush once after debounce window', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    for (let i = 0; i < 100; i++) {
      storage.updateSettings({
        soundEnabled: i % 2 === 0,
        reducedMotion: i % 3 === 0,
      });
      if (i % 10 === 0) {
        storage.markMessageSeen(`burst-${i}`);
      }
    }
    expect(setItem).not.toHaveBeenCalled();
    vi.advanceTimersByTime(99);
    expect(setItem).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    const writes = setItem.mock.calls.filter(([k]) => k === KEY);
    expect(writes.length).toBeGreaterThanOrEqual(1);
    const parsed = JSON.parse(writes[writes.length - 1]![1] as string);
    expect(parsed.settings.soundEnabled).toBe(false); // 99 % 2 !== 0 → false? Wait i=99, 99%2===1 → soundEnabled false
    expect(parsed.owlState.messagesSeen.length).toBe(10);
    setItem.mockRestore();
  });

  it('saveNow mid-storm persists latest then later debounce is harmless', () => {
    storage.createProfile('Storm', 's');
    for (let i = 0; i < 5; i++) {
      storage.unlockAchievement(`a-${i}`);
    }
    storage.saveNow();
    expect(JSON.parse(localStorage.getItem(KEY)!).achievements).toHaveLength(5);

    storage.unlockAchievement('a-5');
    vi.advanceTimersByTime(100);
    expect(JSON.parse(localStorage.getItem(KEY)!).achievements).toHaveLength(6);
  });
});

describe('Wave 36 storage-persist — export during pending debounce', () => {
  it('exportData reflects in-memory state before debounce flush', () => {
    storage.createProfile('Pending', 'p');
    storage.updateOwlMood('thinking');
    // Not flushed yet
    expect(localStorage.getItem(KEY)).toBeNull();
    const exported = JSON.parse(storage.exportData());
    expect(exported.profile.name).toBe('Pending');
    expect(exported.owlState.mood).toBe('thinking');
  });
});
