/**
 * q-mp-429 mutation audit UI wave 14 — kill / re-pin survivors in
 * stats-dashboard formatters + row sort. Structural / numeric asserts only
 * (no player-facing copy body pins). Separate from q-mp-307 characterization.
 */
import { describe, expect, it } from 'vitest';
import {
  formatPlayTime,
  formatWinRate,
  formatLastPlayed,
  renderStatsDashboardFromSnapshot,
  type StatsDashboardSnapshot,
} from '../../src/ui/stats-dashboard';
import { createDefaultGameStats } from '../../src/core/storage';

function snapshotWithGames(
  overrides: Partial<StatsDashboardSnapshot> = {}
): StatsDashboardSnapshot {
  return {
    gameStats: {},
    streak: {
      currentStreak: 0,
      bestStreak: 0,
      lastPlayDate: '',
      streakStartDate: '',
    },
    totalGamesPlayed: 0,
    totalPlayTime: 0,
    overallWinRate: 0,
    profile: null,
    achievements: [],
    ...overrides,
  };
}

describe('mutation-ui14 stats-dashboard', () => {
  it('hours divisor stays 60 (kills L51 60→59 on totalMinutes / 60)', () => {
    // 118 min: floor(118/60)=1 remainder 58 → "1h 58m";
    // floor(118/59)=2 would mis-label as "2h …".
    expect(formatPlayTime(118 * 60_000)).toBe('1h 58m');
    expect(formatPlayTime(177 * 60_000)).toBe('2h 57m');
  });

  it('re-pins minute/hour ladder boundaries already killed at baseline', () => {
    expect(formatPlayTime(59 * 60_000)).toBe('59 min');
    expect(formatPlayTime(60 * 60_000)).toBe('1h');
    expect(formatPlayTime(61 * 60_000)).toBe('1h 1m');
    expect(formatPlayTime(120 * 60_000)).toBe('2h');
  });

  it('re-pins win-rate finite / positive arms', () => {
    expect(formatWinRate(Number.NaN)).toBe('0%');
    expect(formatWinRate(0.5)).toBe('50%');
    // 0→1 on the `rate <= 0` literal is already killed by mid-range rates.
    expect(formatWinRate(0.25)).toBe('25%');
  });

  it('re-pins lastPlayed falsy sentinel without locale copy pins', () => {
    expect(formatLastPlayed(0)).toBe('—');
    const stamped = formatLastPlayed(Date.UTC(2026, 5, 1));
    expect(stamped).not.toBe('—');
    expect(stamped.length).toBeGreaterThan(0);
  });

  it('sorts game cards by descending lastPlayed (kills L90 - → +)', () => {
    const older = createDefaultGameStats('older-game');
    older.gamesPlayed = 1;
    older.lastPlayed = 1_000;
    const newer = createDefaultGameStats('newer-game');
    newer.gamesPlayed = 1;
    newer.lastPlayed = 2_000;

    const container = document.createElement('div');
    renderStatsDashboardFromSnapshot(
      container,
      snapshotWithGames({
        gameStats: { older: older, newer: newer },
        totalGamesPlayed: 2,
      })
    );

    const ids = [...container.querySelectorAll('.stats-game-card')].map(
      (el) => (el as HTMLElement).dataset.gameId
    );
    expect(ids).toEqual(['newer-game', 'older-game']);
  });

  // Equivalent under the public formatter: ms=0 / tiny positives both yield
  // "0 min"; rate===0 still formats as "0%" via Math.round.
  it.skip('pinned equivalent: formatPlayTime ms <= 0 → < and 0→1 (L42)', () => {
    expect(true).toBe(true);
  });

  it.skip('pinned equivalent: formatWinRate rate <= 0 → < (L60)', () => {
    expect(true).toBe(true);
  });
});
