/**
 * Wave 30 — storage recordGameResult win/loss/draw matrix across games.
 * Deepens wave 23 single-game smoke into multi-game streak and tally tables.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage, type GameResult } from '../../src/core/storage';
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

function result(
  partial: Partial<GameResult> & Pick<GameResult, 'gameId' | 'playerWon'>
): GameResult {
  return {
    winner: partial.winner ?? (partial.playerWon ? 'player1' : 'ai'),
    duration: partial.duration ?? 1000,
    moveCount: partial.moveCount ?? 5,
    playedAt: partial.playedAt ?? Date.now(),
    ...partial,
  };
}

describe('Wave 30 storage-results — win streak ladders', () => {
  it('bestWinStreak tracks peak even after a loss resets current', () => {
    const gameId = 'fiar';
    for (let i = 0; i < 4; i++) {
      storage.recordGameResult(result({ gameId, playerWon: true }));
    }
    let stats = storage.getGameStats(gameId);
    expect(stats.gamesWon).toBe(4);
    expect(stats.currentWinStreak).toBe(4);
    expect(stats.bestWinStreak).toBe(4);

    storage.recordGameResult(result({ gameId, playerWon: false }));
    stats = storage.getGameStats(gameId);
    expect(stats.gamesLost).toBe(1);
    expect(stats.currentWinStreak).toBe(0);
    expect(stats.bestWinStreak).toBe(4);

    for (let i = 0; i < 2; i++) {
      storage.recordGameResult(result({ gameId, playerWon: true }));
    }
    stats = storage.getGameStats(gameId);
    expect(stats.currentWinStreak).toBe(2);
    expect(stats.bestWinStreak).toBe(4);
  });

  it('draw zeroes current streak without changing best', () => {
    const gameId = 'hex';
    storage.recordGameResult(result({ gameId, playerWon: true }));
    storage.recordGameResult(result({ gameId, playerWon: true }));
    storage.recordGameResult(
      result({ gameId, playerWon: false, winner: 'draw' })
    );
    const stats = storage.getGameStats(gameId);
    expect(stats.gamesDraw).toBe(1);
    expect(stats.currentWinStreak).toBe(0);
    expect(stats.bestWinStreak).toBe(2);
    expect(stats.gamesWon).toBe(2);
  });
});

describe('Wave 30 storage-results — multi-game isolation', () => {
  const GAMES = ['hex', 'calla', 'fiar', 'prime-gold', 'contig-60'] as const;

  it('tallies stay isolated per gameId', () => {
    for (const gameId of GAMES) {
      storage.recordGameResult(
        result({ gameId, playerWon: true, duration: 100 })
      );
      storage.recordGameResult(
        result({ gameId, playerWon: false, duration: 200 })
      );
    }
    for (const gameId of GAMES) {
      const s = storage.getGameStats(gameId);
      expect(s.gamesPlayed).toBe(2);
      expect(s.gamesWon).toBe(1);
      expect(s.gamesLost).toBe(1);
      expect(s.totalPlayTime).toBe(300);
    }
    expect(storage.getTotalGamesPlayed()).toBe(GAMES.length * 2);
    expect(storage.getTotalPlayTime()).toBe(GAMES.length * 300);
  });

  it('getAllGameStats is a shallow copy of the map', () => {
    storage.recordGameResult(result({ gameId: 'hex', playerWon: true }));
    const all = storage.getAllGameStats();
    delete all.hex;
    expect(storage.getAllGameStats().hex).toBeDefined();
    expect(storage.getAllGameStats().hex.gamesPlayed).toBe(1);
  });
});

describe('Wave 30 storage-results — duration / lastPlayed accumulation', () => {
  it('sums durations and updates lastPlayed monotonically', () => {
    vi.setSystemTime(new Date('2026-09-14T01:00:00Z'));
    storage.recordGameResult(
      result({
        gameId: 'juggle',
        playerWon: true,
        duration: 1500,
        playedAt: Date.now(),
      })
    );
    const t1 = storage.getGameStats('juggle').lastPlayed;

    vi.setSystemTime(new Date('2026-09-14T02:00:00Z'));
    storage.recordGameResult(
      result({
        gameId: 'juggle',
        playerWon: false,
        duration: 2500,
        playedAt: Date.now(),
      })
    );
    const stats = storage.getGameStats('juggle');
    expect(stats.totalPlayTime).toBe(4000);
    expect(stats.lastPlayed).toBeGreaterThan(t1);
    expect(stats.lastPlayed).toBe(Date.now());
  });

  it('lazy getGameStats creates zeroed row without counting as played', () => {
    const fresh = storage.getGameStats('never-played');
    expect(fresh.gamesPlayed).toBe(0);
    expect(fresh.gamesWon).toBe(0);
    expect(storage.getTotalGamesPlayed()).toBe(0);
    expect(storage.getOverallWinRate()).toBe(0);
  });
});

describe('Wave 30 storage-results — winner enum variants', () => {
  const cases: Array<{
    label: string;
    winner: GameResult['winner'];
    playerWon: boolean;
    expectWon: number;
    expectLost: number;
    expectDraw: number;
  }> = [
    {
      label: 'player1 win',
      winner: 'player1',
      playerWon: true,
      expectWon: 1,
      expectLost: 0,
      expectDraw: 0,
    },
    {
      label: 'player2 as player win',
      winner: 'player2',
      playerWon: true,
      expectWon: 1,
      expectLost: 0,
      expectDraw: 0,
    },
    {
      label: 'ai loss',
      winner: 'ai',
      playerWon: false,
      expectWon: 0,
      expectLost: 1,
      expectDraw: 0,
    },
    {
      label: 'draw',
      winner: 'draw',
      playerWon: false,
      expectWon: 0,
      expectLost: 0,
      expectDraw: 1,
    },
    {
      label: 'null winner loss',
      winner: null,
      playerWon: false,
      expectWon: 0,
      expectLost: 1,
      expectDraw: 0,
    },
  ];

  it.each(cases)(
    '$label buckets into won/lost/draw correctly',
    ({ winner, playerWon, expectWon, expectLost, expectDraw }) => {
      storage.resetAll();
      storage.recordGameResult(
        result({ gameId: 'variant', winner, playerWon })
      );
      const s = storage.getGameStats('variant');
      expect(s.gamesWon).toBe(expectWon);
      expect(s.gamesLost).toBe(expectLost);
      expect(s.gamesDraw).toBe(expectDraw);
      expect(s.gamesPlayed).toBe(1);
    }
  );
});

describe('Wave 30 storage-results — overall win rate table', () => {
  it('computes wins/played across mixed games', () => {
    // 3 wins, 1 loss, 1 draw → rate 3/5
    storage.recordGameResult(result({ gameId: 'a', playerWon: true }));
    storage.recordGameResult(result({ gameId: 'a', playerWon: true }));
    storage.recordGameResult(result({ gameId: 'b', playerWon: true }));
    storage.recordGameResult(result({ gameId: 'b', playerWon: false }));
    storage.recordGameResult(
      result({ gameId: 'c', playerWon: false, winner: 'draw' })
    );
    expect(storage.getTotalGamesPlayed()).toBe(5);
    expect(storage.getOverallWinRate()).toBeCloseTo(0.6);
  });

  it('getGamesPlayedByDivision remains empty stub', () => {
    storage.recordGameResult(result({ gameId: 'hex', playerWon: true }));
    expect(storage.getGamesPlayedByDivision()).toEqual({});
  });
});
