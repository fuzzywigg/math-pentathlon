/**
 * Wave 44 overnight HEAVY — stats empty CTA × selector remount handshake.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderStatsDashboardFromSnapshot } from '../../src/ui/stats-dashboard';
import { renderGameSelector } from '../../src/ui/game-selector';
import type { StatsDashboardSnapshot } from '../../src/ui/stats-dashboard';
import * as router from '../../src/core/router';

describe('Wave 44 handshake — stats × selector', () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    Element.prototype.scrollIntoView = vi.fn();
  });
  afterEach(() => {
    container.remove();
    vi.restoreAllMocks();
  });

  it('empty stats home then selector renders', () => {
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
    (container.querySelector('[data-action="home"]') as HTMLButtonElement).click();
    expect(nav).toHaveBeenCalledWith('/');
    renderGameSelector(container);
    expect(container.querySelector('.game-selector')).toBeTruthy();
  });
});
