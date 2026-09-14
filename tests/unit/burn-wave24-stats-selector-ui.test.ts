/**
 * Wave 24 — stats dashboard formatters/render edges + game-selector cards/accordion.
 * Distinct from wave 23 storage APIs and existing thin selector tab tests.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  formatPlayTime,
  formatWinRate,
  formatLastPlayed,
  readStatsSnapshot,
  renderStatsDashboardFromSnapshot,
  renderStatsDashboard,
  type StatsDashboardSnapshot,
} from '../../src/ui/stats-dashboard';
import { renderGameSelector } from '../../src/ui/game-selector';
import {
  storage,
  createDefaultGameStats,
  createDefaultProgress,
} from '../../src/core/storage';
import { DIVISIONS, GAMES } from '../../src/core/game-registry';

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

describe('Wave 24 stats — formatters / snapshot read', () => {
  beforeEach(() => {
    localStorage.clear();
    storage.resetAll();
  });

  afterEach(() => {
    localStorage.clear();
    storage.resetAll();
  });

  it('formatLastPlayed handles zero and valid timestamps', () => {
    expect(formatLastPlayed(0)).toBe('—');
    const label = formatLastPlayed(Date.UTC(2026, 0, 15));
    expect(label).not.toBe('—');
    expect(label.length).toBeGreaterThan(0);
  });

  it('formatPlayTime / formatWinRate edge values', () => {
    expect(formatPlayTime(-10)).toBe('0 min');
    expect(formatPlayTime(59_999)).toBe('0 min');
    expect(formatPlayTime(61 * 60_000)).toBe('1h 1m');
    expect(formatWinRate(Number.NaN)).toBe('0%');
    expect(formatWinRate(-0.2)).toBe('0%');
    expect(formatWinRate(1)).toBe('100%');
  });

  it('readStatsSnapshot mirrors storage after profile + result', () => {
    storage.createProfile('Bo', 'star');
    storage.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 120_000,
      moveCount: 4,
      playedAt: Date.now(),
    });
    const snap = readStatsSnapshot();
    expect(snap.profile?.name).toBe('Bo');
    expect(snap.totalGamesPlayed).toBeGreaterThanOrEqual(1);
    expect(snap.gameStats.hex?.gamesWon).toBe(1);
    expect(createDefaultProgress().version).toBeTruthy();
  });

  it('renderStatsDashboard pulls live storage snapshot', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    storage.recordGameResult({
      gameId: 'calla',
      winner: 'ai',
      playerWon: false,
      duration: 1000,
      moveCount: 2,
      playedAt: Date.now(),
    });
    renderStatsDashboard(container);
    expect(container.querySelector('.stats-dashboard')).toBeTruthy();
    expect(container.textContent).toContain('Calla');
    container.remove();
  });
});

describe('Wave 24 stats — render edges', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    vi.mocked(navigate).mockClear();
  });

  afterEach(() => {
    container.remove();
  });

  it('escapes profile HTML and shows unknown gameId fallback', () => {
    const mystery = createDefaultGameStats('not-a-real-game');
    mystery.gamesPlayed = 2;
    mystery.gamesWon = 1;
    mystery.lastPlayed = Date.UTC(2026, 5, 1);

    renderStatsDashboardFromSnapshot(
      container,
      emptySnapshot({
        gameStats: { 'not-a-real-game': mystery },
        profile: {
          id: 'p',
          name: '<script>x</script>',
          avatar: 'owl',
          createdAt: 1,
          lastActiveAt: 2,
        },
        streak: {
          currentStreak: 1,
          bestStreak: 1,
          lastPlayDate: '2026-06-01',
          streakStartDate: '2026-06-01',
        },
        totalGamesPlayed: 2,
        totalPlayTime: 60_000,
        overallWinRate: 0.5,
      })
    );

    expect(container.innerHTML).toContain('&lt;script&gt;x&lt;/script&gt;');
    expect(container.innerHTML).not.toContain('<script>x</script>');
    expect(container.textContent).toContain('not-a-real-game');
    expect(container.querySelector('.stats-game-card')?.getAttribute('data-game-id')).toBe(
      'not-a-real-game'
    );
    // best streak singular day
    expect(container.textContent).toMatch(/Best streak:\s*1 day(?!s)/);
  });

  it('omits achievements block when empty and sorts by lastPlayed desc', () => {
    const older = createDefaultGameStats('hex');
    older.gamesPlayed = 1;
    older.lastPlayed = Date.UTC(2026, 1, 1);
    const newer = createDefaultGameStats('calla');
    newer.gamesPlayed = 1;
    newer.lastPlayed = Date.UTC(2026, 8, 1);

    renderStatsDashboardFromSnapshot(
      container,
      emptySnapshot({
        gameStats: { hex: older, calla: newer },
        totalGamesPlayed: 2,
        achievements: [],
      })
    );

    expect(container.textContent).not.toContain('Achievements');
    const cards = [
      ...container.querySelectorAll('.stats-game-card'),
    ] as HTMLElement[];
    expect(cards[0].dataset.gameId).toBe('calla');
    expect(cards[1].dataset.gameId).toBe('hex');
  });

  it('shows plural best streak days', () => {
    const hex = createDefaultGameStats('hex');
    hex.gamesPlayed = 1;
    hex.lastPlayed = 1;
    renderStatsDashboardFromSnapshot(
      container,
      emptySnapshot({
        gameStats: { hex },
        streak: {
          currentStreak: 2,
          bestStreak: 4,
          lastPlayDate: '2026-09-01',
          streakStartDate: '2026-08-29',
        },
      })
    );
    expect(container.textContent).toMatch(/Best streak:\s*4 days/);
  });
});

describe('Wave 24 game-selector — hero / cards / accordion headers', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    Element.prototype.scrollIntoView = vi.fn();
    vi.mocked(navigate).mockClear();
  });

  afterEach(() => {
    container.remove();
    vi.restoreAllMocks();
  });

  it('renders hero brand, stats counts, and division accordions', () => {
    renderGameSelector(container);

    expect(container.querySelector('.hero-logo h1')?.textContent).toBe(
      'Math Pentathlon'
    );
    expect(container.textContent).toContain('Practice Edition');
    expect(container.querySelector('.stat-number')?.textContent).toBe(
      String(GAMES.length)
    );
    expect(container.querySelectorAll('.division-accordion').length).toBe(
      DIVISIONS.length
    );
    expect(
      container
        .querySelector('.division-accordion')
        ?.classList.contains('accordion-open')
    ).toBe(true);
  });

  it('navigates available game cards via click and Enter/Space', () => {
    renderGameSelector(container);
    const card = container.querySelector(
      '.game-card:not(.game-card-disabled)'
    ) as HTMLElement;
    expect(card).toBeTruthy();
    expect(card.getAttribute('tabindex')).toBe('0');
    expect(card.getAttribute('aria-label')).toMatch(/Available$/);

    const title = card.querySelector('.game-card-title')?.textContent ?? '';
    const game = GAMES.find((g) => g.name === title && g.available);
    expect(game).toBeDefined();

    card.click();
    expect(navigate).toHaveBeenCalledWith(`/game/${game!.id}`);

    vi.mocked(navigate).mockClear();
    card.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(navigate).toHaveBeenCalledWith(`/game/${game!.id}`);

    vi.mocked(navigate).mockClear();
    card.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    expect(navigate).toHaveBeenCalledWith(`/game/${game!.id}`);
  });

  it('disabled cards do not navigate and show Coming Soon badge', () => {
    renderGameSelector(container);
    const card = container.querySelector(
      '.game-card.game-card-disabled'
    ) as HTMLElement | null;
    if (!card) {
      // All games available in registry
      expect(
        container.querySelectorAll('.game-card:not(.game-card-disabled)').length
      ).toBeGreaterThan(0);
      return;
    }

    expect(card.getAttribute('tabindex')).toBe('-1');
    expect(card.querySelector('.game-card-badge')?.textContent).toBe(
      'Coming Soon'
    );
    card.click();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('accordion header toggles open section and updates active tab', () => {
    renderGameSelector(container);
    const second = DIVISIONS[1];
    const section = container.querySelector(
      `.division-accordion[data-division="${second.name}"]`
    ) as HTMLElement;
    const header = section.querySelector(
      '.accordion-header'
    ) as HTMLButtonElement;

    header.click();
    expect(section.classList.contains('accordion-open')).toBe(true);
    expect(header.getAttribute('aria-expanded')).toBe('true');
    expect(
      container.querySelectorAll('.division-accordion.accordion-open').length
    ).toBe(1);

    const tab = container.querySelector(
      `.division-tab[data-division="${second.name}"]`
    );
    expect(tab?.classList.contains('active')).toBe(true);

    // Clicking open header closes it
    header.click();
    expect(section.classList.contains('accordion-open')).toBe(false);
    expect(header.getAttribute('aria-expanded')).toBe('false');
  });
});
