/**
 * burn-1009 / q-mp-111 — UI coverage round 6: kings / kwatro / pent / frac-fact /
 * stars-bars / par-55 / queens-guards controller residual shells.
 * Characterization only — no copy / AI choice / timing asserts.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountAppShell, mountRoot } from './helpers/dom';
import { createInitialState as createPentState } from '../../src/games/pent-em-in/types';
import { createInitialState as createFracState } from '../../src/games/frac-fact/types';
import { startGame as startFrac } from '../../src/games/frac-fact/rules';

installDomHooks({
  fakeTimers: true,
  styleIds: [
    'stars-styles',
    'kwa-styles',
    'pent-em-in-styles',
    'frac-fact-styles',
    'par-styles',
  ],
});

afterEach(async () => {
  vi.restoreAllMocks();
  for (const path of [
    '../../src/games/kings-quadraphages/game-controller',
    '../../src/games/kwatro-sinko/game-controller',
    '../../src/games/pent-em-in/game-controller',
    '../../src/games/frac-fact/game-controller',
    '../../src/games/stars-bars/game-controller',
    '../../src/games/par-55/game-controller',
    '../../src/games/queens-guards/game-controller',
  ] as const) {
    try {
      const mod = await import(path);
      mod.destroyGame?.();
    } catch {
      // ignore
    }
  }
});

describe('burn-1009 ui-cov-r6 kings-quadraphages residuals', () => {
  it('invalid click animation + tutorial complete + getters', async () => {
    const {
      initGame,
      newGameVsHuman,
      newGameVsAI,
      setAIDifficulty,
      getGameMode,
      getAIDifficulty,
      startTutorial,
      isTutorialActive,
      destroyGame,
    } = await import('../../src/games/kings-quadraphages/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();
    const history = mountRoot();
    const newBtn = document.createElement('button');
    document.body.appendChild(newBtn);

    initGame(board, status, history, newBtn);
    newGameVsHuman();
    expect(getGameMode()).toBe('human-vs-human');

    // Click occupied / invalid cell to exercise invalid animation branch.
    const cell = board.querySelector(
      '.cell[data-row][data-col]'
    ) as HTMLElement | null;
    cell?.click();
    await vi.advanceTimersByTimeAsync(300);

    newGameVsAI('easy', true);
    setAIDifficulty('medium');
    expect(getAIDifficulty()).toBe('medium');

    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);

    expect(getGameMode()).toBeTruthy();
    destroyGame();
  });
});

describe('burn-1009 ui-cov-r6 kwatro-sinko residuals', () => {
  it('init + pass/clear chrome + tutorial complete + destroy', async () => {
    const { initGame, startTutorial, destroyGame } = await import(
      '../../src/games/kwatro-sinko/game-controller'
    );
    const { tutorialManager } = await import('../../src/core/tutorial');

    const root = mountRoot();
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);

    initGame(root, false);
    expect(root.querySelector('.kwa-game-area, .kwa-board, svg')).toBeTruthy();

    // Secondary buttons if present (clear / pass) — structural clicks only.
    root.querySelectorAll('button').forEach((btn) => {
      if (/pass|clear/i.test(btn.textContent ?? '')) {
        (btn as HTMLButtonElement).click();
      }
    });

    startTutorial();
    if (tutorialManager.getIsActive()) {
      tutorialManager.complete();
    }

    destroyGame();
  });
});

describe('burn-1009 ui-cov-r6 pent-em-in residuals', () => {
  it('__setStateForTests gameOver + tutorial completed + destroy', async () => {
    const {
      initGame,
      newGameVsHuman,
      __setStateForTests,
      getCurrentState,
      startTutorial,
      isTutorialActive,
      destroyGame,
    } = await import('../../src/games/pent-em-in/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    newGameVsHuman();

    const over = {
      ...createPentState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    __setStateForTests(over);
    expect(getCurrentState().phase).toBe('gameOver');
    expect(
      board.querySelector('.pent-board, .pent-cell, svg') ||
        status.querySelector('.pent-status, .game-winner-banner, div')
    ).toBeTruthy();

    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    destroyGame();
  });
});

describe('burn-1009 ui-cov-r6 frac-fact residuals', () => {
  it('AI schedule flush + __setStateForTests + destroy clears timers', async () => {
    const {
      initGame,
      newGameVsAI,
      newGameVsHuman,
      __setStateForTests,
      getCurrentState,
      destroyGame,
      setDifficulty,
      startTutorial,
      isTutorialActive,
    } = await import('../../src/games/frac-fact/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const root = mountAppShell();
    initGame(root);
    newGameVsHuman('easy');
    setDifficulty('easy');

    // Human answer if choices exist
    const choice = root.querySelector(
      '.frac-choice-btn, button.frac-answer'
    ) as HTMLButtonElement | null;
    choice?.click();
    const cont = root.querySelector(
      '.frac-continue-btn, button.frac-continue'
    ) as HTMLButtonElement | null;
    cont?.click();

    newGameVsAI('easy', 'easy');
    // If computer pending, flush think+continue without asserting answers.
    await vi.advanceTimersByTimeAsync(1000);
    await Promise.resolve();
    if (getCurrentState().phase === 'showingResult') {
      await vi.advanceTimersByTimeAsync(1500);
    }

    __setStateForTests(startFrac(createFracState('easy')));
    expect(getCurrentState().phase).toBeTruthy();

    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);

    destroyGame();
  });
});

describe('burn-1009 ui-cov-r6 stars-bars + par-55 residuals', () => {
  it('stars-bars tutorial complete + destroy', async () => {
    const { initGame, startTutorial, destroyGame } = await import(
      '../../src/games/stars-bars/game-controller'
    );
    const { tutorialManager } = await import('../../src/core/tutorial');
    const root = mountRoot();
    initGame(root, false);
    expect(root.querySelector('.stars-game-area')).toBeTruthy();
    startTutorial();
    if (tutorialManager.getIsActive()) {
      tutorialManager.complete();
    }
    destroyGame();
  });

  it('par-55 tutorial complete + destroy', async () => {
    const { initGame, startTutorial, destroyGame } = await import(
      '../../src/games/par-55/game-controller'
    );
    const { tutorialManager } = await import('../../src/core/tutorial');
    const root = mountRoot();
    initGame(root, false);
    expect(root.querySelector('.par55-game-area')).toBeTruthy();
    startTutorial();
    if (tutorialManager.getIsActive()) {
      tutorialManager.complete();
    }
    destroyGame();
  });
});

describe('burn-1009 ui-cov-r6 queens-guards residuals', () => {
  it('seedWinnerFormation DEV hook + tutorial complete + destroy', async () => {
    const {
      initGame,
      newGameVsHuman,
      startTutorial,
      isTutorialActive,
      destroyGame,
      getGameState,
    } = await import('../../src/games/queens-guards/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    newGameVsHuman();

    const dev = (
      window as Window & {
        __mp3dQueensGuardsCtrl?: { seedWinnerFormation?: () => void };
      }
    ).__mp3dQueensGuardsCtrl;
    dev?.seedWinnerFormation?.();
    // Winner may be set when DEV hook present; otherwise just smoke state.
    expect(getGameState()).toBeTruthy();

    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    destroyGame();
  });
});
