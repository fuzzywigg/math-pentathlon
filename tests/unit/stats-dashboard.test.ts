import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  formatPlayTime,
  formatWinRate,
  renderStatsDashboardFromSnapshot,
  type StatsDashboardSnapshot,
} from '../../src/ui/stats-dashboard';
import { renderGameSelector } from '../../src/ui/game-selector';
import { createDefaultGameStats } from '../../src/core/storage';

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

describe('stats dashboard helpers', () => {
  it('formats play time', () => {
    expect(formatPlayTime(0)).toBe('0 min');
    expect(formatPlayTime(45_000)).toBe('0 min');
    expect(formatPlayTime(5 * 60_000)).toBe('5 min');
    expect(formatPlayTime(90 * 60_000)).toBe('1h 30m');
    expect(formatPlayTime(120 * 60_000)).toBe('2h');
  });

  it('formats win rate', () => {
    expect(formatWinRate(0)).toBe('0%');
    expect(formatWinRate(0.5)).toBe('50%');
    expect(formatWinRate(0.756)).toBe('76%');
  });
});

describe('stats dashboard view', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    vi.mocked(navigate).mockClear();
  });

  afterEach(() => {
    container.remove();
  });

  it('shows an honest empty state when gameStats is empty', () => {
    renderStatsDashboardFromSnapshot(container, emptySnapshot());

    expect(container.querySelector('.stats-dashboard-empty')).toBeTruthy();
    expect(container.textContent).toContain('No recorded games yet');
    expect(container.querySelector('.stats-dashboard-summary')).toBeNull();
    expect(container.querySelector('.stats-game-list')).toBeNull();
  });

  it('renders summary and per-game rows from existing stats', () => {
    const hex = createDefaultGameStats('hex');
    hex.gamesPlayed = 4;
    hex.gamesWon = 2;
    hex.gamesLost = 1;
    hex.gamesDraw = 1;
    hex.totalPlayTime = 12 * 60_000;
    hex.currentWinStreak = 1;
    hex.bestWinStreak = 2;
    hex.lastPlayed = Date.UTC(2026, 8, 1);

    const calla = createDefaultGameStats('calla');
    calla.gamesPlayed = 1;
    calla.gamesWon = 1;
    calla.totalPlayTime = 3 * 60_000;
    calla.lastPlayed = Date.UTC(2026, 8, 9);

    renderStatsDashboardFromSnapshot(
      container,
      emptySnapshot({
        gameStats: { hex, calla },
        streak: {
          currentStreak: 3,
          bestStreak: 5,
          lastPlayDate: '2026-09-09',
          streakStartDate: '2026-09-07',
        },
        totalGamesPlayed: 5,
        totalPlayTime: 15 * 60_000,
        overallWinRate: 0.6,
        profile: {
          id: 'p1',
          name: 'Ada',
          avatar: 'owl',
          createdAt: 1,
          lastActiveAt: 2,
        },
        achievements: [{ id: 'first-win', unlockedAt: 1 }],
      })
    );

    expect(container.querySelector('.stats-dashboard-empty')).toBeNull();
    expect(container.textContent).toContain('Playing as');
    expect(container.textContent).toContain('Ada');
    expect(container.textContent).toContain('Day streak');
    expect(container.textContent).toContain('3');
    expect(container.textContent).toContain('60%');
    expect(container.textContent).toContain('Achievements');
    expect(container.textContent).toContain('Hex');
    expect(container.textContent).toContain('Calla');
    expect(container.querySelectorAll('.stats-game-card').length).toBe(2);
  });

  it('navigates home from the back button', () => {
    renderStatsDashboardFromSnapshot(container, emptySnapshot());
    const back = container.querySelector('#back-btn') as HTMLButtonElement;
    back.click();
    expect(navigate).toHaveBeenCalledWith('/');
  });

  it('navigates home from the empty-state CTA', () => {
    renderStatsDashboardFromSnapshot(container, emptySnapshot());
    const cta = container.querySelector(
      '[data-action="home"]'
    ) as HTMLButtonElement;
    cta.click();
    expect(navigate).toHaveBeenCalledWith('/');
  });
});

describe('home entry to stats dashboard', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    Element.prototype.scrollIntoView = vi.fn();
    vi.mocked(navigate).mockClear();
  });

  afterEach(() => {
    container.remove();
  });

  it('exposes a Your Progress link that routes to /stats', () => {
    renderGameSelector(container);

    const link = container.querySelector(
      '.hero-progress-link'
    ) as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('#/stats');
    expect(link.textContent).toContain('Your Progress');

    link.click();
    expect(navigate).toHaveBeenCalledWith('/stats');
  });
});
