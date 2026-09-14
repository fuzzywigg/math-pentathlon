/**
 * Wave 36 — storage getter copy / live-ref isolation leftovers.
 * Documents which APIs return snapshots vs live mutable references.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1_700_000_000_000);
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 36 storage-ref — snapshot getters', () => {
  it('getSettings returns a shallow copy', () => {
    const a = storage.getSettings();
    const b = storage.getSettings();
    expect(a).toEqual(b);
    expect(a).not.toBe(b);
    a.soundEnabled = false;
    expect(storage.getSettings().soundEnabled).toBe(true);
  });

  it('getStreak returns a shallow copy', () => {
    storage.updateStreak();
    const a = storage.getStreak();
    a.currentStreak = 999;
    expect(storage.getStreak().currentStreak).not.toBe(999);
  });

  it('getAchievements returns a shallow array copy', () => {
    storage.unlockAchievement('iso');
    const a = storage.getAchievements();
    a.pop();
    expect(storage.getAchievements()).toHaveLength(1);
  });

  it('getAllGameStats returns a shallow record copy', () => {
    storage.getGameStats('hex');
    const all = storage.getAllGameStats();
    delete all['hex'];
    expect(storage.getAllGameStats()['hex']).toBeDefined();
  });
});

describe('Wave 36 storage-ref — live mutable refs', () => {
  it('getGameStats returns the live stats object (mutations stick)', () => {
    const stats = storage.getGameStats('live');
    stats.gamesPlayed = 7;
    expect(storage.getGameStats('live').gamesPlayed).toBe(7);
  });

  it('getProfile returns the live profile reference when set', () => {
    storage.createProfile('Live', 'l');
    const p = storage.getProfile()!;
    p.name = 'Mutated';
    expect(storage.getProfile()?.name).toBe('Mutated');
  });
});
