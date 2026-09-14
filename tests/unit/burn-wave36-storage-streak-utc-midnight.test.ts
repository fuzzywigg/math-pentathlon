/**
 * Wave 36 — updateStreak across UTC midnight calendar boundary.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage, type GameResult } from '../../src/core/storage';

function play(at: string): void {
  const playedAt = Date.parse(at);
  const result: GameResult = {
    gameId: 'hex',
    winner: 'player1',
    playerWon: true,
    duration: 100,
    moveCount: 1,
    playedAt,
  };
  vi.setSystemTime(new Date(at));
  storage.recordGameResult(result);
}

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
});

describe('Wave 36 storage-streak-midnight — continue vs break', () => {
  it('continues streak from 23:59Z to next day 00:00Z', () => {
    play('2026-09-14T23:59:59.000Z');
    expect(storage.getStreak().currentStreak).toBe(1);
    play('2026-09-15T00:00:00.000Z');
    expect(storage.getStreak().currentStreak).toBe(2);
    expect(storage.getStreak().lastPlayDate).toBe('2026-09-15');
  });

  it('breaks when a calendar day is skipped', () => {
    play('2026-09-14T23:59:59.000Z');
    play('2026-09-16T00:00:01.000Z');
    expect(storage.getStreak().currentStreak).toBe(1);
    expect(storage.getStreak().streakStartDate).toBe('2026-09-16');
  });

  it('same UTC day does not double-count streak', () => {
    play('2026-09-14T01:00:00.000Z');
    play('2026-09-14T23:00:00.000Z');
    expect(storage.getStreak().currentStreak).toBe(1);
  });
});
