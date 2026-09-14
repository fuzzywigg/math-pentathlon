/**
 * Wave 36 — storage multi-game aggregate stress leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';

const GAMES = [
  'hex',
  'calla',
  'frac-fact',
  'fraction-pinball',
  'ramrod',
  'stars-bars',
  'sum-dominoes',
  'prime-gold',
];

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-14T08:00:00Z'));
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 36 storage-aggregates — multi-game montage', () => {
  it('sums play counts and durations across catalog', () => {
    let expectedPlayed = 0;
    let expectedTime = 0;
    let wins = 0;

    GAMES.forEach((gameId, gi) => {
      for (let i = 0; i < gi + 1; i++) {
        const playerWon = i % 2 === 0;
        const duration = 1000 + gi * 100 + i;
        storage.recordGameResult({
          gameId,
          winner: playerWon ? 'player1' : 'ai',
          playerWon,
          duration,
          moveCount: i + 1,
          playedAt: Date.now(),
        });
        expectedPlayed++;
        expectedTime += duration;
        if (playerWon) wins++;
      }
    });

    expect(storage.getTotalGamesPlayed()).toBe(expectedPlayed);
    expect(storage.getTotalPlayTime()).toBe(expectedTime);
    expect(storage.getOverallWinRate()).toBeCloseTo(wins / expectedPlayed);
    expect(Object.keys(storage.getAllGameStats()).sort()).toEqual(
      [...GAMES].sort()
    );
    expect(storage.getGamesPlayedByDivision()).toEqual({});
  });

  it('empty stats yield zero aggregates and zero win rate', () => {
    expect(storage.getTotalGamesPlayed()).toBe(0);
    expect(storage.getTotalPlayTime()).toBe(0);
    expect(storage.getOverallWinRate()).toBe(0);
  });
});
