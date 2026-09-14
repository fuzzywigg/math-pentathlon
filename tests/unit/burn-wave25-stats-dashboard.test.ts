/**
 * Wave 25 — stats-dashboard formatters / sorting / escape / readStatsSnapshot wiring.
 * Deepens beyond stats-dashboard.test.ts empty/summary smoke. Distinct from wave 23 storage writers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  formatPlayTime,
  formatWinRate,
  formatLastPlayed,
  readStatsSnapshot,
  renderStatsDashboard,
  renderStatsDashboardFromSnapshot,
  type StatsDashboardSnapshot,
} from '../../src/ui/stats-dashboard';
import { createDefaultGameStats, storage } from '../../src/core/storage';

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
}));

import { navigate } from '../../src/core/router';

function emptySnapshot(
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

beforeEach(() => {
  localStorage.clear();
  storage.resetAll();
  vi.mocked(navigate).mockClear();
});

afterEach(() => {
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 25 stats-dashboard — formatters', () => {
  it('formatPlayTime covers sub-minute, hour, and mixed edges', () => {
    expect(formatPlayTime(-10)).toBe('0 min');
    expect(formatPlayTime(59_999)).toBe('0 min');
    expect(formatPlayTime(60_000)).toBe('1 min');
    expect(formatPlayTime(61 * 60_000)).toBe('1h 1m');
    expect(formatPlayTime(3 * 60 * 60_000)).toBe('3h');
  });

  it('formatWinRate clamps non-finite and zero', () => {
    expect(formatWinRate(Number.NaN)).toBe('0%');
    expect(formatWinRate(Number.POSITIVE_INFINITY)).toBe('0%');
    expect(formatWinRate(-0.5)).toBe('0%');
    expect(formatWinRate(1)).toBe('100%');
    expect(formatWinRate(0.004)).toBe('0%');
  });

  it('formatLastPlayed returns em-dash for falsy and formats valid timestamps', () => {
    expect(formatLastPlayed(0)).toBe('—');
    const stamp = Date.UTC(2026, 0, 15);
    const formatted = formatLastPlayed(stamp);
    expect(formatted).not.toBe('—');
    expect(formatted.length).toBeGreaterThan(2);
  });
});

describe('Wave 25 stats-dashboard — snapshot render edges', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('escapes hostile profile names in summary HTML', () => {
    renderStatsDashboardFromSnapshot(
      container,
      emptySnapshot({
        gameStats: { hex: createDefaultGameStats('hex') },
        profile: {
          id: 'x',
          name: '<img src=x onerror=alert(1)>',
          avatar: 'owl',
          createdAt: 1,
          lastActiveAt: 2,
        },
        streak: {
          currentStreak: 1,
          bestStreak: 1,
          lastPlayDate: '2026-09-01',
          streakStartDate: '2026-09-01',
        },
      })
    );
    expect(container.innerHTML).not.toContain('<img src=x');
    expect(container.innerHTML).toContain('&lt;img src=x');
  });

  it('sorts game cards by lastPlayed descending and falls back for unknown ids', () => {
    const older = createDefaultGameStats('hex');
    older.gamesPlayed = 2;
    older.gamesWon = 1;
    older.lastPlayed = Date.UTC(2026, 0, 1);

    const newer = createDefaultGameStats('calla');
    newer.gamesPlayed = 3;
    newer.gamesWon = 2;
    newer.lastPlayed = Date.UTC(2026, 5, 1);

    const mystery = createDefaultGameStats('not-a-real-game-id');
    mystery.gamesPlayed = 1;
    mystery.lastPlayed = Date.UTC(2026, 8, 1);

    renderStatsDashboardFromSnapshot(
      container,
      emptySnapshot({
        gameStats: { hex: older, calla: newer, 'not-a-real-game-id': mystery },
        totalGamesPlayed: 6,
        overallWinRate: 0.5,
      })
    );

    const cards = Array.from(container.querySelectorAll('.stats-game-card'));
    expect(cards.map((c) => c.getAttribute('data-game-id'))).toEqual([
      'not-a-real-game-id',
      'calla',
      'hex',
    ]);
    expect(cards[0].textContent).toContain('not-a-real-game-id');
    expect(cards[0].textContent).toContain('🎮');
    expect(cards[1].textContent).toContain('Calla');
  });

  it('shows best streak singular/plural and omits achievements when empty', () => {
    const hex = createDefaultGameStats('hex');
    hex.gamesPlayed = 1;
    hex.lastPlayed = 1;

    renderStatsDashboardFromSnapshot(
      container,
      emptySnapshot({
        gameStats: { hex },
        streak: {
          currentStreak: 1,
          bestStreak: 1,
          lastPlayDate: '2026-09-01',
          streakStartDate: '2026-09-01',
        },
        achievements: [],
      })
    );
    expect(container.textContent).toMatch(/Best streak: 1 day(?!s)/);
    expect(container.textContent).not.toContain('Achievements');

    renderStatsDashboardFromSnapshot(
      container,
      emptySnapshot({
        gameStats: { hex },
        streak: {
          currentStreak: 2,
          bestStreak: 4,
          lastPlayDate: '2026-09-02',
          streakStartDate: '2026-09-01',
        },
        achievements: [
          { id: 'a', unlockedAt: 1 },
          { id: 'b', unlockedAt: 2 },
        ],
      })
    );
    expect(container.textContent).toContain('Best streak: 4 days');
    expect(container.textContent).toContain('Achievements');
    expect(container.textContent).toContain('2');
  });

  it('per-game win rate is — when gamesPlayed is 0', () => {
    const hex = createDefaultGameStats('hex');
    hex.gamesPlayed = 0;
    hex.lastPlayed = Date.UTC(2026, 1, 1);
    renderStatsDashboardFromSnapshot(
      container,
      emptySnapshot({ gameStats: { hex } })
    );
    const winRateDd = Array.from(container.querySelectorAll('dt')).find(
      (dt) => dt.textContent === 'Win rate'
    )?.nextElementSibling;
    expect(winRateDd?.textContent).toBe('—');
  });
});

describe('Wave 25 stats-dashboard — readStatsSnapshot + live render', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('readStatsSnapshot mirrors storage after recordGameResult', () => {
    storage.createProfile('Bo', 'star');
    storage.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 120_000,
      moveCount: 8,
      playedAt: Date.now(),
    });

    const snap = readStatsSnapshot();
    expect(snap.profile?.name).toBe('Bo');
    expect(snap.totalGamesPlayed).toBeGreaterThanOrEqual(1);
    expect(snap.gameStats.hex?.gamesWon).toBeGreaterThanOrEqual(1);
    expect(snap.overallWinRate).toBeGreaterThan(0);
  });

  it('renderStatsDashboard pulls live storage and wires back navigation', () => {
    storage.recordGameResult({
      gameId: 'calla',
      winner: 'player1',
      playerWon: true,
      duration: 60_000,
      moveCount: 4,
      playedAt: Date.now(),
    });

    renderStatsDashboard(container);
    expect(container.querySelector('.stats-dashboard')).toBeTruthy();
    expect(container.textContent).toContain('Calla');
    (container.querySelector('#back-btn') as HTMLButtonElement).click();
    expect(navigate).toHaveBeenCalledWith('/');
  });
});
