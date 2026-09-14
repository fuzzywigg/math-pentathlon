/**
 * Wave 30 — storage owl mood / lastInteraction / getOwlState copy.
 * Distinct from wave23 owl smoke and wave25 owl component chrome.
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
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 30 storage-owl-mood — mood matrix', () => {
  it('defaults to happy with lastInteraction 0', () => {
    const owl = storage.getOwlState();
    expect(owl.mood).toBe('happy');
    expect(owl.lastInteraction).toBe(0);
  });

  it('updateOwlMood accepts every OwlMood variant', () => {
    for (const mood of MOODS) {
      storage.updateOwlMood(mood);
      expect(storage.getOwlState().mood).toBe(mood);
    }
  });

  it('updateOwlMood stamps lastInteraction to now', () => {
    vi.setSystemTime(new Date('2026-09-14T06:00:00Z'));
    storage.updateOwlMood('thinking');
    expect(storage.getOwlState().lastInteraction).toBe(
      Date.parse('2026-09-14T06:00:00Z')
    );
    vi.setSystemTime(new Date('2026-09-14T06:30:00Z'));
    storage.updateOwlMood('sleepy');
    expect(storage.getOwlState().lastInteraction).toBe(
      Date.parse('2026-09-14T06:30:00Z')
    );
    expect(storage.getOwlState().mood).toBe('sleepy');
  });
});

describe('Wave 30 storage-owl-mood — getOwlState isolation', () => {
  it('getOwlState returns a shallow copy (mood mutate does not stick)', () => {
    storage.updateOwlMood('proud');
    const snap = storage.getOwlState();
    snap.mood = 'happy';
    snap.messagesSeen.push('fake');
    expect(storage.getOwlState().mood).toBe('proud');
    expect(storage.getOwlState().messagesSeen).toEqual([]);
  });

  it('mood updates do not clear messagesSeen or tutorialsCompleted', () => {
    storage.markMessageSeen('m1');
    storage.markTutorialCompleted('hex');
    storage.updateOwlMood('celebrating');
    const owl = storage.getOwlState();
    expect(owl.mood).toBe('celebrating');
    expect(owl.messagesSeen).toEqual(['m1']);
    expect(owl.tutorialsCompleted).toEqual(['hex']);
    expect(owl.totalMessagesShown).toBe(1);
  });
});
