/**
 * Wave 39 — storage draw clears win streak leftovers after #172/#173.
 * Beyond wave38 win/loss. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage, type GameResult } from '../../src/core/storage';

function result(
  partial: Partial<GameResult> & Pick<GameResult, 'gameId'>
): GameResult {
  return {
    winner: partial.winner ?? null,
    playerWon: partial.playerWon ?? false,
    duration: partial.duration ?? 100,
    moveCount: partial.moveCount ?? 1,
    playedAt: partial.playedAt ?? Date.now(),
    ...partial,
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

describe('Wave 39 storage — draw clears win streak', () => {
  it('wins build streak; draw increments gamesDraw and zeros current', () => {
    storage.recordGameResult(
      result({ gameId: 'contig-60', playerWon: true, winner: 'player1' })
    );
    storage.recordGameResult(
      result({ gameId: 'contig-60', playerWon: true, winner: 'player1' })
    );
    let stats = storage.getGameStats('contig-60');
    expect(stats.currentWinStreak).toBe(2);
    expect(stats.bestWinStreak).toBe(2);

    stats = storage.recordGameResult(
      result({ gameId: 'contig-60', winner: 'draw', playerWon: false })
    );
    expect(stats.gamesDraw).toBe(1);
    expect(stats.currentWinStreak).toBe(0);
    expect(stats.bestWinStreak).toBe(2);
  });
});
