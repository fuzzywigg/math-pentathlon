/**
 * Wave 36 — storage owl mood enum × lastInteraction leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage, type OwlMood } from '../../src/core/storage';

const MOODS: OwlMood[] = [
  'happy',
  'encouraging',
  'celebrating',
  'thinking',
  'sleepy',
  'proud',
];

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1_800_000_000_000);
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 36 storage-owl-mood — full mood catalog', () => {
  it.each(MOODS)('updateOwlMood(%s) sets mood and stamps lastInteraction', (mood) => {
    vi.setSystemTime(1_800_000_000_000 + MOODS.indexOf(mood) * 10);
    storage.updateOwlMood(mood);
    const owl = storage.getOwlState();
    expect(owl.mood).toBe(mood);
    expect(owl.lastInteraction).toBe(1_800_000_000_000 + MOODS.indexOf(mood) * 10);
  });

  it('sequential mood changes overwrite without clearing tutorials/messages', () => {
    storage.markMessageSeen('tip');
    storage.markTutorialCompleted('hex');
    for (const mood of MOODS) {
      storage.updateOwlMood(mood);
    }
    const owl = storage.getOwlState();
    expect(owl.mood).toBe('proud');
    expect(owl.messagesSeen).toEqual(['tip']);
    expect(owl.tutorialsCompleted).toEqual(['hex']);
  });
});
