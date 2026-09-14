/**
 * Wave 39 — getGamesPlayedByDivision stub stays empty under multi-game mix.
 * Beyond wave 38 single-win note. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';

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

describe('Wave 39 storage — division stub', () => {
  it('stays empty after mixed wins/losses across gameIds', () => {
    for (const [gameId, playerWon] of [
      ['contig-60', true],
      ['sum-dominoes', false],
      ['juggle', true],
      ['hex', false],
    ] as const) {
      storage.recordGameResult({
        gameId,
        winner: playerWon ? 'p1' : 'ai',
        playerWon,
        duration: 300,
        moveCount: 5,
        playedAt: Date.now(),
      });
    }
    expect(storage.getTotalGamesPlayed()).toBe(4);
    expect(storage.getGamesPlayedByDivision()).toEqual({});
    expect(storage.getOverallWinRate()).toBe(0.5);
  });
});
