/**
 * Wave 30 — storage owl message seen history + MAX_MESSAGES_HISTORY trim.
 * Deepens wave23 trim smoke with duplicate / order / totalMessagesShown edges.
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

describe('Wave 30 storage-owl-messages — mark / has / count', () => {
  it('markMessageSeen appends and increments totalMessagesShown', () => {
    expect(storage.hasSeenMessage('welcome')).toBe(false);
    storage.markMessageSeen('welcome');
    expect(storage.hasSeenMessage('welcome')).toBe(true);
    expect(storage.getOwlState().messagesSeen).toEqual(['welcome']);
    expect(storage.getOwlState().totalMessagesShown).toBe(1);
  });

  it('duplicate mark does not grow list or total', () => {
    storage.markMessageSeen('welcome');
    storage.markMessageSeen('welcome');
    storage.markMessageSeen('welcome');
    expect(storage.getOwlState().messagesSeen).toEqual(['welcome']);
    expect(storage.getOwlState().totalMessagesShown).toBe(1);
  });

  it('preserves insertion order for distinct ids', () => {
    storage.markMessageSeen('a');
    storage.markMessageSeen('b');
    storage.markMessageSeen('c');
    expect(storage.getOwlState().messagesSeen).toEqual(['a', 'b', 'c']);
    expect(storage.getOwlState().totalMessagesShown).toBe(3);
  });
});

describe('Wave 30 storage-owl-messages — history trim at 50', () => {
  it('keeps only the last 50 after flooding past the cap', () => {
    for (let i = 0; i < 60; i++) {
      storage.markMessageSeen(`msg-${i}`);
    }
    const seen = storage.getOwlState().messagesSeen;
    expect(seen).toHaveLength(50);
    expect(seen[0]).toBe('msg-10');
    expect(seen[49]).toBe('msg-59');
    expect(storage.hasSeenMessage('msg-0')).toBe(false);
    expect(storage.hasSeenMessage('msg-9')).toBe(false);
    expect(storage.hasSeenMessage('msg-10')).toBe(true);
    expect(storage.hasSeenMessage('msg-59')).toBe(true);
  });

  it('totalMessagesShown still counts every first-time mark past the cap', () => {
    for (let i = 0; i < 55; i++) {
      storage.markMessageSeen(`n-${i}`);
    }
    expect(storage.getOwlState().totalMessagesShown).toBe(55);
    expect(storage.getOwlState().messagesSeen).toHaveLength(50);
  });

  it('re-marking a trimmed-away id after overflow re-adds and increments', () => {
    for (let i = 0; i < 55; i++) {
      storage.markMessageSeen(`x-${i}`);
    }
    expect(storage.hasSeenMessage('x-0')).toBe(false);
    const totalBefore = storage.getOwlState().totalMessagesShown;
    storage.markMessageSeen('x-0');
    expect(storage.hasSeenMessage('x-0')).toBe(true);
    expect(storage.getOwlState().totalMessagesShown).toBe(totalBefore + 1);
    expect(storage.getOwlState().messagesSeen).toContain('x-0');
  });
});
