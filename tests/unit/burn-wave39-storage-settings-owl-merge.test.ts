/**
 * Wave 39 — settings merge / owl mood / tutorial idempotent after #172/#173.
 * Tests-only.
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

describe('Wave 39 storage — settings owl merge', () => {
  it('updateSettings partial merge preserves other keys', () => {
    const before = storage.getSettings();
    storage.updateSettings({ soundEnabled: false });
    const after = storage.getSettings();
    expect(after.soundEnabled).toBe(false);
    expect(after.owlEnabled).toBe(before.owlEnabled);
    expect(after.owlFrequency).toBe(before.owlFrequency);
  });

  it('updateOwlMood bumps lastInteraction; tutorial mark idempotent', () => {
    const t0 = storage.getOwlState().lastInteraction;
    vi.advanceTimersByTime(5000);
    storage.updateOwlMood('thinking');
    const owl = storage.getOwlState();
    expect(owl.mood).toBe('thinking');
    expect(owl.lastInteraction).toBeGreaterThan(t0);

    storage.markTutorialCompleted('wave39-tut');
    storage.markTutorialCompleted('wave39-tut');
    expect(
      storage.getOwlState().tutorialsCompleted.filter((id) => id === 'wave39-tut')
    ).toHaveLength(1);
    expect(storage.hasTutorialCompleted('wave39-tut')).toBe(true);
  });
});
