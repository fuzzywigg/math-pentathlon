/**
 * Wave 36 — storage calendar streak month/year/UTC boundary dense table.
 * Leftover beyond wave 30 streak-calendar / streak-longrun. Tests-only.
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

describe('Wave 36 storage-streak — month and year boundaries', () => {
  it('continues across month end (Jan 31 → Feb 1)', () => {
    vi.setSystemTime(new Date('2026-01-31T12:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-02-01T12:00:00Z'));
    const s = storage.updateStreak();
    expect(s.currentStreak).toBe(2);
    expect(s.lastPlayDate).toBe('2026-02-01');
    expect(s.streakStartDate).toBe('2026-01-31');
  });

  it('continues across year end (Dec 31 → Jan 1)', () => {
    vi.setSystemTime(new Date('2025-12-31T23:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-01-01T01:00:00Z'));
    const s = storage.updateStreak();
    expect(s.currentStreak).toBe(2);
    expect(s.lastPlayDate).toBe('2026-01-01');
    expect(s.streakStartDate).toBe('2025-12-31');
  });

  it('breaks when skipping a day across month boundary', () => {
    vi.setSystemTime(new Date('2026-04-30T12:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-05-02T12:00:00Z'));
    const s = storage.updateStreak();
    expect(s.currentStreak).toBe(1);
    expect(s.bestStreak).toBe(1);
    expect(s.streakStartDate).toBe('2026-05-02');
  });
});

describe('Wave 36 storage-streak — same-day multi-game via recordGameResult', () => {
  it('many same-day records do not inflate calendar streak', () => {
    vi.setSystemTime(new Date('2026-09-14T08:00:00Z'));
    for (let i = 0; i < 12; i++) {
      storage.recordGameResult({
        gameId: i % 2 === 0 ? 'hex' : 'calla',
        winner: 'player1',
        playerWon: true,
        duration: 100 + i,
        moveCount: i + 1,
        playedAt: Date.now() + i,
      });
    }
    expect(storage.getStreak().currentStreak).toBe(1);
    expect(storage.getStreak().lastPlayDate).toBe('2026-09-14');
    expect(storage.getTotalGamesPlayed()).toBe(12);
  });

  it('next-day record after multi-game day continues streak to 2', () => {
    vi.setSystemTime(new Date('2026-09-14T08:00:00Z'));
    storage.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 100,
      moveCount: 3,
      playedAt: Date.now(),
    });
    storage.recordGameResult({
      gameId: 'hex',
      winner: 'ai',
      playerWon: false,
      duration: 80,
      moveCount: 2,
      playedAt: Date.now(),
    });

    vi.setSystemTime(new Date('2026-09-15T08:00:00Z'));
    storage.recordGameResult({
      gameId: 'fiar',
      winner: 'player1',
      playerWon: true,
      duration: 50,
      moveCount: 1,
      playedAt: Date.now(),
    });

    expect(storage.getStreak().currentStreak).toBe(2);
    expect(storage.getStreak().bestStreak).toBe(2);
    expect(storage.getStreak().streakStartDate).toBe('2026-09-14');
  });
});

describe('Wave 36 storage-streak — best survives rebuild after break', () => {
  it('bestStreak retained when rebuilding a shorter streak', () => {
    for (let day = 1; day <= 5; day++) {
      vi.setSystemTime(
        new Date(`2026-06-${String(day).padStart(2, '0')}T12:00:00Z`)
      );
      storage.updateStreak();
    }
    expect(storage.getStreak().bestStreak).toBe(5);

    vi.setSystemTime(new Date('2026-06-08T12:00:00Z'));
    storage.updateStreak();
    expect(storage.getStreak().currentStreak).toBe(1);
    expect(storage.getStreak().bestStreak).toBe(5);

    vi.setSystemTime(new Date('2026-06-09T12:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-06-10T12:00:00Z'));
    storage.updateStreak();
    expect(storage.getStreak().currentStreak).toBe(3);
    expect(storage.getStreak().bestStreak).toBe(5);
  });
});
