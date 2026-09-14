/**
 * Wave 44 overnight HEAVY — stats row winrate dash when played=0.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderStatsDashboardFromSnapshot } from '../../src/ui/stats-dashboard';
import type { StatsDashboardSnapshot } from '../../src/ui/stats-dashboard';

describe('Wave 44 UI — stats zero played', () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });
  afterEach(() => container.remove());

  it('shows em-dash win rate when gamesPlayed is 0', () => {
    const snap: StatsDashboardSnapshot = {
      gameStats: {
        hex: {
          gameId: 'hex',
          gamesPlayed: 0,
          gamesWon: 0,
          gamesLost: 0,
          gamesDraw: 0,
          totalPlayTime: 0,
          bestWinStreak: 0,
          currentWinStreak: 0,
          lastPlayed: 0,
          firstPlayed: 0,
        },
      },
      streak: { currentStreak: 0, bestStreak: 0, lastPlayDate: '', streakStartDate: '' },
      totalGamesPlayed: 0,
      totalPlayTime: 0,
      overallWinRate: 0,
      profile: null,
      achievements: [],
    };
    renderStatsDashboardFromSnapshot(container, snap);
    const metrics = container.querySelector('.stats-game-metrics')!.textContent!;
    expect(metrics).toContain('—');
  });
});
