/**
 * Wave 36 — recordGameResult winner × playerWon contradiction matrix.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage, type GameResult } from '../../src/core/storage';

function result(partial: Partial<GameResult> & Pick<GameResult, 'gameId'>): GameResult {
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
});

describe('Wave 36 storage-winner-flags — branch priority', () => {
  it('winner=draw counts draw even if playerWon=true', () => {
    const stats = storage.recordGameResult(
      result({ gameId: 'hex', winner: 'draw', playerWon: true })
    );
    expect(stats.gamesDraw).toBe(1);
    expect(stats.gamesWon).toBe(0);
    expect(stats.currentWinStreak).toBe(0);
  });

  it('playerWon=false + winner=player1 counts loss', () => {
    const stats = storage.recordGameResult(
      result({ gameId: 'hex', winner: 'player1', playerWon: false })
    );
    expect(stats.gamesLost).toBe(1);
    expect(stats.gamesWon).toBe(0);
  });

  it('winner=player2 + playerWon=false is a loss', () => {
    const stats = storage.recordGameResult(
      result({ gameId: 'calla', winner: 'player2', playerWon: false })
    );
    expect(stats.gamesLost).toBe(1);
  });

  it('winner=ai + playerWon=true still counts win (playerWon branch)', () => {
    const stats = storage.recordGameResult(
      result({ gameId: 'hex', winner: 'ai', playerWon: true })
    );
    expect(stats.gamesWon).toBe(1);
    expect(stats.gamesLost).toBe(0);
  });
});
