/**
 * Wave 38 — storage streak / win-loss / draw leftovers after #171.
 * Distinct from wave 36 streak boundaries. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-10T12:00:00Z'));
  localStorage.clear();
  storage.resetAll();
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

function play(
  gameId: string,
  opts: { won?: boolean; draw?: boolean; duration?: number } = {}
) {
  const draw = opts.draw === true;
  return storage.recordGameResult({
    gameId,
    winner: draw ? 'draw' : opts.won ? 'player1' : 'ai',
    playerWon: draw ? false : !!opts.won,
    duration: opts.duration ?? 1000,
    moveCount: 5,
    playedAt: Date.now(),
  });
}

describe('Wave 38 storage-streak — calendar continuation / break', () => {
  it('same-day plays do not inflate streak', () => {
    play('contig-60', { won: true });
    expect(storage.getStreak().currentStreak).toBe(1);
    play('sum-dominoes', { won: true });
    expect(storage.getStreak().currentStreak).toBe(1);
    expect(storage.getStreak().lastPlayDate).toBe('2026-09-10');
  });

  it('next-day play continues; gap resets', () => {
    play('juggle', { won: true });
    vi.setSystemTime(new Date('2026-09-11T08:00:00Z'));
    play('juggle', { won: false });
    expect(storage.getStreak().currentStreak).toBe(2);
    expect(storage.getStreak().bestStreak).toBe(2);

    vi.setSystemTime(new Date('2026-09-14T08:00:00Z'));
    play('juggle', { won: true });
    expect(storage.getStreak().currentStreak).toBe(1);
    expect(storage.getStreak().bestStreak).toBe(2);
    expect(storage.getStreak().streakStartDate).toBe('2026-09-14');
  });
});

describe('Wave 38 storage-stats — win/loss/draw streaks per game', () => {
  it('wins build currentWinStreak; loss/draw clear it; best retained', () => {
    play('frac-factory', { won: true });
    play('frac-factory', { won: true });
    play('frac-factory', { won: true });
    let s = storage.getGameStats('frac-factory');
    expect(s.gamesWon).toBe(3);
    expect(s.currentWinStreak).toBe(3);
    expect(s.bestWinStreak).toBe(3);

    play('frac-factory', { won: false });
    s = storage.getGameStats('frac-factory');
    expect(s.gamesLost).toBe(1);
    expect(s.currentWinStreak).toBe(0);
    expect(s.bestWinStreak).toBe(3);

    play('frac-factory', { won: true });
    play('frac-factory', { draw: true });
    s = storage.getGameStats('frac-factory');
    expect(s.gamesDraw).toBe(1);
    expect(s.currentWinStreak).toBe(0);
    expect(s.bestWinStreak).toBe(3);
  });

  it('aggregates total play time and games across titles', () => {
    play('a', { won: true, duration: 2000 });
    play('b', { won: false, duration: 3000 });
    play('a', { draw: true, duration: 1000 });
    expect(storage.getTotalGamesPlayed()).toBe(3);
    expect(storage.getTotalPlayTime()).toBe(6000);
  });
});
