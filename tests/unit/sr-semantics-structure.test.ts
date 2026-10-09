/**
 * Durable screen-reader structure keepers: landmarks, heading ids,
 * dialog aria-hidden, status live region, board labelling, tutorial
 * describedby, owl live speech, menu/stats regions.
 *
 * Semantics / ARIA wiring only — no keyboard-order or contrast re-work.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  mountGameShell,
  type GameShellElements,
} from '../../src/ui/components/game-shell';
import {
  labelBoardFromGameTitle,
  markBoardAsGrid,
  markStatusLive,
} from '../../src/ui/board-a11y';
import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';
import { OwlComponent } from '../../src/ui/owl/owl-component';
import { owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';
import { renderGameSelector } from '../../src/ui/game-selector';
import { renderStatsDashboardFromSnapshot } from '../../src/ui/stats-dashboard';
import { DIVISIONS } from '../../src/core/game-registry';

async function flushMicrotasks(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

describe('SR semantics — document landmarks', () => {
  it('index.html keeps skip link + main#main-content landmark', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
    expect(html).toMatch(/lang="en"/);
    expect(html).toMatch(
      /<a class="skip-link" href="#main-content">Skip to main content<\/a>/
    );
    expect(html).toMatch(/<main id="main-content" tabindex="-1">/);
  });
});

describe('SR semantics — game shell structure', () => {
  let container: HTMLElement;
  let shell: GameShellElements | null = null;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    shell?.cleanup();
    shell = null;
    container.remove();
  });

  function mount(extra?: {
    showMoveHistory?: boolean;
    showDifficulty?: boolean;
  }): GameShellElements {
    shell = mountGameShell(container, {
      title: 'Hex Probe',
      helpTitle: 'How to Play Hex',
      helpContentHtml: '<p>Rules body</p>',
      modeRadioName: 'sr-hex-mode',
      showMoveHistory: extra?.showMoveHistory,
      showDifficulty: extra?.showDifficulty ?? true,
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    return shell;
  }

  it('exposes header, nav, status live region, and game region labelled by h1', () => {
    mount();

    const header = container.querySelector('header.game-header');
    expect(header).toBeTruthy();

    const title = container.querySelector('#game-title');
    expect(title?.tagName).toBe('H1');
    expect(title?.textContent).toBe('Hex Probe');

    const nav = container.querySelector('nav.button-row');
    expect(nav?.getAttribute('aria-label')).toBe('Game actions');

    const status = container.querySelector('#status');
    expect(status?.getAttribute('role')).toBe('status');
    expect(status?.getAttribute('aria-live')).toBe('polite');

    const region = container.querySelector(
      '[role="region"][aria-labelledby="game-title"]'
    );
    expect(region).toBeTruthy();
    expect(region?.contains(container.querySelector('#board')!)).toBe(true);
  });

  it('wires move-history region to the existing History label', () => {
    mount({ showMoveHistory: true });
    const panel = container.querySelector('#move-history');
    expect(panel?.getAttribute('role')).toBe('region');
    expect(panel?.getAttribute('aria-labelledby')).toBe('move-history-label');
    expect(container.querySelector('#move-history-label')?.textContent).toBe(
      'History'
    );
  });

  it('keeps closed modals aria-hidden and reveals them on open', async () => {
    const s = mount();
    const modal = s.newGameModal!;
    expect(modal.getAttribute('aria-hidden')).toBe('true');
    expect(modal.classList.contains('hidden')).toBe(true);

    (s.newGameBtn as HTMLElement).click();
    await flushMicrotasks();
    expect(modal.getAttribute('aria-hidden')).toBe('false');
    expect(modal.classList.contains('hidden')).toBe(false);

    modal.querySelector<HTMLElement>('.modal-close')!.click();
    await flushMicrotasks();
    expect(modal.getAttribute('aria-hidden')).toBe('true');
    expect(modal.classList.contains('hidden')).toBe(true);
  });

  it('Escape re-hides Help with aria-hidden and restores focus', async () => {
    const s = mount();
    const btn = s.helpBtn as HTMLButtonElement;
    btn.focus();
    btn.click();
    await flushMicrotasks();
    expect(s.helpModal!.getAttribute('aria-hidden')).toBe('false');

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    await flushMicrotasks();
    expect(s.helpModal!.getAttribute('aria-hidden')).toBe('true');
    expect(document.activeElement).toBe(btn);
  });

  it('difficulty buttons expose aria-pressed from the selected state', () => {
    mount({ showDifficulty: true });
    const hard = container.querySelector(
      '.difficulty-btn.hard'
    ) as HTMLButtonElement;
    const medium = container.querySelector(
      '.difficulty-btn.medium'
    ) as HTMLButtonElement;
    expect(medium.getAttribute('aria-pressed')).toBe('true');
    expect(hard.getAttribute('aria-pressed')).toBe('false');

    hard.click();
    expect(hard.getAttribute('aria-pressed')).toBe('true');
    expect(medium.getAttribute('aria-pressed')).toBe('false');
  });

  it('heading order in New Game dialog is h2 → h3 (no skip)', () => {
    mount();
    const modal = container.querySelector('#new-game-modal')!;
    expect(modal.querySelector('h2')?.id).toBe('new-game-modal-title');
    expect(modal.querySelector('h3')?.textContent).toBe('Choose Game Mode');
  });
});

describe('SR semantics — board grid naming', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('labelBoardFromGameTitle wires aria-labelledby to #game-title', () => {
    document.body.innerHTML = '<h1 id="game-title">Prime Gold</h1>';
    const board = document.createElement('div');
    labelBoardFromGameTitle(board);
    expect(board.getAttribute('aria-labelledby')).toBe('game-title');
  });

  it('labelBoardFromGameTitle does not overwrite existing names', () => {
    document.body.innerHTML = '<h1 id="game-title">Prime Gold</h1>';
    const board = document.createElement('div');
    board.setAttribute('aria-label', 'Custom board');
    labelBoardFromGameTitle(board);
    expect(board.getAttribute('aria-label')).toBe('Custom board');
    expect(board.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('markBoardAsGrid names the grid from the page title when present', () => {
    document.body.innerHTML = '<h1 id="game-title">Contig 60</h1>';
    const board = document.createElement('div');
    markBoardAsGrid(board);
    expect(board.getAttribute('role')).toBe('grid');
    expect(board.getAttribute('aria-labelledby')).toBe('game-title');
  });

  it('markStatusLive remains the status live-region contract', () => {
    const el = document.createElement('div');
    el.textContent = 'Blue to move';
    markStatusLive(el);
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');
    expect(el.textContent).toBe('Blue to move');
  });
});

describe('SR semantics — tutorial dialog', () => {
  let manager: TutorialManager;

  beforeEach(() => {
    manager = new TutorialManager();
  });

  afterEach(() => {
    manager.exit();
    document
      .querySelectorAll('.tutorial-tooltip, .tutorial-overlay')
      .forEach((el) => el.remove());
  });

  it('uses h2 title + aria-describedby pointing at existing message text', () => {
    const config: TutorialConfig = {
      id: 'sr-tutorial',
      name: 'SR Tutorial',
      steps: [
        {
          id: 'welcome',
          title: 'Welcome Step',
          message: 'Read this existing copy.',
          position: 'bottom',
        },
      ],
    };
    manager.start(config);

    const tip = document.querySelector('.tutorial-tooltip') as HTMLElement;
    expect(tip.getAttribute('role')).toBe('dialog');
    expect(tip.getAttribute('aria-modal')).toBe('true');
    expect(tip.getAttribute('aria-labelledby')).toBe('tutorial-tooltip-title');
    expect(tip.getAttribute('aria-describedby')).toBe(
      'tutorial-tooltip-message'
    );

    const title = tip.querySelector('#tutorial-tooltip-title');
    expect(title?.tagName).toBe('H2');
    expect(title?.textContent).toBe('Welcome Step');

    const message = tip.querySelector('#tutorial-tooltip-message');
    expect(message?.tagName).toBe('P');
    expect(message?.textContent).toBe('Read this existing copy.');
  });
});

describe('SR semantics — owl speech live region', () => {
  let owl: OwlComponent;

  beforeEach(() => {
    localStorage.clear();
    storage.resetAll();
    storage.updateSettings({ owlEnabled: true });
    owlSystem.hide();
    document.body.innerHTML = '';
    owl = new OwlComponent();
  });

  afterEach(() => {
    owl.destroy();
    document.body.innerHTML = '';
    localStorage.clear();
    storage.resetAll();
  });

  it('owl message element is a polite status live region', () => {
    owl.init();
    const msg = owl.getElement()!.querySelector('.owl-message');
    expect(msg?.getAttribute('role')).toBe('status');
    expect(msg?.getAttribute('aria-live')).toBe('polite');
  });
});

describe('SR semantics — game selector + stats', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('menu has header/nav/footer landmarks and division region wiring', () => {
    renderGameSelector(container);

    expect(container.querySelector('header.game-selector-hero')).toBeTruthy();
    expect(container.querySelector('h1')?.textContent).toBe('Math Pentathlon');

    const tabNav = container.querySelector('nav.division-tabs');
    expect(tabNav?.getAttribute('role')).toBe('tablist');
    expect(tabNav?.getAttribute('aria-label')).toBe('Division navigation');

    const first = DIVISIONS[0];
    expect(first).toBeTruthy();
    const slug = first!.name.replace(/\s+/g, '-').toLowerCase();
    const tab = container.querySelector(`#division-tab-${slug}`);
    expect(tab?.getAttribute('aria-controls')).toBe(`games-${slug}`);

    const panel = container.querySelector(`#games-${slug}`);
    expect(panel?.getAttribute('role')).toBe('region');
    expect(panel?.getAttribute('aria-labelledby')).toBe(
      `division-title-${slug}`
    );
    expect(
      container.querySelector(`#division-title-${slug}`)?.textContent
    ).toBe(first!.name);
    // Named <section> + region with the same labelledby → landmark-unique fail.
    expect(
      container
        .querySelector(`section.division-accordion[data-division="${first!.name}"]`)
        ?.hasAttribute('aria-labelledby')
    ).toBe(false);

    expect(container.querySelector('footer.game-selector-footer')).toBeTruthy();
  });

  it('stats dashboard region is labelled by the existing Your Progress title', () => {
    renderStatsDashboardFromSnapshot(container, {
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
    });

    expect(container.querySelector('#stats-title')?.textContent).toBe(
      'Your Progress'
    );
    const region = container.querySelector(
      '.stats-main[role="region"][aria-labelledby="stats-title"]'
    );
    expect(region).toBeTruthy();
  });
});
