/**
 * Wave 30 — per-game win streak best/current interactions via recordGameResult.
 * Distinct from calendar streak (updateStreak) covered in streak-calendar.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage, type GameResult } from '../../src/core/storage';

function play(
  gameId: string,
  kind: 'win' | 'loss' | 'draw',
  duration = 100
): GameResult {
  if (kind === 'win') {
    return {
      gameId,
      winner: 'player1',
      playerWon: true,
      duration,
      moveCount: 3,
      playedAt: Date.now(),
    };
  }
  if (kind === 'draw') {
    return {
      gameId,
      winner: 'draw',
      playerWon: false,
      duration,
      moveCount: 3,
      playedAt: Date.now(),
    };
  }
  return {
    gameId,
    winner: 'ai',
    playerWon: false,
    duration,
    moveCount: 3,
    playedAt: Date.now(),
  };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-14T12:00:00Z'));
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 30 storage-streak-win — best tracks peak', () => {
  it('WWW then L preserves bestWinStreak=3 with current=0', () => {
    storage.recordGameResult(play('hex', 'win'));
    storage.recordGameResult(play('hex', 'win'));
    storage.recordGameResult(play('hex', 'win'));
    expect(storage.getGameStats('hex').bestWinStreak).toBe(3);
    storage.recordGameResult(play('hex', 'loss'));
    const s = storage.getGameStats('hex');
    expect(s.currentWinStreak).toBe(0);
    expect(s.bestWinStreak).toBe(3);
  });

  it('W L WWW raises best from 1 to 3', () => {
    storage.recordGameResult(play('calla', 'win'));
    storage.recordGameResult(play('calla', 'loss'));
    expect(storage.getGameStats('calla').bestWinStreak).toBe(1);
    storage.recordGameResult(play('calla', 'win'));
    storage.recordGameResult(play('calla', 'win'));
    storage.recordGameResult(play('calla', 'win'));
    const s = storage.getGameStats('calla');
    expect(s.currentWinStreak).toBe(3);
    expect(s.bestWinStreak).toBe(3);
  });

  it('draw mid-streak resets current but keeps best', () => {
    storage.recordGameResult(play('fiar', 'win'));
    storage.recordGameResult(play('fiar', 'win'));
    storage.recordGameResult(play('fiar', 'draw'));
    const s = storage.getGameStats('fiar');
    expect(s.currentWinStreak).toBe(0);
    expect(s.bestWinStreak).toBe(2);
    expect(s.gamesDraw).toBe(1);
  });
});

describe('Wave 30 storage-streak-win — per-game independence', () => {
  it('hex streak does not affect calla streak', () => {
    storage.recordGameResult(play('hex', 'win'));
    storage.recordGameResult(play('hex', 'win'));
    storage.recordGameResult(play('calla', 'win'));
    expect(storage.getGameStats('hex').currentWinStreak).toBe(2);
    expect(storage.getGameStats('calla').currentWinStreak).toBe(1);
    storage.recordGameResult(play('hex', 'loss'));
    expect(storage.getGameStats('hex').currentWinStreak).toBe(0);
    expect(storage.getGameStats('calla').currentWinStreak).toBe(1);
    expect(storage.getGameStats('calla').bestWinStreak).toBe(1);
  });

  it('long unbroken win run updates best every step', () => {
    for (let i = 1; i <= 7; i++) {
      storage.recordGameResult(play('star-track', 'win'));
      const s = storage.getGameStats('star-track');
      expect(s.currentWinStreak).toBe(i);
      expect(s.bestWinStreak).toBe(i);
    }
  });
});

describe('Wave 30 storage-streak-win — return value equals getGameStats', () => {
  it('recordGameResult return matches subsequent getGameStats snapshot', () => {
    const returned = storage.recordGameResult(play('queens', 'win', 999));
    const fetched = storage.getGameStats('queens');
    expect(fetched).toEqual(returned);
    expect(fetched.totalPlayTime).toBe(999);
  });
});
