/**
 * Wave 30 — storage aggregate totals / win rate / division stub.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage, type GameResult } from '../../src/core/storage';

function play(
  gameId: string,
  opts: { won?: boolean; draw?: boolean; duration?: number } = {}
): GameResult {
  const draw = opts.draw === true;
  const won = opts.won === true;
  return {
    gameId,
    winner: draw ? 'draw' : won ? 'player1' : 'ai',
    playerWon: won,
    duration: opts.duration ?? 1000,
    moveCount: 5,
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

describe('Wave 30 storage-aggregates — empty baseline', () => {
  it('totals are zero and win rate is 0 with no plays', () => {
    expect(storage.getTotalGamesPlayed()).toBe(0);
    expect(storage.getTotalPlayTime()).toBe(0);
    expect(storage.getOverallWinRate()).toBe(0);
    expect(storage.getGamesPlayedByDivision()).toEqual({});
  });

  it('lazy getGameStats alone does not change totals', () => {
    storage.getGameStats('hex');
    storage.getGameStats('calla');
    expect(storage.getTotalGamesPlayed()).toBe(0);
    expect(storage.getOverallWinRate()).toBe(0);
  });
});

describe('Wave 30 storage-aggregates — cross-game sums', () => {
  it('sums played and play time across games', () => {
    storage.recordGameResult(play('hex', { won: true, duration: 100 }));
    storage.recordGameResult(play('hex', { won: false, duration: 200 }));
    storage.recordGameResult(play('calla', { won: true, duration: 50 }));
    storage.recordGameResult(play('fiar', { draw: true, duration: 25 }));
    expect(storage.getTotalGamesPlayed()).toBe(4);
    expect(storage.getTotalPlayTime()).toBe(375);
  });

  it('overall win rate is wins / played across all games', () => {
    storage.recordGameResult(play('hex', { won: true }));
    storage.recordGameResult(play('hex', { won: true }));
    storage.recordGameResult(play('calla', { won: false }));
    storage.recordGameResult(play('calla', { draw: true }));
    // 2 wins out of 4 plays
    expect(storage.getOverallWinRate()).toBeCloseTo(0.5);
  });

  it('perfect win rate is 1 when every recorded game is a win', () => {
    storage.recordGameResult(play('hex', { won: true }));
    storage.recordGameResult(play('calla', { won: true }));
    expect(storage.getOverallWinRate()).toBe(1);
  });

  it('zero wins with plays yields win rate 0', () => {
    storage.recordGameResult(play('hex', { won: false }));
    storage.recordGameResult(play('hex', { draw: true }));
    expect(storage.getOverallWinRate()).toBe(0);
    expect(storage.getTotalGamesPlayed()).toBe(2);
  });
});

describe('Wave 30 storage-aggregates — division stub', () => {
  it('getGamesPlayedByDivision remains empty object (simplified stub)', () => {
    storage.recordGameResult(play('hex', { won: true }));
    storage.recordGameResult(play('calla', { won: true }));
    expect(storage.getGamesPlayedByDivision()).toEqual({});
  });
});
