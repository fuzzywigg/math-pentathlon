/**
 * Wave 30 — storage UserSettings partial merge + frequency enum.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  storage,
  DEFAULT_SETTINGS,
  type UserSettings,
} from '../../src/core/storage';

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

describe('Wave 30 storage-settings — defaults and get copy', () => {
  it('getSettings starts as DEFAULT_SETTINGS values', () => {
    expect(storage.getSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('getSettings returns a shallow copy', () => {
    const s = storage.getSettings();
    s.soundEnabled = false;
    s.owlFrequency = 'quiet';
    expect(storage.getSettings().soundEnabled).toBe(true);
    expect(storage.getSettings().owlFrequency).toBe('normal');
  });
});

describe('Wave 30 storage-settings — partial merge', () => {
  it('updateSettings merges one key without clobbering others', () => {
    storage.updateSettings({ soundEnabled: false });
    expect(storage.getSettings()).toEqual({
      ...DEFAULT_SETTINGS,
      soundEnabled: false,
    });
  });

  it('successive partial updates accumulate', () => {
    storage.updateSettings({ owlEnabled: false });
    storage.updateSettings({ reducedMotion: true });
    storage.updateSettings({ owlFrequency: 'chatty' });
    expect(storage.getSettings()).toEqual({
      owlEnabled: false,
      soundEnabled: true,
      reducedMotion: true,
      owlFrequency: 'chatty',
    });
  });

  it('can set every owlFrequency variant', () => {
    const freqs: UserSettings['owlFrequency'][] = ['chatty', 'normal', 'quiet'];
    for (const owlFrequency of freqs) {
      storage.updateSettings({ owlFrequency });
      expect(storage.getSettings().owlFrequency).toBe(owlFrequency);
    }
  });

  it('full replacement via all keys matches explicit object', () => {
    const next: UserSettings = {
      owlEnabled: false,
      soundEnabled: false,
      reducedMotion: true,
      owlFrequency: 'quiet',
    };
    storage.updateSettings(next);
    expect(storage.getSettings()).toEqual(next);
  });
});

describe('Wave 30 storage-settings — reset restores defaults', () => {
  it('resetAll restores DEFAULT_SETTINGS', () => {
    storage.updateSettings({
      owlEnabled: false,
      soundEnabled: false,
      reducedMotion: true,
      owlFrequency: 'quiet',
    });
    storage.resetAll();
    expect(storage.getSettings()).toEqual(DEFAULT_SETTINGS);
  });
});
