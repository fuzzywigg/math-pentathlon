/**
 * Wave 36 — storage owl message trim sliding window + re-mark after eviction.
 * Leftover beyond wave 30 owl-messages / owl-stress. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';

const MAX = 50;

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

describe('Wave 36 storage-owl — sliding trim window', () => {
  it('keeps only the newest MAX messages after overflow', () => {
    for (let i = 0; i < MAX + 10; i++) {
      storage.markMessageSeen(`msg-${i}`);
    }
    const seen = storage.getOwlState().messagesSeen;
    expect(seen).toHaveLength(MAX);
    expect(seen[0]).toBe('msg-10');
    expect(seen[seen.length - 1]).toBe(`msg-${MAX + 9}`);
    expect(storage.hasSeenMessage('msg-0')).toBe(false);
    expect(storage.hasSeenMessage('msg-9')).toBe(false);
    expect(storage.hasSeenMessage('msg-10')).toBe(true);
  });

  it('totalMessagesShown keeps counting after trim', () => {
    for (let i = 0; i < MAX + 5; i++) {
      storage.markMessageSeen(`m-${i}`);
    }
    expect(storage.getOwlState().totalMessagesShown).toBe(MAX + 5);
    expect(storage.getOwlState().messagesSeen).toHaveLength(MAX);
  });

  it('duplicate marks after trim do not re-increment total', () => {
    for (let i = 0; i < MAX + 3; i++) {
      storage.markMessageSeen(`x-${i}`);
    }
    const before = storage.getOwlState().totalMessagesShown;
    storage.markMessageSeen(`x-${MAX + 2}`); // still in window
    expect(storage.getOwlState().totalMessagesShown).toBe(before);
  });

  it('evicted id can be re-marked and re-increments total', () => {
    for (let i = 0; i < MAX + 1; i++) {
      storage.markMessageSeen(`e-${i}`);
    }
    expect(storage.hasSeenMessage('e-0')).toBe(false);
    const before = storage.getOwlState().totalMessagesShown;
    storage.markMessageSeen('e-0');
    expect(storage.hasSeenMessage('e-0')).toBe(true);
    expect(storage.getOwlState().totalMessagesShown).toBe(before + 1);
    expect(storage.getOwlState().messagesSeen).toContain('e-0');
  });
});

describe('Wave 36 storage-owl — tutorial set vs message multiset semantics', () => {
  it('tutorial completion is idempotent and never trims', () => {
    const ids = Array.from({ length: 80 }, (_, i) => `tut-${i}`);
    for (const id of ids) {
      storage.markTutorialCompleted(id);
      storage.markTutorialCompleted(id);
    }
    expect(storage.getOwlState().tutorialsCompleted).toHaveLength(80);
    expect(storage.hasTutorialCompleted('tut-0')).toBe(true);
    expect(storage.hasTutorialCompleted('tut-79')).toBe(true);
    expect(storage.hasTutorialCompleted('missing')).toBe(false);
  });
});
