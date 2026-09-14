/**
 * Wave 30 — storage daily streak calendar matrix.
 * Deepens wave 23 single-path streak smoke into multi-day continue/break tables.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';
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

describe('Wave 30 storage-streak — first play bootstrap', () => {
  it('empty streak becomes current=1 with start=last=today', () => {
    vi.setSystemTime(new Date('2026-01-05T08:00:00Z'));
    const s = storage.updateStreak();
    expect(s).toEqual({
      currentStreak: 1,
      bestStreak: 1,
      lastPlayDate: '2026-01-05',
      streakStartDate: '2026-01-05',
    });
    expect(storage.getStreak()).toEqual(s);
  });

  it('same-day re-entry is a no-op (returns same object fields)', () => {
    vi.setSystemTime(new Date('2026-03-01T01:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-03-01T23:59:00Z'));
    const again = storage.updateStreak();
    expect(again.currentStreak).toBe(1);
    expect(again.lastPlayDate).toBe('2026-03-01');
    expect(again.streakStartDate).toBe('2026-03-01');
  });
});

describe('Wave 30 storage-streak — consecutive-day continue', () => {
  it('increments current and best across a 7-day run', () => {
    const days = [
      '2026-06-01',
      '2026-06-02',
      '2026-06-03',
      '2026-06-04',
      '2026-06-05',
      '2026-06-06',
      '2026-06-07',
    ];
    for (let i = 0; i < days.length; i++) {
      vi.setSystemTime(new Date(`${days[i]}T12:00:00Z`));
      const s = storage.updateStreak();
      expect(s.currentStreak).toBe(i + 1);
      expect(s.bestStreak).toBe(i + 1);
      expect(s.lastPlayDate).toBe(days[i]);
      expect(s.streakStartDate).toBe(days[0]);
    }
  });

  it('month boundary yesterday→today continues the streak', () => {
    vi.setSystemTime(new Date('2026-01-31T18:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-02-01T06:00:00Z'));
    const s = storage.updateStreak();
    expect(s.currentStreak).toBe(2);
    expect(s.lastPlayDate).toBe('2026-02-01');
    expect(s.streakStartDate).toBe('2026-01-31');
  });

  it('year boundary Dec 31 → Jan 1 continues', () => {
    vi.setSystemTime(new Date('2025-12-31T22:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-01-01T02:00:00Z'));
    const s = storage.updateStreak();
    expect(s.currentStreak).toBe(2);
    expect(s.lastPlayDate).toBe('2026-01-01');
  });
});

describe('Wave 30 storage-streak — break and restart', () => {
  it('gap of 2+ days resets current but preserves best', () => {
    vi.setSystemTime(new Date('2026-04-01T12:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-04-02T12:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-04-03T12:00:00Z'));
    storage.updateStreak();
    expect(storage.getStreak().bestStreak).toBe(3);

    vi.setSystemTime(new Date('2026-04-05T12:00:00Z')); // skip Apr 4
    const broken = storage.updateStreak();
    expect(broken.currentStreak).toBe(1);
    expect(broken.bestStreak).toBe(3);
    expect(broken.streakStartDate).toBe('2026-04-05');
    expect(broken.lastPlayDate).toBe('2026-04-05');
  });

  it('second streak can surpass prior best', () => {
    // first run length 2
    vi.setSystemTime(new Date('2026-07-01T12:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-07-02T12:00:00Z'));
    storage.updateStreak();
    expect(storage.getStreak().bestStreak).toBe(2);

    // break
    vi.setSystemTime(new Date('2026-07-10T12:00:00Z'));
    storage.updateStreak();

    // rebuild to 3
    vi.setSystemTime(new Date('2026-07-11T12:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-07-12T12:00:00Z'));
    const s = storage.updateStreak();
    expect(s.currentStreak).toBe(3);
    expect(s.bestStreak).toBe(3);
  });

  it('getStreak returns a shallow copy (mutating result does not poison store)', () => {
    vi.setSystemTime(new Date('2026-08-01T12:00:00Z'));
    storage.updateStreak();
    const copy = storage.getStreak();
    copy.currentStreak = 999;
    copy.lastPlayDate = 'tampered';
    expect(storage.getStreak().currentStreak).toBe(1);
    expect(storage.getStreak().lastPlayDate).toBe('2026-08-01');
  });
});

describe('Wave 30 storage-streak — recordGameResult coupling', () => {
  it('recording a game result updates the daily streak', () => {
    vi.setSystemTime(new Date('2026-09-10T15:00:00Z'));
    expect(storage.getStreak().currentStreak).toBe(0);
    storage.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 1000,
      moveCount: 4,
      playedAt: Date.now(),
    });
    expect(storage.getStreak().currentStreak).toBe(1);
    expect(storage.getStreak().lastPlayDate).toBe('2026-09-10');
  });

  it('multiple results same day do not double-increment streak', () => {
    vi.setSystemTime(new Date('2026-09-11T10:00:00Z'));
    for (let i = 0; i < 5; i++) {
      storage.recordGameResult({
        gameId: 'calla',
        winner: 'player1',
        playerWon: true,
        duration: 100,
        moveCount: 1,
        playedAt: Date.now(),
      });
    }
    expect(storage.getStreak().currentStreak).toBe(1);
    expect(storage.getGameStats('calla').gamesPlayed).toBe(5);
  });
});
