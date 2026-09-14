/**
 * Wave 38 — empty stats winRate / playTime / division stub leftovers.
 * Beyond wave 36 aggregates. Tests-only.
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

describe('Wave 38 storage — zero games', () => {
  it('empty progress reports zero aggregates and zero win rate', () => {
    expect(storage.getTotalGamesPlayed()).toBe(0);
    expect(storage.getTotalPlayTime()).toBe(0);
    expect(storage.getOverallWinRate()).toBe(0);
  });

  it('getGamesPlayedByDivision stub stays empty object even after wins', () => {
    storage.recordGameResult(
      result({
        gameId: 'hex',
        playerWon: true,
        winner: 'player1',
        duration: 1200,
      })
    );
    expect(storage.getTotalGamesPlayed()).toBe(1);
    expect(storage.getOverallWinRate()).toBe(1);
    expect(storage.getGamesPlayedByDivision()).toEqual({});
  });

  it('losses alone keep win rate at 0 with positive play time', () => {
    storage.recordGameResult(
      result({
        gameId: 'fiar',
        playerWon: false,
        winner: 'ai',
        duration: 500,
      })
    );
    expect(storage.getOverallWinRate()).toBe(0);
    expect(storage.getTotalPlayTime()).toBe(500);
  });
});
