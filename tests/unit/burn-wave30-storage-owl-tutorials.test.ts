/**
 * Wave 30 — storage owl tutorialsCompleted set semantics.
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

describe('Wave 30 storage-owl-tutorials — mark / has', () => {
  it('starts with no tutorials completed', () => {
    expect(storage.hasTutorialCompleted('hex')).toBe(false);
    expect(storage.getOwlState().tutorialsCompleted).toEqual([]);
  });

  it('markTutorialCompleted is idempotent per id', () => {
    storage.markTutorialCompleted('hex');
    storage.markTutorialCompleted('hex');
    storage.markTutorialCompleted('hex');
    expect(storage.getOwlState().tutorialsCompleted).toEqual(['hex']);
    expect(storage.hasTutorialCompleted('hex')).toBe(true);
  });

  it('accumulates distinct tutorial ids in order', () => {
    storage.markTutorialCompleted('hex');
    storage.markTutorialCompleted('calla');
    storage.markTutorialCompleted('star-track');
    expect(storage.getOwlState().tutorialsCompleted).toEqual([
      'hex',
      'calla',
      'star-track',
    ]);
    expect(storage.hasTutorialCompleted('calla')).toBe(true);
    expect(storage.hasTutorialCompleted('missing')).toBe(false);
  });
});

describe('Wave 30 storage-owl-tutorials — isolation from messages', () => {
  it('tutorial marks do not affect messagesSeen or mood', () => {
    storage.updateOwlMood('encouraging');
    storage.markMessageSeen('tip-1');
    storage.markTutorialCompleted('fiar');
    const owl = storage.getOwlState();
    expect(owl.mood).toBe('encouraging');
    expect(owl.messagesSeen).toEqual(['tip-1']);
    expect(owl.tutorialsCompleted).toEqual(['fiar']);
    expect(owl.totalMessagesShown).toBe(1);
  });

  it('resetAll clears tutorialsCompleted', () => {
    storage.markTutorialCompleted('hex');
    storage.resetAll();
    expect(storage.hasTutorialCompleted('hex')).toBe(false);
    expect(storage.getOwlState().tutorialsCompleted).toEqual([]);
  });
});
