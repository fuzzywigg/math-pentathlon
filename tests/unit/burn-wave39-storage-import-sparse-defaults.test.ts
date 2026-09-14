/**
 * Wave 39 — import sparse defaults leftovers after #172/#173.
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

describe('Wave 39 storage — import sparse defaults', () => {
  it('import {} / {version:1} fills profile/settings/owl', () => {
    expect(storage.importData('{}')).toBe(true);
    expect(storage.getSettings().owlEnabled).toBeDefined();
    expect(storage.getOwlState().mood).toBeDefined();

    expect(storage.importData(JSON.stringify({ version: 1 }))).toBe(true);
    expect(storage.getSettings().soundEnabled).toBeDefined();
    expect(storage.getOwlState()).toBeTruthy();
  });
});
