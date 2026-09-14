/**
 * Wave 30 — storage owl message flood + tutorial catalog stress.
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

describe('Wave 30 storage-owl-stress — exact trim window', () => {
  it('at exactly 50 messages, no trim occurs', () => {
    for (let i = 0; i < 50; i++) {
      storage.markMessageSeen(`exact-${i}`);
    }
    const seen = storage.getOwlState().messagesSeen;
    expect(seen).toHaveLength(50);
    expect(seen[0]).toBe('exact-0');
    expect(seen[49]).toBe('exact-49');
    expect(storage.getOwlState().totalMessagesShown).toBe(50);
  });

  it('51st message drops the oldest', () => {
    for (let i = 0; i < 51; i++) {
      storage.markMessageSeen(`edge-${i}`);
    }
    const seen = storage.getOwlState().messagesSeen;
    expect(seen).toHaveLength(50);
    expect(seen[0]).toBe('edge-1');
    expect(seen[49]).toBe('edge-50');
    expect(storage.hasSeenMessage('edge-0')).toBe(false);
    expect(storage.getOwlState().totalMessagesShown).toBe(51);
  });

  it('export/import preserves trimmed window', () => {
    for (let i = 0; i < 55; i++) {
      storage.markMessageSeen(`persist-${i}`);
    }
    const json = storage.exportData();
    storage.resetAll();
    expect(storage.importData(json)).toBe(true);
    const seen = storage.getOwlState().messagesSeen;
    expect(seen).toHaveLength(50);
    expect(seen[0]).toBe('persist-5');
    expect(storage.getOwlState().totalMessagesShown).toBe(55);
  });
});

describe('Wave 30 storage-owl-stress — tutorial catalog', () => {
  it('marks a large tutorial id set without duplicates', () => {
    const ids = Array.from({ length: 20 }, (_, i) => `tut-${i}`);
    for (const id of ids) {
      storage.markTutorialCompleted(id);
      storage.markTutorialCompleted(id);
    }
    expect(storage.getOwlState().tutorialsCompleted).toEqual(ids);
    for (const id of ids) {
      expect(storage.hasTutorialCompleted(id)).toBe(true);
    }
    expect(storage.hasTutorialCompleted('tut-missing')).toBe(false);
  });

  it('mood + messages + tutorials compose independently under stress', () => {
    storage.updateOwlMood('thinking');
    for (let i = 0; i < 10; i++) {
      storage.markMessageSeen(`mix-${i}`);
      storage.markTutorialCompleted(`t-${i}`);
    }
    storage.updateOwlMood('proud');
    const owl = storage.getOwlState();
    expect(owl.mood).toBe('proud');
    expect(owl.messagesSeen).toHaveLength(10);
    expect(owl.tutorialsCompleted).toHaveLength(10);
    expect(owl.totalMessagesShown).toBe(10);
  });
});
