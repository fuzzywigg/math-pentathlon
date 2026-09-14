/**
 * Wave 36 — storage winner × playerWon × draw outcome matrix leftovers.
 * Beyond wave 30 stats-record winner enum smoke. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage, type GameResult } from '../../src/core/storage';

function play(partial: Partial<GameResult> & Pick<GameResult, 'gameId'>): void {
  storage.recordGameResult({
    winner: partial.winner ?? null,
    playerWon: partial.playerWon ?? false,
    duration: partial.duration ?? 100,
    moveCount: partial.moveCount ?? 1,
    playedAt: partial.playedAt ?? Date.now(),
    ...partial,
  });
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

describe('Wave 36 storage-stats — draw takes precedence over playerWon', () => {
  it('winner=draw with playerWon=true still counts as draw', () => {
    play({ gameId: 'hex', winner: 'draw', playerWon: true });
    const s = storage.getGameStats('hex');
    expect(s.gamesDraw).toBe(1);
    expect(s.gamesWon).toBe(0);
    expect(s.gamesLost).toBe(0);
    expect(s.currentWinStreak).toBe(0);
  });

  it('winner=draw clears an existing win streak', () => {
    play({ gameId: 'hex', winner: 'player1', playerWon: true });
    play({ gameId: 'hex', winner: 'player1', playerWon: true });
    expect(storage.getGameStats('hex').currentWinStreak).toBe(2);
    play({ gameId: 'hex', winner: 'draw', playerWon: false });
    expect(storage.getGameStats('hex').currentWinStreak).toBe(0);
    expect(storage.getGameStats('hex').bestWinStreak).toBe(2);
    expect(storage.getGameStats('hex').gamesDraw).toBe(1);
  });
});

describe('Wave 36 storage-stats — winner labels with playerWon', () => {
  const cases: Array<{
    winner: GameResult['winner'];
    playerWon: boolean;
    expectWon: number;
    expectLost: number;
    expectDraw: number;
  }> = [
    {
      winner: 'player1',
      playerWon: true,
      expectWon: 1,
      expectLost: 0,
      expectDraw: 0,
    },
    {
      winner: 'player2',
      playerWon: true,
      expectWon: 1,
      expectLost: 0,
      expectDraw: 0,
    },
    {
      winner: 'ai',
      playerWon: false,
      expectWon: 0,
      expectLost: 1,
      expectDraw: 0,
    },
    {
      winner: 'player2',
      playerWon: false,
      expectWon: 0,
      expectLost: 1,
      expectDraw: 0,
    },
    {
      winner: null,
      playerWon: false,
      expectWon: 0,
      expectLost: 1,
      expectDraw: 0,
    },
    {
      winner: null,
      playerWon: true,
      expectWon: 1,
      expectLost: 0,
      expectDraw: 0,
    },
    {
      winner: 'draw',
      playerWon: false,
      expectWon: 0,
      expectLost: 0,
      expectDraw: 1,
    },
  ];

  it.each(cases)(
    'winner=$winner playerWon=$playerWon → W$expectWon L$expectLost D$expectDraw',
    ({ winner, playerWon, expectWon, expectLost, expectDraw }) => {
      play({ gameId: 'matrix', winner, playerWon });
      const s = storage.getGameStats('matrix');
      expect(s.gamesWon).toBe(expectWon);
      expect(s.gamesLost).toBe(expectLost);
      expect(s.gamesDraw).toBe(expectDraw);
      expect(s.gamesPlayed).toBe(1);
    }
  );
});

describe('Wave 36 storage-stats — duration and moveCount accounting', () => {
  it('sums durations across mixed outcomes; moveCount is not aggregated', () => {
    play({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 1000,
      moveCount: 10,
    });
    play({
      gameId: 'hex',
      winner: 'draw',
      playerWon: false,
      duration: 250,
      moveCount: 99,
    });
    play({
      gameId: 'hex',
      winner: 'ai',
      playerWon: false,
      duration: 50,
      moveCount: 1,
    });
    const s = storage.getGameStats('hex');
    expect(s.totalPlayTime).toBe(1300);
    expect(s.gamesPlayed).toBe(3);
    // moveCount is accepted on GameResult but not stored on GameStats
    expect((s as { moveCount?: number }).moveCount).toBeUndefined();
  });
});
