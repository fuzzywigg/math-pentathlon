/**
 * Wave 39 — recordGameResult winner:null + playerWon:false loss contract.
 * Tests-only.
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

describe('Wave 39 storage — null winner loss', () => {
  it('counts loss without draw inflation for dice/expr gameIds', () => {
    for (const gameId of ['dice-demo', 'expression-demo']) {
      storage.recordGameResult({
        gameId,
        winner: null,
        playerWon: false,
        duration: 250,
        moveCount: 3,
        playedAt: Date.now(),
      });
      const stats = storage.getGameStats(gameId);
      expect(stats.gamesLost).toBe(1);
      expect(stats.gamesDraw).toBe(0);
      expect(stats.gamesWon).toBe(0);
    }
    expect(storage.getOverallWinRate()).toBe(0);
    expect(storage.getTotalPlayTime()).toBe(500);
  });
});
