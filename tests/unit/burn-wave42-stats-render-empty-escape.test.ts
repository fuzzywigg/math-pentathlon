/**
 * Wave 42 — stats empty render + HTML escape leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  renderStatsDashboardFromSnapshot,
  type StatsDashboardSnapshot,
} from '../../src/ui/stats-dashboard';
import { createDefaultGameStats } from '../../src/core/storage';

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
}));

import { navigate } from '../../src/core/router';

function snap(
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

describe('Wave 42 stats — render empty escape', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
    vi.mocked(navigate).mockClear();
  });

  afterEach(() => {
    root.remove();
  });

  it('empty snapshot still renders header and back button', () => {
    renderStatsDashboardFromSnapshot(root, snap());
    expect(root.querySelector('#back-btn')).toBeTruthy();
    expect(root.textContent).toMatch(/Progress|Games/i);
  });

  it('back button navigates home', () => {
    renderStatsDashboardFromSnapshot(root, snap());
    (root.querySelector('#back-btn') as HTMLElement).click();
    expect(navigate).toHaveBeenCalledWith('/');
  });

  it('escapes profile name HTML in summary when stats present', () => {
    const stats = createDefaultGameStats('hex');
    stats.gamesPlayed = 1;
    stats.lastPlayed = Date.now();
    renderStatsDashboardFromSnapshot(
      root,
      snap({
        profile: {
          id: 'p',
          name: '<script>x</script>',
          avatar: 'star',
          createdAt: 1,
          lastActiveAt: 1,
        },
        gameStats: { hex: stats },
        totalGamesPlayed: 1,
      })
    );
    expect(root.innerHTML).not.toContain('<script>x</script>');
    expect(root.innerHTML).toMatch(/&lt;script&gt;|&amp;lt;script/);
  });

  it('non-empty list shows game row', () => {
    const stats = createDefaultGameStats('hex');
    stats.gamesPlayed = 2;
    stats.lastPlayed = Date.now();
    renderStatsDashboardFromSnapshot(
      root,
      snap({ gameStats: { hex: stats }, totalGamesPlayed: 2 })
    );
    expect(root.querySelector('.stats-dashboard')).toBeTruthy();
    expect(root.textContent?.length).toBeGreaterThan(10);
  });
});
