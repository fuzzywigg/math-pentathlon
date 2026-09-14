/**
 * Wave 36 — storage ensureDefaults owl partial-field leftovers via importData.
 * Hits mood/lastInteraction/messagesSeen/tutorials/totalMessagesShown ?? paths.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  storage,
  CURRENT_DATA_VERSION,
  DEFAULT_OWL_STATE,
  DEFAULT_SETTINGS,
} from '../../src/core/storage';

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

describe('Wave 36 storage-owl-partial — sparse owlState fills ?? defaults', () => {
  it('empty owl object fills all DEFAULT_OWL_STATE fields', () => {
    expect(
      storage.importData(
        JSON.stringify({ version: CURRENT_DATA_VERSION, owlState: {} })
      )
    ).toBe(true);
    expect(storage.getOwlState()).toEqual(DEFAULT_OWL_STATE);
  });

  it('mood-only owl keeps mood and defaults the rest', () => {
    expect(
      storage.importData(
        JSON.stringify({
          version: CURRENT_DATA_VERSION,
          owlState: { mood: 'proud' },
        })
      )
    ).toBe(true);
    const owl = storage.getOwlState();
    expect(owl.mood).toBe('proud');
    expect(owl.lastInteraction).toBe(DEFAULT_OWL_STATE.lastInteraction);
    expect(owl.messagesSeen).toEqual([]);
    expect(owl.tutorialsCompleted).toEqual([]);
    expect(owl.totalMessagesShown).toBe(0);
  });

  it('preserves arrays when present and copies them out of getOwlState', () => {
    expect(
      storage.importData(
        JSON.stringify({
          version: CURRENT_DATA_VERSION,
          owlState: {
            mood: 'sleepy',
            lastInteraction: 42,
            messagesSeen: ['m1'],
            tutorialsCompleted: ['t1'],
            totalMessagesShown: 9,
          },
        })
      )
    ).toBe(true);
    const a = storage.getOwlState();
    const b = storage.getOwlState();
    expect(a).toEqual({
      mood: 'sleepy',
      lastInteraction: 42,
      messagesSeen: ['m1'],
      tutorialsCompleted: ['t1'],
      totalMessagesShown: 9,
    });
    expect(a.messagesSeen).not.toBe(b.messagesSeen);
    expect(a.tutorialsCompleted).not.toBe(b.tutorialsCompleted);
    a.messagesSeen.push('mut');
    expect(storage.getOwlState().messagesSeen).toEqual(['m1']);
  });

  it('nullish messagesSeen/tutorials become fresh arrays', () => {
    expect(
      storage.importData(
        JSON.stringify({
          version: CURRENT_DATA_VERSION,
          owlState: {
            mood: 'thinking',
            messagesSeen: null,
            tutorialsCompleted: null,
            totalMessagesShown: null,
            lastInteraction: null,
          },
        })
      )
    ).toBe(true);
    const owl = storage.getOwlState();
    expect(owl.mood).toBe('thinking');
    expect(owl.messagesSeen).toEqual([]);
    expect(owl.tutorialsCompleted).toEqual([]);
    expect(owl.totalMessagesShown).toBe(DEFAULT_OWL_STATE.totalMessagesShown);
    expect(owl.lastInteraction).toBe(DEFAULT_OWL_STATE.lastInteraction);
  });
});

describe('Wave 36 storage-owl-partial — settings still merge alongside sparse owl', () => {
  it('partial settings + sparse owl coexist', () => {
    expect(
      storage.importData(
        JSON.stringify({
          version: CURRENT_DATA_VERSION,
          settings: { reducedMotion: true },
          owlState: { mood: 'encouraging' },
        })
      )
    ).toBe(true);
    expect(storage.getSettings()).toEqual({
      ...DEFAULT_SETTINGS,
      reducedMotion: true,
    });
    expect(storage.getOwlState().mood).toBe('encouraging');
  });
});
