/**
 * Wave 36 — storage firstPlayed stability + winner-matrix leftovers.
 * recordGameResult never rewrites firstPlayed after createDefaultGameStats.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage, type GameResult } from '../../src/core/storage';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-01T10:00:00Z'));
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

function result(partial: Partial<GameResult> & Pick<GameResult, 'gameId'>): GameResult {
  return {
    winner: 'player1',
    playerWon: true,
    duration: 1000,
    moveCount: 5,
    playedAt: Date.now(),
    ...partial,
  };
}

describe('Wave 36 storage-stats — firstPlayed frozen after bootstrap', () => {
  it('firstPlayed equals bootstrap clock; lastPlayed advances on later results', () => {
    const stats0 = storage.getGameStats('pinball');
    const first = stats0.firstPlayed;
    expect(first).toBe(Date.now());

    vi.setSystemTime(new Date('2026-09-02T10:00:00Z'));
    storage.recordGameResult(result({ gameId: 'pinball', playedAt: Date.now() }));
    const stats1 = storage.getGameStats('pinball');
    expect(stats1.firstPlayed).toBe(first);
    expect(stats1.lastPlayed).toBe(Date.now());
    expect(stats1.gamesPlayed).toBe(1);
  });
});

describe('Wave 36 storage-stats — winner / playerWon matrix', () => {
  const cases: Array<{
    name: string;
    winner: GameResult['winner'];
    playerWon: boolean;
    expect: { won: number; lost: number; draw: number; streak: number };
  }> = [
    {
      name: 'player1 win',
      winner: 'player1',
      playerWon: true,
      expect: { won: 1, lost: 0, draw: 0, streak: 1 },
    },
    {
      name: 'player2 as player win',
      winner: 'player2',
      playerWon: true,
      expect: { won: 1, lost: 0, draw: 0, streak: 1 },
    },
    {
      name: 'ai loss',
      winner: 'ai',
      playerWon: false,
      expect: { won: 0, lost: 1, draw: 0, streak: 0 },
    },
    {
      name: 'draw resets streak',
      winner: 'draw',
      playerWon: false,
      expect: { won: 0, lost: 0, draw: 1, streak: 0 },
    },
    {
      name: 'null winner treated as loss when playerWon false',
      winner: null,
      playerWon: false,
      expect: { won: 0, lost: 1, draw: 0, streak: 0 },
    },
  ];

  it.each(cases)('$name', ({ winner, playerWon, expect: exp }) => {
    storage.resetAll();
    const stats = storage.recordGameResult(
      result({ gameId: 'matrix', winner, playerWon })
    );
    expect(stats.gamesWon).toBe(exp.won);
    expect(stats.gamesLost).toBe(exp.lost);
    expect(stats.gamesDraw).toBe(exp.draw);
    expect(stats.currentWinStreak).toBe(exp.streak);
    expect(stats.gamesPlayed).toBe(1);
  });

  it('draw after win resets currentWinStreak but keeps bestWinStreak', () => {
    storage.recordGameResult(result({ gameId: 'streaky', playerWon: true }));
    storage.recordGameResult(result({ gameId: 'streaky', playerWon: true }));
    expect(storage.getGameStats('streaky').bestWinStreak).toBe(2);
    storage.recordGameResult(
      result({ gameId: 'streaky', winner: 'draw', playerWon: false })
    );
    const s = storage.getGameStats('streaky');
    expect(s.currentWinStreak).toBe(0);
    expect(s.bestWinStreak).toBe(2);
    expect(s.gamesDraw).toBe(1);
    expect(s.gamesWon).toBe(2);
  });
});
