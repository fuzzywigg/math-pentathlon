/**
 * Wave 36 — storage owl mood catalog survives export/import leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage, type OwlMood } from '../../src/core/storage';

const MOODS: OwlMood[] = [
  'happy',
  'encouraging',
  'celebrating',
  'thinking',
  'sleepy',
  'proud',
];

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

describe('Wave 36 storage-owl-export — mood catalog persistence', () => {
  it.each(MOODS)('export/import preserves mood=%s', (mood) => {
    storage.updateOwlMood(mood);
    storage.markMessageSeen(`msg-${mood}`);
    storage.markTutorialCompleted(`tut-${mood}`);
    const json = storage.exportData();
    storage.resetAll();
    expect(storage.importData(json)).toBe(true);
    expect(storage.getOwlState().mood).toBe(mood);
    expect(storage.hasSeenMessage(`msg-${mood}`)).toBe(true);
    expect(storage.hasTutorialCompleted(`tut-${mood}`)).toBe(true);
  });
});
