/**
 * Wave 30 — storage owl mood / message history trim / tutorials.
 * Deepens wave 23 owl smoke into boundary + mood catalog coverage.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage, type OwlMood } from '../../src/core/storage';
import { resetStorageHarness } from './helpers/storage-test-harness';

beforeEach(() => {
  vi.useFakeTimers();
  resetStorageHarness();
});

afterEach(() => {
  vi.useRealTimers();
  resetStorageHarness();
  vi.restoreAllMocks();
});

const MOODS: OwlMood[] = [
  'happy',
  'encouraging',
  'celebrating',
  'thinking',
  'sleepy',
  'proud',
];

describe('Wave 30 storage-owl — mood catalog', () => {
  it.each(MOODS)(
    'updateOwlMood(%s) sticks and bumps lastInteraction',
    (mood) => {
      vi.setSystemTime(new Date('2026-09-14T03:00:00Z'));
      storage.updateOwlMood(mood);
      const state = storage.getOwlState();
      expect(state.mood).toBe(mood);
      expect(state.lastInteraction).toBe(Date.now());
    }
  );

  it('sequential mood changes keep latest only', () => {
    for (const mood of MOODS) {
      storage.updateOwlMood(mood);
    }
    expect(storage.getOwlState().mood).toBe('proud');
  });

  it('getOwlState shallow-copies top-level fields (mood isolation)', () => {
    storage.updateOwlMood('thinking');
    const copy = storage.getOwlState();
    copy.mood = 'sleepy';
    copy.lastInteraction = 999;
    copy.totalMessagesShown = 999;
    expect(storage.getOwlState().mood).toBe('thinking');
    expect(storage.getOwlState().lastInteraction).not.toBe(999);
    expect(storage.getOwlState().totalMessagesShown).toBe(0);
    // arrays are intentionally shared by shallow copy — do not mutate in tests
    expect(storage.getOwlState().messagesSeen).toEqual([]);
  });
});

describe('Wave 30 storage-owl — message seen / trim', () => {
  it('first mark increments totalMessagesShown; duplicate does not', () => {
    storage.markMessageSeen('m1');
    expect(storage.hasSeenMessage('m1')).toBe(true);
    expect(storage.getOwlState().totalMessagesShown).toBe(1);
    storage.markMessageSeen('m1');
    expect(storage.getOwlState().totalMessagesShown).toBe(1);
    expect(storage.getOwlState().messagesSeen).toEqual(['m1']);
  });

  it('exactly 50 messages retained without trim', () => {
    for (let i = 0; i < 50; i++) {
      storage.markMessageSeen(`msg-${i}`);
    }
    const seen = storage.getOwlState().messagesSeen;
    expect(seen).toHaveLength(50);
    expect(seen[0]).toBe('msg-0');
    expect(seen[49]).toBe('msg-49');
    expect(storage.getOwlState().totalMessagesShown).toBe(50);
  });

  it('51st message drops the oldest (FIFO trim to 50)', () => {
    for (let i = 0; i < 51; i++) {
      storage.markMessageSeen(`msg-${i}`);
    }
    const seen = storage.getOwlState().messagesSeen;
    expect(seen).toHaveLength(50);
    expect(seen).not.toContain('msg-0');
    expect(seen[0]).toBe('msg-1');
    expect(seen[49]).toBe('msg-50');
    expect(storage.hasSeenMessage('msg-0')).toBe(false);
    expect(storage.hasSeenMessage('msg-50')).toBe(true);
    // totalMessagesShown counts unique first-marks, not retained length
    expect(storage.getOwlState().totalMessagesShown).toBe(51);
  });

  it('trim after 100 unique marks keeps the last 50 ids', () => {
    for (let i = 0; i < 100; i++) {
      storage.markMessageSeen(`bulk-${i}`);
    }
    const seen = storage.getOwlState().messagesSeen;
    expect(seen).toHaveLength(50);
    expect(seen[0]).toBe('bulk-50');
    expect(seen[49]).toBe('bulk-99');
    expect(storage.getOwlState().totalMessagesShown).toBe(100);
  });

  it('re-marking a retained id after trim does not bump total', () => {
    for (let i = 0; i < 55; i++) {
      storage.markMessageSeen(`x-${i}`);
    }
    // trim keeps x-5..x-54; x-0..x-4 dropped
    expect(storage.hasSeenMessage('x-0')).toBe(false);
    expect(storage.hasSeenMessage('x-4')).toBe(false);
    expect(storage.hasSeenMessage('x-5')).toBe(true);
    expect(storage.hasSeenMessage('x-54')).toBe(true);
    const totalBefore = storage.getOwlState().totalMessagesShown;
    storage.markMessageSeen('x-54'); // still present
    expect(storage.getOwlState().totalMessagesShown).toBe(totalBefore);
  });
});

describe('Wave 30 storage-owl — tutorials completed', () => {
  const TUTORIALS = [
    'hex',
    'calla',
    'fiar',
    'contig-60',
    'prime-gold',
    'juggle',
  ];

  it('markTutorialCompleted is idempotent per id', () => {
    storage.markTutorialCompleted('hex');
    storage.markTutorialCompleted('hex');
    storage.markTutorialCompleted('hex');
    expect(storage.getOwlState().tutorialsCompleted).toEqual(['hex']);
    expect(storage.hasTutorialCompleted('hex')).toBe(true);
  });

  it('tracks multiple tutorials in insertion order', () => {
    for (const id of TUTORIALS) {
      storage.markTutorialCompleted(id);
    }
    expect(storage.getOwlState().tutorialsCompleted).toEqual(TUTORIALS);
    for (const id of TUTORIALS) {
      expect(storage.hasTutorialCompleted(id)).toBe(true);
    }
    expect(storage.hasTutorialCompleted('missing')).toBe(false);
  });

  it('tutorials persist across export/import', () => {
    storage.markTutorialCompleted('hex');
    storage.markTutorialCompleted('calla');
    const json = storage.exportData();
    storage.resetAll();
    expect(storage.importData(json)).toBe(true);
    expect(storage.getOwlState().tutorialsCompleted).toEqual(['hex', 'calla']);
  });
});

describe('Wave 30 storage-owl — defaults', () => {
  it('resetAll restores scalar owl fields; shared default arrays need sanitize', () => {
    storage.updateOwlMood('proud');
    storage.markMessageSeen('z');
    storage.markTutorialCompleted('t');
    storage.resetAll();
    expect(storage.getOwlState().mood).toBe('happy');
    expect(storage.getOwlState().lastInteraction).toBe(0);
    expect(storage.getOwlState().totalMessagesShown).toBe(0);
    // createDefaultProgress shallow-copies DEFAULT_OWL_STATE arrays
    expect(storage.getOwlState().messagesSeen).toContain('z');
    expect(storage.getOwlState().tutorialsCompleted).toContain('t');
    resetStorageHarness();
    expect(storage.getOwlState()).toEqual({
      mood: 'happy',
      lastInteraction: 0,
      messagesSeen: [],
      tutorialsCompleted: [],
      totalMessagesShown: 0,
    });
  });
});
