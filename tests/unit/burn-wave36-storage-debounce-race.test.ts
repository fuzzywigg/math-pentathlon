/**
 * Wave 36 — storage debounce race / saveNow interleave leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';

const KEY = 'math-pentathlon-progress';

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

describe('Wave 36 storage-debounce — interleaved flushes', () => {
  it('mutation → saveNow → mutation → debounce keeps latest', () => {
    storage.updateSettings({ soundEnabled: false });
    storage.saveNow();
    expect(JSON.parse(localStorage.getItem(KEY)!).settings.soundEnabled).toBe(
      false
    );

    storage.updateSettings({ soundEnabled: true, owlFrequency: 'chatty' });
    expect(JSON.parse(localStorage.getItem(KEY)!).settings.soundEnabled).toBe(
      false
    );
    vi.advanceTimersByTime(100);
    const parsed = JSON.parse(localStorage.getItem(KEY)!);
    expect(parsed.settings.soundEnabled).toBe(true);
    expect(parsed.settings.owlFrequency).toBe('chatty');
  });

  it('advance less than 100ms does not flush debounce', () => {
    localStorage.clear();
    storage.createProfile('Wait', 'w');
    vi.advanceTimersByTime(99);
    expect(localStorage.getItem(KEY)).toBeNull();
    vi.advanceTimersByTime(1);
    expect(JSON.parse(localStorage.getItem(KEY)!).profile.name).toBe('Wait');
  });

  it('resetAll after pending debounce does not resurrect old profile', () => {
    storage.createProfile('Ghost', 'g');
    storage.resetAll();
    vi.advanceTimersByTime(200);
    expect(JSON.parse(localStorage.getItem(KEY)!).profile).toBeNull();
    expect(storage.getProfile()).toBeNull();
  });
});
