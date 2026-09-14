/**
 * Wave 30 — storage multi-game record stress + aggregate conservation.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage, type GameResult } from '../../src/core/storage';

const GAMES = [
  'hex',
  'calla',
  'fiar',
  'star-track',
  'queens-guards',
  'kings-quadraphages',
] as const;

function result(
  gameId: string,
  kind: 'win' | 'loss' | 'draw',
  duration: number
): GameResult {
  return {
    gameId,
    winner: kind === 'draw' ? 'draw' : kind === 'win' ? 'player1' : 'ai',
    playerWon: kind === 'win',
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

describe('Wave 30 storage-stats-stress — six-game matrix', () => {
  it('records one win per game and aggregates match', () => {
    let expectedTime = 0;
    GAMES.forEach((id, i) => {
      const duration = (i + 1) * 100;
      expectedTime += duration;
      storage.recordGameResult(result(id, 'win', duration));
    });
    expect(storage.getTotalGamesPlayed()).toBe(GAMES.length);
    expect(storage.getTotalPlayTime()).toBe(expectedTime);
    expect(storage.getOverallWinRate()).toBe(1);
    for (const id of GAMES) {
      expect(storage.getGameStats(id).gamesWon).toBe(1);
      expect(storage.getGameStats(id).currentWinStreak).toBe(1);
    }
  });

  it('alternating W/L across games keeps per-game streaks coherent', () => {
    for (const id of GAMES) {
      storage.recordGameResult(result(id, 'win', 10));
      storage.recordGameResult(result(id, 'loss', 10));
      storage.recordGameResult(result(id, 'win', 10));
      const s = storage.getGameStats(id);
      expect(s.gamesPlayed).toBe(3);
      expect(s.gamesWon).toBe(2);
      expect(s.gamesLost).toBe(1);
      expect(s.currentWinStreak).toBe(1);
      expect(s.bestWinStreak).toBe(1);
    }
    expect(storage.getTotalGamesPlayed()).toBe(GAMES.length * 3);
    expect(storage.getOverallWinRate()).toBeCloseTo(2 / 3);
  });

  it('draw-heavy mix still sums play time exactly', () => {
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      const d = 17 * (i + 1);
      sum += d;
      storage.recordGameResult(
        result('hex', i % 3 === 0 ? 'win' : i % 3 === 1 ? 'loss' : 'draw', d)
      );
    }
    expect(storage.getGameStats('hex').totalPlayTime).toBe(sum);
    expect(storage.getTotalPlayTime()).toBe(sum);
    expect(storage.getGameStats('hex').gamesPlayed).toBe(10);
  });
});

describe('Wave 30 storage-stats-stress — getAllGameStats keys', () => {
  it('only lists games that were touched via get or record', () => {
    storage.getGameStats('lazy-only');
    storage.recordGameResult(result('hex', 'win', 1));
    const keys = Object.keys(storage.getAllGameStats()).sort();
    expect(keys).toEqual(['hex', 'lazy-only']);
  });
});
