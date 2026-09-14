/**
 * Wave 36 — getGameStats live ref vs getAllGameStats shallow copy.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
});

describe('Wave 36 storage-live-ref — mutability contracts', () => {
  it('mutating getGameStats ref is visible on next read', () => {
    const ref = storage.getGameStats('star-track');
    ref.gamesWon = 99;
    expect(storage.getGameStats('star-track').gamesWon).toBe(99);
  });

  it('getAllGameStats map is a shallow copy (swap-safe)', () => {
    storage.getGameStats('hex');
    const all = storage.getAllGameStats();
    delete all['hex'];
    expect(storage.getAllGameStats()['hex']).toBeTruthy();
    // nested object still shared
    all['hex'] = storage.getGameStats('hex');
    all['hex'].gamesPlayed = 7;
    expect(storage.getGameStats('hex').gamesPlayed).toBe(7);
  });
});
