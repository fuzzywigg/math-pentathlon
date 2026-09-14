/**
 * Wave 24 — game-shell / stats / player-colors chrome edges.
 * Distinct from wave 20 controller mode matrix and wave 23 storage/owl.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mountGameShell } from '../../src/ui/components/game-shell';
import {
  formatPlayTime,
  formatWinRate,
  formatLastPlayed,
  renderStatsDashboardFromSnapshot,
  type StatsDashboardSnapshot,
} from '../../src/ui/stats-dashboard';
import { renderGameSelector } from '../../src/ui/game-selector';
import { createDefaultGameStats } from '../../src/core/storage';
import {
  applyGameModeChrome,
  clearGameModeChrome,
  getPlayerSeatColors,
  colorForSeat,
  seatIcon,
  getGameModeChromeRoot,
} from '../../src/ui/player-colors';

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

describe('Wave 24 shell — modeOrder / tutorial / history / Escape', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    document.body.innerHTML = '';
  });

  it('modeOrder AI-first and custom descriptions / boardClass', () => {
    const shell = mountGameShell(container, {
      title: 'Shell Edge',
      helpTitle: 'Help',
      helpContentHtml: '<p>Go</p>',
      modeRadioName: 'wave24-mode',
      defaultMode: 'human-vs-ai',
      modeOrder: ['human-vs-ai', 'human-vs-human'],
      vsHumanDescription: 'Friend duel',
      vsAiDescription: 'Bot duel',
      boardClass: 'custom-board',
      showTutorial: true,
      showMoveHistory: true,
      showDifficulty: true,
      defaultDifficulty: 'easy',
      newGameExtraHtml: '<div class="extra-flag">extra</div>',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
      onTutorial: () => undefined,
    });

    const options = container.querySelectorAll('.mode-option');
    expect(options[0].getAttribute('data-mode')).toBe('human-vs-ai');
    expect(options[1].getAttribute('data-mode')).toBe('human-vs-human');
    expect(container.textContent).toContain('Friend duel');
    expect(container.textContent).toContain('Bot duel');
    expect(shell.board?.classList.contains('custom-board')).toBe(true);
    expect(shell.tutorialBtn).toBeTruthy();
    expect(shell.moveHistoryPanel).toBeTruthy();
    expect(shell.historyContent).toBeTruthy();
    expect(container.querySelector('.extra-flag')).toBeTruthy();
    expect(
      container.querySelector('.difficulty-btn.easy.selected')
    ).toBeTruthy();
    shell.cleanup();
  });

  it('showStatus false omits #status; custom gameAreaHtml uses mountId', () => {
    const shell = mountGameShell(container, {
      title: 'Custom Area',
      helpTitle: 'Help',
      helpContentHtml: '<p>x</p>',
      modeRadioName: 'wave24-custom',
      showStatus: false,
      mountId: 'mount-x',
      gameAreaHtml: '<div id="mount-x" class="alt-mount"></div>',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    expect(shell.status).toBeNull();
    expect(document.getElementById('status')).toBeNull();
    expect(shell.board?.id).toBe('mount-x');
    shell.cleanup();
  });

  it('tutorial callback fires; history collapse toggles aria-expanded', () => {
    const onTutorial = vi.fn();
    const shell = mountGameShell(container, {
      title: 'Tut',
      helpTitle: 'Help',
      helpContentHtml: '<p>x</p>',
      modeRadioName: 'wave24-tut',
      showTutorial: true,
      showMoveHistory: true,
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
      onTutorial,
    });
    (shell.tutorialBtn as HTMLButtonElement).click();
    expect(onTutorial).toHaveBeenCalledTimes(1);

    const toggle = shell.moveHistoryPanel!.querySelector(
      '.collapse-toggle'
    ) as HTMLButtonElement;
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    toggle.click();
    expect(shell.moveHistoryPanel!.classList.contains('collapsed')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click();
    expect(shell.moveHistoryPanel!.classList.contains('collapsed')).toBe(false);
    shell.cleanup();
  });

  it('Escape closes help and new-game modals; backdrop click closes', () => {
    const shell = mountGameShell(container, {
      title: 'Modals',
      helpTitle: 'Help',
      helpContentHtml: '<p>rules</p>',
      modeRadioName: 'wave24-modals',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });

    (shell.helpBtn as HTMLButtonElement).click();
    expect(shell.helpModal!.classList.contains('hidden')).toBe(false);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(shell.helpModal!.classList.contains('hidden')).toBe(true);

    (shell.newGameBtn as HTMLButtonElement).click();
    expect(shell.newGameModal!.classList.contains('hidden')).toBe(false);
    const backdrop = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(backdrop, 'target', {
      value: shell.newGameModal,
    });
    shell.newGameModal!.dispatchEvent(backdrop);
    expect(shell.newGameModal!.classList.contains('hidden')).toBe(true);

    (shell.newGameBtn as HTMLButtonElement).click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(shell.newGameModal!.classList.contains('hidden')).toBe(true);

    const home = vi.fn();
    shell.cleanup();
    const shell2 = mountGameShell(container, {
      title: 'Back',
      helpTitle: 'Help',
      helpContentHtml: '<p>x</p>',
      modeRadioName: 'wave24-back',
      onNavigateHome: home,
      onStartGame: () => undefined,
    });
    (shell2.backBtn as HTMLButtonElement).click();
    expect(home).toHaveBeenCalled();
    shell2.cleanup();
  });

  it('switching to 2P hides difficulty; start without showDifficulty omits level', () => {
    let started: { mode: string; difficulty?: string } | null = null;
    const shell = mountGameShell(container, {
      title: 'Diff',
      helpTitle: 'Help',
      helpContentHtml: '<p>x</p>',
      modeRadioName: 'wave24-diff',
      defaultMode: 'human-vs-ai',
      showDifficulty: true,
      onNavigateHome: () => undefined,
      onStartGame: (mode, difficulty) => {
        started = { mode, difficulty };
      },
    });

    const human = container.querySelector(
      '.mode-option[data-mode="human-vs-human"]'
    ) as HTMLElement;
    human.click();
    const section = container.querySelector(
      '#difficulty-section'
    ) as HTMLElement;
    expect(section.style.display).toBe('none');

    shell.cleanup();
    started = null;
    const shell2 = mountGameShell(container, {
      title: 'NoDiff',
      helpTitle: 'Help',
      helpContentHtml: '<p>x</p>',
      modeRadioName: 'wave24-nodiff',
      defaultMode: 'human-vs-ai',
      showDifficulty: false,
      onNavigateHome: () => undefined,
      onStartGame: (mode, difficulty) => {
        started = { mode, difficulty };
      },
    });
    (shell2.newGameBtn as HTMLButtonElement).click();
    (container.querySelector('#start-game-btn') as HTMLButtonElement).click();
    expect(started).toEqual({ mode: 'human-vs-ai', difficulty: undefined });
    shell2.cleanup();
  });
});

describe('Wave 24 player-colors — AI seat flip / icons / root', () => {
  let app: HTMLElement;

  beforeEach(() => {
    app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
  });

  afterEach(() => {
    clearGameModeChrome(app);
    app.remove();
  });

  it('AI on player1 seat paints purple for P1 and red for P2', () => {
    applyGameModeChrome(app, 'human-vs-ai', 'player1');
    const colors = getPlayerSeatColors(app);
    expect(colors.player1).toBe('#8b5cf6');
    expect(colors.player2).toBe('#ef4444');
    expect(colorForSeat('player1', app)).toBe('#8b5cf6');
    expect(colorForSeat('player2', app)).toBe('#ef4444');
    expect(seatIcon('player1', app)).toBe('🟣');
    expect(seatIcon('player2', app)).toBe('🔴');
  });

  it('getGameModeChromeRoot falls back to #app; clear removes chrome', () => {
    applyGameModeChrome(app, 'human-vs-ai');
    expect(getGameModeChromeRoot()).toBe(app);
    expect(getGameModeChromeRoot(app)).toBe(app);
    clearGameModeChrome(app);
    expect(app.dataset.opponent).toBeUndefined();
    expect(app.classList.contains('game-vs-ai')).toBe(false);
    expect(seatIcon('player1', app)).toBe('🔵');
  });
});

describe('Wave 24 stats — formatLastPlayed + richer snapshot rows', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    vi.mocked(navigate).mockClear();
  });

  afterEach(() => {
    container.remove();
  });

  it('formatLastPlayed handles 0 / valid timestamps', () => {
    expect(formatLastPlayed(0)).toBe('—');
    const label = formatLastPlayed(Date.UTC(2026, 0, 15));
    expect(label).not.toBe('—');
    expect(label.length).toBeGreaterThan(2);
  });

  it('formatPlayTime / formatWinRate edge values', () => {
    expect(formatPlayTime(-5)).toBe('0 min');
    expect(formatPlayTime(59_999)).toBe('0 min');
    expect(formatWinRate(Number.NaN)).toBe('0%');
    expect(formatWinRate(-1)).toBe('0%');
    expect(formatWinRate(1)).toBe('100%');
  });

  it('renders unknown game id via fallback and sorts by lastPlayed', () => {
    const older = createDefaultGameStats('hex');
    older.gamesPlayed = 2;
    older.gamesWon = 1;
    older.lastPlayed = Date.UTC(2026, 0, 1);
    older.totalPlayTime = 60_000;

    const newer = createDefaultGameStats('not-a-real-game-id');
    newer.gamesPlayed = 3;
    newer.gamesWon = 0;
    newer.gamesLost = 3;
    newer.lastPlayed = Date.UTC(2026, 5, 1);
    newer.totalPlayTime = 120_000;

    renderStatsDashboardFromSnapshot(
      container,
      emptySnapshot({
        gameStats: { hex: older, 'not-a-real-game-id': newer },
        totalGamesPlayed: 5,
        totalPlayTime: 180_000,
        overallWinRate: 0.2,
      })
    );

    const cards = container.querySelectorAll('.stats-game-card');
    expect(cards.length).toBe(2);
    expect(container.textContent).toMatch(/not-a-real-game-id|Unknown|Game/i);
    expect(container.querySelector('.stats-dashboard-summary')).toBeTruthy();
  });
});

describe('Wave 24 game-selector — progress link still routes', () => {
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

  it('hero progress link href and click navigate to /stats', () => {
    renderGameSelector(container);
    const link = container.querySelector(
      '.hero-progress-link'
    ) as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('#/stats');
    link.click();
    expect(navigate).toHaveBeenCalledWith('/stats');
  });
});
