/**
 * q-mp-307 — Characterize stats-dashboard soft-fail / empty-state residuals
 * (tests only).
 *
 * Structural asserts only — no new player-facing copy pins. Prefer arms not
 * already locked by mutation-ui3 / burn-wave stats suites (empty profile name,
 * best-streak omit, empty role=status, re-render clear, formatLastPlayed catch).
 * No router mock (keeps this suite on unit-shared; navigate wiring stays in
 * isolated stats-dashboard / burn-wave24 suites).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  formatLastPlayed,
  formatWinRate,
  renderStatsDashboardFromSnapshot,
  type StatsDashboardSnapshot,
} from '../../src/ui/stats-dashboard';
import { createDefaultGameStats } from '../../src/core/storage';

function baseSnapshot(
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

function oneGameSnapshot(
  overrides: Partial<StatsDashboardSnapshot> = {}
): StatsDashboardSnapshot {
  const hex = createDefaultGameStats('hex');
  hex.gamesPlayed = 1;
  hex.gamesWon = 0;
  hex.lastPlayed = Date.UTC(2026, 2, 1);
  return baseSnapshot({
    gameStats: { hex },
    totalGamesPlayed: 1,
    ...overrides,
  });
}

describe('q-mp-307 stats-dashboard soft-fail / format residuals', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('formatLastPlayed soft-fails to the em-dash sentinel when locale formatting throws', () => {
    const spy = vi
      .spyOn(Date.prototype, 'toLocaleDateString')
      .mockImplementation(() => {
        throw new RangeError('invalid time value');
      });
    expect(formatLastPlayed(1_700_000_000_000)).toBe(formatLastPlayed(0));
    expect(spy).toHaveBeenCalled();
  });

  it('formatWinRate maps negative infinity and tiny positives through the non-positive / round path', () => {
    expect(formatWinRate(Number.NEGATIVE_INFINITY)).toBe('0%');
    // 0.001 → Math.round(0.1) === 0 → "0%" (finite positive still enters round arm)
    expect(formatWinRate(0.001)).toBe('0%');
    expect(formatWinRate(0.005)).toBe('1%');
  });
});

describe('q-mp-307 stats-dashboard empty-state / summary residuals', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    vi.restoreAllMocks();
  });

  it('empty gameStats uses role=status empty section and omits summary + game list', () => {
    renderStatsDashboardFromSnapshot(container, baseSnapshot());

    const empty = container.querySelector('section.stats-dashboard-empty');
    expect(empty).toBeTruthy();
    expect(empty?.getAttribute('role')).toBe('status');
    expect(container.querySelector('.stats-dashboard-summary')).toBeNull();
    expect(container.querySelector('.stats-dashboard-games')).toBeNull();
    expect(container.querySelector('.stats-game-list')).toBeNull();

    const cta = container.querySelector(
      'button.stats-dashboard-cta[data-action="home"]'
    ) as HTMLButtonElement | null;
    expect(cta).toBeTruthy();
    expect(cta?.type).toBe('button');
  });

  it('omits profile block when profile.name is empty string', () => {
    renderStatsDashboardFromSnapshot(
      container,
      oneGameSnapshot({
        profile: {
          id: 'p-empty',
          name: '',
          avatar: 'owl',
          createdAt: 1,
          lastActiveAt: 2,
        },
      })
    );

    expect(container.querySelector('.stats-dashboard-profile')).toBeNull();
    expect(container.querySelector('.stats-dashboard-summary')).toBeTruthy();
  });

  it('omits best-streak paragraph when bestStreak is 0 on a populated dashboard', () => {
    renderStatsDashboardFromSnapshot(
      container,
      oneGameSnapshot({
        streak: {
          currentStreak: 0,
          bestStreak: 0,
          lastPlayDate: '',
          streakStartDate: '',
        },
      })
    );

    expect(container.querySelector('.stats-dashboard-best-streak')).toBeNull();
    expect(
      container.querySelectorAll('.stats-summary-item').length
    ).toBeGreaterThanOrEqual(4);
  });

  it('adds one summary item when achievements are non-empty', () => {
    renderStatsDashboardFromSnapshot(
      container,
      oneGameSnapshot({ achievements: [] })
    );
    const without = container.querySelectorAll('.stats-summary-item').length;

    renderStatsDashboardFromSnapshot(
      container,
      oneGameSnapshot({
        achievements: [
          { id: 'a1', unlockedAt: 1 },
          { id: 'a2', unlockedAt: 2 },
        ],
      })
    );
    const withAchievements = container.querySelectorAll(
      '.stats-summary-item'
    ).length;

    expect(withAchievements).toBe(without + 1);
    // Value is the count, not achievement ids (structural, not copy).
    const values = [...container.querySelectorAll('.stats-summary-value')].map(
      (el) => el.textContent
    );
    expect(values).toContain('2');
  });

  it('re-render clears prior empty state when a game appears (clearElement soft path)', () => {
    renderStatsDashboardFromSnapshot(container, baseSnapshot());
    expect(container.querySelector('.stats-dashboard-empty')).toBeTruthy();

    renderStatsDashboardFromSnapshot(container, oneGameSnapshot());
    expect(container.querySelector('.stats-dashboard-empty')).toBeNull();
    expect(container.querySelector('.stats-dashboard-summary')).toBeTruthy();
    expect(container.querySelectorAll('.stats-game-card').length).toBe(1);
  });

  it('zero gamesPlayed on a row keeps the card and uses em-dash win-rate cell', () => {
    const orphan = createDefaultGameStats('hex');
    orphan.gamesPlayed = 0;
    orphan.gamesWon = 0;
    orphan.lastPlayed = 0;

    renderStatsDashboardFromSnapshot(
      container,
      baseSnapshot({ gameStats: { hex: orphan }, totalGamesPlayed: 0 })
    );

    // Non-empty gameStats keys still skip the empty section (populated path).
    expect(container.querySelector('.stats-dashboard-empty')).toBeNull();
    expect(container.querySelector('.stats-dashboard-summary')).toBeTruthy();
    const card = container.querySelector(
      '.stats-game-card[data-game-id="hex"]'
    );
    expect(card).toBeTruthy();
    const metrics =
      card?.querySelector('.stats-game-metrics')?.textContent ?? '';
    expect(metrics).toContain('—');
  });
});
