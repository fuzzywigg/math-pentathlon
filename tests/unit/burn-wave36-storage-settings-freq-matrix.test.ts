/**
 * Wave 36 — storage settings owlFrequency + boolean toggle matrix leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage, DEFAULT_SETTINGS } from '../../src/core/storage';

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

describe('Wave 36 storage-settings — owlFrequency enum matrix', () => {
  const freqs = ['chatty', 'normal', 'quiet'] as const;

  it.each(freqs)('updateSettings owlFrequency=%s round-trips', (freq) => {
    storage.updateSettings({ owlFrequency: freq });
    expect(storage.getSettings().owlFrequency).toBe(freq);
    expect(storage.getSettings()).toEqual({
      ...DEFAULT_SETTINGS,
      owlFrequency: freq,
    });
  });
});

describe('Wave 36 storage-settings — boolean toggle cartesian', () => {
  const bools = [true, false];

  it('all combinations of owl/sound/reducedMotion merge cleanly', () => {
    for (const owlEnabled of bools) {
      for (const soundEnabled of bools) {
        for (const reducedMotion of bools) {
          storage.resetAll();
          storage.updateSettings({ owlEnabled, soundEnabled, reducedMotion });
          expect(storage.getSettings()).toEqual({
            ...DEFAULT_SETTINGS,
            owlEnabled,
            soundEnabled,
            reducedMotion,
          });
        }
      }
    }
  });

  it('partial update does not clobber sibling keys', () => {
    storage.updateSettings({ soundEnabled: false, owlFrequency: 'quiet' });
    storage.updateSettings({ reducedMotion: true });
    expect(storage.getSettings()).toEqual({
      owlEnabled: true,
      soundEnabled: false,
      reducedMotion: true,
      owlFrequency: 'quiet',
    });
  });
});
