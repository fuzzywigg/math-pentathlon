/**
 * q-mp-1327 — aggregate must not treat unknown winners as draws.
 * Hermetic helper accounting only; no AI search/scoring/timing.
 */
import { describe, it, expect } from 'vitest';
import { aggregate } from '../helpers/ai-calibration/matrix';

describe('ai-calibration aggregate (q-mp-1327)', () => {
  it('does not count timeout/error winners as draws', () => {
    const stats = aggregate([
      { winner: 'timeout', length: 1 },
      { winner: 'error', length: 1 },
      { winner: 'player1', length: 1 },
    ]);
    expect(stats.p1Wins).toBe(1);
    expect(stats.p2Wins).toBe(0);
    expect(stats.draws).toBe(0);
    expect(stats.games).toBe(3);
    expect(stats.drawRate).toBe(0);
    expect(stats.p1WinRate).toBeCloseTo(1 / 3);
  });

  it('still counts explicit draw winners', () => {
    const stats = aggregate([
      { winner: 'draw', length: 2 },
      { winner: 'player2', length: 3 },
      { winner: 'timeout', length: 1 },
    ]);
    expect(stats.draws).toBe(1);
    expect(stats.p2Wins).toBe(1);
    expect(stats.p1Wins).toBe(0);
    expect(stats.drawRate).toBeCloseTo(1 / 3);
    expect(stats.p2WinRate).toBeCloseTo(1 / 3);
    expect(stats.avgLength).toBeCloseTo(2);
  });

  it('returns zero rates for empty results', () => {
    const stats = aggregate([]);
    expect(stats).toEqual({
      games: 0,
      p1Wins: 0,
      p2Wins: 0,
      draws: 0,
      avgLength: 0,
      p1WinRate: 0,
      p2WinRate: 0,
      drawRate: 0,
    });
  });
});
