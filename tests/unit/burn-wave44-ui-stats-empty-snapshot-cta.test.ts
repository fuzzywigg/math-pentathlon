/**
 * Wave 44 overnight HEAVY — stats empty snapshot CTA / navigate.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderStatsDashboardFromSnapshot } from '../../src/ui/stats-dashboard';
import type { StatsDashboardSnapshot } from '../../src/ui/stats-dashboard';
import * as router from '../../src/core/router';

describe('Wave 44 UI — stats empty CTA', () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });
  afterEach(() => {
    container.remove();
    vi.restoreAllMocks();
  });

  it('renders empty state and home CTA navigates', () => {
    const nav = vi.spyOn(router, 'navigate').mockImplementation(() => undefined);
    const snap: StatsDashboardSnapshot = {
      gameStats: {},
      streak: { currentStreak: 0, bestStreak: 0, lastPlayDate: '', streakStartDate: '' },
      totalGamesPlayed: 0,
      totalPlayTime: 0,
      overallWinRate: 0,
      profile: null,
      achievements: [],
    };
    renderStatsDashboardFromSnapshot(container, snap);
    expect(container.querySelector('.stats-dashboard-empty')).toBeTruthy();
    expect(container.querySelector('.stats-dashboard-summary')).toBeNull();
    (container.querySelector('[data-action="home"]') as HTMLButtonElement).click();
    expect(nav).toHaveBeenCalledWith('/');
    (container.querySelector('#back-btn') as HTMLButtonElement).click();
    expect(nav).toHaveBeenCalledTimes(2);
  });
});
