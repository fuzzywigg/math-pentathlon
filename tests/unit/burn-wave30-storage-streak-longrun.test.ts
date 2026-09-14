/**
 * Wave 30 — storage calendar streak long-run + leap/year-boundary edges.
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

describe('Wave 30 storage-streak-longrun — consecutive week', () => {
  it('seven consecutive days yields current=best=7', () => {
    for (let day = 1; day <= 7; day++) {
      const dd = String(day).padStart(2, '0');
      vi.setSystemTime(new Date(`2026-07-${dd}T15:00:00Z`));
      const s = storage.updateStreak();
      expect(s.currentStreak).toBe(day);
      expect(s.bestStreak).toBe(day);
      expect(s.lastPlayDate).toBe(`2026-07-${dd}`);
      expect(s.streakStartDate).toBe('2026-07-01');
    }
  });

  it('multiple same-day calls interleaved with days stay stable', () => {
    vi.setSystemTime(new Date('2026-08-01T01:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-08-01T12:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-08-01T23:00:00Z'));
    expect(storage.updateStreak().currentStreak).toBe(1);

    vi.setSystemTime(new Date('2026-08-02T00:30:00Z'));
    expect(storage.updateStreak().currentStreak).toBe(2);
    vi.setSystemTime(new Date('2026-08-02T20:00:00Z'));
    expect(storage.updateStreak().currentStreak).toBe(2);
  });
});

describe('Wave 30 storage-streak-longrun — year boundary', () => {
  it('Dec 31 → Jan 1 continues the streak', () => {
    vi.setSystemTime(new Date('2025-12-31T20:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-01-01T04:00:00Z'));
    const s = storage.updateStreak();
    expect(s.currentStreak).toBe(2);
    expect(s.lastPlayDate).toBe('2026-01-01');
    expect(s.streakStartDate).toBe('2025-12-31');
  });

  it('Jan 1 → Jan 3 gap breaks across new year', () => {
    vi.setSystemTime(new Date('2026-01-01T12:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-01-03T12:00:00Z'));
    const s = storage.updateStreak();
    expect(s.currentStreak).toBe(1);
    expect(s.bestStreak).toBe(1);
    expect(s.streakStartDate).toBe('2026-01-03');
  });
});

describe('Wave 30 storage-streak-longrun — recordGameResult same-day spam', () => {
  it('many games same day only bump calendar streak once', () => {
    vi.setSystemTime(new Date('2026-09-14T10:00:00Z'));
    for (let i = 0; i < 5; i++) {
      storage.recordGameResult({
        gameId: 'hex',
        winner: 'player1',
        playerWon: true,
        duration: 10,
        moveCount: 1,
        playedAt: Date.now(),
      });
    }
    expect(storage.getStreak().currentStreak).toBe(1);
    expect(storage.getGameStats('hex').gamesPlayed).toBe(5);
    expect(storage.getGameStats('hex').currentWinStreak).toBe(5);
  });
});
