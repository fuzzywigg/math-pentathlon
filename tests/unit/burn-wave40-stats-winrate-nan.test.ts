/**
 * Wave 40 — formatWinRate NaN/Infinity + unknown gameId fallback.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  formatWinRate,
  formatPlayTime,
  renderStatsDashboardFromSnapshot,
  type StatsDashboardSnapshot,
} from '../../src/ui/stats-dashboard';
import { createDefaultGameStats } from '../../src/core/storage';

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
}));

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

describe('Wave 40 stats — winRate NaN / unknown gameId', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('formatWinRate NaN/Infinity → 0%', () => {
    expect(formatWinRate(Number.NaN)).toBe('0%');
    expect(formatWinRate(Number.POSITIVE_INFINITY)).toBe('0%');
    expect(formatWinRate(Number.NEGATIVE_INFINITY)).toBe('0%');
  });

  it('formatPlayTime zero stays 0 min', () => {
    expect(formatPlayTime(0)).toBe('0 min');
  });

  it('renderStatsDashboardFromSnapshot unknown gameId fallback', () => {
    const mystery = createDefaultGameStats('wave40-unknown-game');
    mystery.gamesPlayed = 1;
    mystery.gamesWon = 0;
    mystery.lastPlayed = Date.UTC(2026, 8, 1);

    renderStatsDashboardFromSnapshot(
      container,
      emptySnapshot({
        gameStats: { 'wave40-unknown-game': mystery },
        totalGamesPlayed: 1,
      })
    );

    expect(container.textContent).toContain('wave40-unknown-game');
    expect(
      container.querySelector('.stats-game-card')?.getAttribute('data-game-id')
    ).toBe('wave40-unknown-game');
    expect(container.textContent).toContain('🎮');
  });
});
