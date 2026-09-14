/**
 * Wave 39 — importData with version > CURRENT ensureDefaults behavior.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  storage,
  CURRENT_DATA_VERSION,
  createDefaultProgress,
} from '../../src/core/storage';

beforeEach(() => {
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 39 storage — version ahead import', () => {
  it('future version import succeeds and keeps profile name', () => {
    const base = createDefaultProgress();
    const future = {
      ...base,
      version: CURRENT_DATA_VERSION + 5,
      profile: {
        id: 'future-1',
        name: 'FutureKid',
        avatar: 'owl',
        createdAt: 1,
        lastActiveAt: 1,
      },
    };
    expect(storage.importData(JSON.stringify(future))).toBe(true);
    expect(storage.getProfile()?.name).toBe('FutureKid');
    expect(storage.getTotalGamesPlayed()).toBe(0);
    const exported = JSON.parse(storage.exportData());
    // ensureDefaults does not rewrite future versions downward
    expect(exported.version).toBe(CURRENT_DATA_VERSION + 5);
  });
});
