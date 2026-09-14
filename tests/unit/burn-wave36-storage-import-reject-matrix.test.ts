/**
 * Wave 36 — storage importData rejection + coerced-primitive leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage, CURRENT_DATA_VERSION } from '../../src/core/storage';

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

describe('Wave 36 storage-import-reject — parse failures keep prior state', () => {
  const bad = ['', 'null', 'undefined', '{', '{"version":1', 'not-json'];

  it.each(bad)('rejects %j and preserves profile', (payload) => {
    storage.createProfile('Safe', 's');
    storage.unlockAchievement('keep');
    expect(storage.importData(payload)).toBe(false);
    expect(storage.getProfile()?.name).toBe('Safe');
    expect(storage.hasAchievement('keep')).toBe(true);
  });
});

describe('Wave 36 storage-import-reject — ensureDefaults coerces non-objects', () => {
  // JSON primitives/arrays do not throw in ensureDefaults — they become defaults.
  it.each(['{}', '[]', '"string"', '42', 'true'])(
    'accepts %j as empty-ish progress',
    (payload) => {
      expect(storage.importData(payload)).toBe(true);
      expect(storage.getProfile()).toBeNull();
      expect(JSON.parse(storage.exportData()).version).toBe(CURRENT_DATA_VERSION);
    }
  );
});
