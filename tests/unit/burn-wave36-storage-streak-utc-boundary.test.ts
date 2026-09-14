/**
 * Wave 36 — storage streak UTC date-boundary leftovers.
 * getTodayString uses toISOString().split('T')[0] (UTC calendar day).
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

describe('Wave 36 storage-streak-utc — midnight UTC edges', () => {
  it('play just before and after UTC midnight continues streak', () => {
    vi.setSystemTime(new Date('2026-09-10T23:59:59.000Z'));
    storage.updateStreak();
    expect(storage.getStreak().lastPlayDate).toBe('2026-09-10');
    expect(storage.getStreak().currentStreak).toBe(1);

    vi.setSystemTime(new Date('2026-09-11T00:00:00.000Z'));
    storage.updateStreak();
    expect(storage.getStreak().lastPlayDate).toBe('2026-09-11');
    expect(storage.getStreak().currentStreak).toBe(2);
  });

  it('same UTC day even if local evening would differ is still no-op', () => {
    vi.setSystemTime(new Date('2026-09-10T01:00:00.000Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-09-10T23:00:00.000Z'));
    const before = storage.getStreak();
    storage.updateStreak();
    expect(storage.getStreak()).toEqual(before);
    expect(storage.getStreak().currentStreak).toBe(1);
  });

  it('gap of two UTC days breaks and restarts streakStartDate', () => {
    vi.setSystemTime(new Date('2026-09-01T12:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-09-02T12:00:00Z'));
    storage.updateStreak();
    expect(storage.getStreak().currentStreak).toBe(2);

    vi.setSystemTime(new Date('2026-09-04T12:00:00Z'));
    storage.updateStreak();
    const s = storage.getStreak();
    expect(s.currentStreak).toBe(1);
    expect(s.streakStartDate).toBe('2026-09-04');
    expect(s.bestStreak).toBe(2);
  });

  it('recordGameResult drives streak via updateStreak at UTC day edges', () => {
    vi.setSystemTime(new Date('2026-12-31T23:30:00Z'));
    storage.recordGameResult({
      gameId: 'nye',
      winner: 'player1',
      playerWon: true,
      duration: 100,
      moveCount: 1,
      playedAt: Date.now(),
    });
    expect(storage.getStreak().lastPlayDate).toBe('2026-12-31');

    vi.setSystemTime(new Date('2027-01-01T00:30:00Z'));
    storage.recordGameResult({
      gameId: 'nye',
      winner: 'player1',
      playerWon: true,
      duration: 100,
      moveCount: 1,
      playedAt: Date.now(),
    });
    expect(storage.getStreak().currentStreak).toBe(2);
    expect(storage.getStreak().lastPlayDate).toBe('2027-01-01');
  });
});
