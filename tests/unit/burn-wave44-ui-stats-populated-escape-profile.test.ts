/**
 * Wave 44 overnight HEAVY — stats populated profile escape + unknown game.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderStatsDashboardFromSnapshot } from '../../src/ui/stats-dashboard';
import type { StatsDashboardSnapshot } from '../../src/ui/stats-dashboard';

describe('Wave 44 UI — stats populated', () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });
  afterEach(() => container.remove());

  it('escapes profile name and falls back for unknown gameId', () => {
    const snap: StatsDashboardSnapshot = {
      gameStats: {
        'not-a-real-game': {
          gameId: 'not-a-real-game',
          gamesPlayed: 2,
          gamesWon: 1,
          gamesLost: 1,
          gamesDraw: 0,
          totalPlayTime: 120_000,
          bestWinStreak: 1,
          currentWinStreak: 0,
          lastPlayed: Date.UTC(2026, 0, 5),
          firstPlayed: Date.UTC(2026, 0, 1),
        },
      },
      streak: { currentStreak: 2, bestStreak: 5, lastPlayDate: '2026-01-05', streakStartDate: '2026-01-04' },
      totalGamesPlayed: 2,
      totalPlayTime: 120_000,
      overallWinRate: 0.5,
      profile: {
        id: 'p1',
        name: 'A <b>Name</b> & "x"',
        avatar: '',
        createdAt: 1,
        lastActiveAt: 2,
      },
      achievements: [{ id: 'a1', unlockedAt: 1 }],
    };
    renderStatsDashboardFromSnapshot(container, snap);
    const html = container.innerHTML;
    expect(html).toContain('&lt;b&gt;');
    expect(html).toContain('&amp;');
    expect(html).toContain('not-a-real-game');
    expect(container.querySelector('.stats-dashboard-best-streak')?.textContent).toContain('5');
    expect(container.querySelector('[data-game-id="not-a-real-game"]')).toBeTruthy();
    expect(container.querySelector('.stats-summary-label')?.textContent).toMatch(/streak|Achievements|Games/i);
  });
});
