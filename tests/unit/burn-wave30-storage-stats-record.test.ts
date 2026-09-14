/**
 * Wave 30 — storage recordGameResult win/loss/draw multi-game matrix.
 * Deepens wave23 stats smoke with multi-game isolation + duration accounting.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage, type GameResult } from '../../src/core/storage';

function result(
  partial: Partial<GameResult> & Pick<GameResult, 'gameId' | 'playerWon'>
): GameResult {
  return {
    winner: partial.winner ?? (partial.playerWon ? 'player1' : 'ai'),
    duration: partial.duration ?? 1000,
    moveCount: partial.moveCount ?? 4,
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

describe('Wave 30 storage-stats — win / loss / draw counters', () => {
  it('win increments played/won and stamps lastPlayed', () => {
    const playedAt = Date.parse('2026-09-14T12:00:00Z');
    const stats = storage.recordGameResult(
      result({ gameId: 'hex', playerWon: true, playedAt, duration: 2500 })
    );
    expect(stats.gamesPlayed).toBe(1);
    expect(stats.gamesWon).toBe(1);
    expect(stats.gamesLost).toBe(0);
    expect(stats.gamesDraw).toBe(0);
    expect(stats.totalPlayTime).toBe(2500);
    expect(stats.lastPlayed).toBe(playedAt);
    expect(stats.currentWinStreak).toBe(1);
    expect(stats.bestWinStreak).toBe(1);
  });

  it('loss increments lost and clears currentWinStreak only', () => {
    storage.recordGameResult(result({ gameId: 'hex', playerWon: true }));
    storage.recordGameResult(result({ gameId: 'hex', playerWon: true }));
    const afterLoss = storage.recordGameResult(
      result({ gameId: 'hex', playerWon: false, winner: 'ai', duration: 300 })
    );
    expect(afterLoss.gamesPlayed).toBe(3);
    expect(afterLoss.gamesWon).toBe(2);
    expect(afterLoss.gamesLost).toBe(1);
    expect(afterLoss.currentWinStreak).toBe(0);
    expect(afterLoss.bestWinStreak).toBe(2);
    expect(afterLoss.totalPlayTime).toBe(2300);
  });

  it('draw uses winner=draw path and clears currentWinStreak', () => {
    storage.recordGameResult(result({ gameId: 'calla', playerWon: true }));
    const draw = storage.recordGameResult(
      result({
        gameId: 'calla',
        playerWon: false,
        winner: 'draw',
        duration: 400,
        moveCount: 8,
      })
    );
    expect(draw.gamesDraw).toBe(1);
    expect(draw.gamesLost).toBe(0);
    expect(draw.currentWinStreak).toBe(0);
    expect(draw.bestWinStreak).toBe(1);
  });
});

describe('Wave 30 storage-stats — multi-game isolation', () => {
  it('records for hex and calla do not leak counters', () => {
    storage.recordGameResult(
      result({ gameId: 'hex', playerWon: true, duration: 100 })
    );
    storage.recordGameResult(
      result({ gameId: 'hex', playerWon: false, duration: 200 })
    );
    storage.recordGameResult(
      result({ gameId: 'calla', playerWon: true, duration: 50 })
    );

    const hex = storage.getGameStats('hex');
    const calla = storage.getGameStats('calla');
    expect(hex.gamesPlayed).toBe(2);
    expect(hex.gamesWon).toBe(1);
    expect(hex.gamesLost).toBe(1);
    expect(hex.totalPlayTime).toBe(300);
    expect(calla.gamesPlayed).toBe(1);
    expect(calla.gamesWon).toBe(1);
    expect(calla.totalPlayTime).toBe(50);
  });

  it('getAllGameStats returns a shallow copy of the map', () => {
    storage.recordGameResult(result({ gameId: 'fiar', playerWon: true }));
    const all = storage.getAllGameStats();
    expect(Object.keys(all).sort()).toEqual(['fiar']);
    delete all.fiar;
    expect(Object.keys(storage.getAllGameStats())).toEqual(['fiar']);
  });

  it('lazy getGameStats creates zeroed defaults without counting as play', () => {
    const fresh = storage.getGameStats('prime-gold');
    expect(fresh.gamesPlayed).toBe(0);
    expect(storage.getTotalGamesPlayed()).toBe(0);
    expect(storage.getAllGameStats()['prime-gold']?.gamesPlayed).toBe(0);
  });
});

describe('Wave 30 storage-stats — winner enum matrix', () => {
  it('playerWon=true with winner player2 still counts as win', () => {
    const stats = storage.recordGameResult(
      result({ gameId: 'kwatro', playerWon: true, winner: 'player2' })
    );
    expect(stats.gamesWon).toBe(1);
    expect(stats.gamesLost).toBe(0);
  });

  it('playerWon=false with winner null counts as loss not draw', () => {
    const stats = storage.recordGameResult(
      result({ gameId: 'kwatro', playerWon: false, winner: null })
    );
    expect(stats.gamesLost).toBe(1);
    expect(stats.gamesDraw).toBe(0);
    expect(stats.currentWinStreak).toBe(0);
  });
});
