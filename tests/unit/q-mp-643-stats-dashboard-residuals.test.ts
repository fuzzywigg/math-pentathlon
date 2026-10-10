/**
 * q-mp-643 — Close stats-dashboard residual lines 30 / 301 (tests only).
 *
 * The verify glob `tests/unit/*stats-dashboard*` does not include burn-wave24,
 * so `readStatsSnapshot` (line 30) and `renderStatsDashboard` (line 301) stay
 * uncovered there. Structural asserts only — no player-facing copy pins.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  readStatsSnapshot,
  renderStatsDashboard,
} from '../../src/ui/stats-dashboard';
import { storage } from '../../src/core/storage';

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
}));

import { navigate } from '../../src/core/router';

describe('q-mp-643 stats-dashboard live snapshot / render residuals', () => {
  let container: HTMLElement;

  beforeEach(() => {
    localStorage.clear();
    storage.resetAll();
    container = document.createElement('div');
    document.body.appendChild(container);
    vi.mocked(navigate).mockClear();
  });

  afterEach(() => {
    container.remove();
    localStorage.clear();
    storage.resetAll();
  });

  it('readStatsSnapshot mirrors empty storage getters (line 30)', () => {
    const snap = readStatsSnapshot();
    expect(snap.gameStats).toEqual({});
    expect(snap.totalGamesPlayed).toBe(0);
    expect(snap.totalPlayTime).toBe(0);
    expect(snap.overallWinRate).toBe(0);
    expect(snap.profile).toBeNull();
    expect(snap.achievements).toEqual([]);
    expect(snap.streak.currentStreak).toBe(0);
    expect(snap.streak.bestStreak).toBe(0);
  });

  it('renderStatsDashboard pulls a live storage snapshot into the empty shell (line 301)', () => {
    renderStatsDashboard(container);

    expect(container.querySelector('.stats-dashboard')).toBeTruthy();
    expect(container.querySelector('.stats-dashboard-empty')).toBeTruthy();
    expect(container.querySelector('.stats-dashboard-summary')).toBeNull();
    expect(container.querySelector('#back-btn')).toBeTruthy();
  });

  it('renderStatsDashboard reflects a recorded game result from storage', () => {
    storage.createProfile('Pat', 'owl');
    storage.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 90_000,
      moveCount: 3,
      playedAt: Date.now(),
    });

    renderStatsDashboard(container);

    expect(container.querySelector('.stats-dashboard-empty')).toBeNull();
    expect(container.querySelector('.stats-dashboard-summary')).toBeTruthy();
    expect(container.querySelector('[data-game-id="hex"]')).toBeTruthy();
    expect(container.querySelector('.stats-dashboard-profile')).toBeTruthy();

    const snap = readStatsSnapshot();
    expect(snap.profile?.name).toBe('Pat');
    expect(snap.gameStats.hex?.gamesPlayed).toBeGreaterThanOrEqual(1);
    expect(snap.totalGamesPlayed).toBeGreaterThanOrEqual(1);

    const back = container.querySelector('#back-btn') as HTMLButtonElement;
    back.click();
    expect(navigate).toHaveBeenCalledWith('/');
  });
});
