/**
 * Wave 36 — storage tutorial/message idempotency stress leftovers.
 * Tests-only. No product inventing.
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
  vi.restoreAllMocks();
});

describe('Wave 36 storage-tutorial-message — stress', () => {
  it('markTutorialCompleted is idempotent under repeats', () => {
    const ids = ['hex', 'frac', 'calla', 'hex', 'frac'];
    for (const id of ids) {
      storage.markTutorialCompleted(id);
    }
    expect(storage.getOwlState().tutorialsCompleted).toEqual([
      'hex',
      'frac',
      'calla',
    ]);
    expect(storage.hasTutorialCompleted('hex')).toBe(true);
    expect(storage.hasTutorialCompleted('missing')).toBe(false);
  });

  it('message flood to exactly 50 then +1 trims oldest', () => {
    for (let i = 0; i < 50; i++) {
      storage.markMessageSeen(`m-${i}`);
    }
    expect(storage.getOwlState().messagesSeen).toHaveLength(50);
    expect(storage.getOwlState().totalMessagesShown).toBe(50);
    storage.markMessageSeen('m-50');
    const seen = storage.getOwlState().messagesSeen;
    expect(seen).toHaveLength(50);
    expect(seen[0]).toBe('m-1');
    expect(seen[49]).toBe('m-50');
    expect(storage.getOwlState().totalMessagesShown).toBe(51);
    // re-mark trimmed id is "new" again
    expect(storage.hasSeenMessage('m-0')).toBe(false);
    storage.markMessageSeen('m-0');
    expect(storage.hasSeenMessage('m-0')).toBe(true);
    expect(storage.getOwlState().totalMessagesShown).toBe(52);
  });

  it('duplicate marks after trim still no-op for present ids', () => {
    for (let i = 0; i < 55; i++) {
      storage.markMessageSeen(`x-${i}`);
    }
    const total = storage.getOwlState().totalMessagesShown;
    storage.markMessageSeen('x-54');
    expect(storage.getOwlState().totalMessagesShown).toBe(total);
  });
});
