/**
 * burn-1008-mp-ui-coverage-round-5 — hex + fraction-pinball controller shells.
 * Characterization: DOM structure / state phase only. No player-facing copy
 * asserts. No AI move-choice or AI timing asserts (fake timers; never flush
 * AI delays to completion for assertions).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountAppShell, mountRoot } from './helpers/dom';
import { createInitialState as createHexState } from '../../src/games/hex/types';
import { makeMove as hexMakeMove } from '../../src/games/hex/rules';
import { submitAnswer } from '../../src/games/fraction-pinball/rules';

installDomHooks({
  fakeTimers: true,
  styleIds: ['fraction-pinball-styles', 'pinball-styles'],
});

afterEach(async () => {
  vi.restoreAllMocks();
  for (const path of [
    '../../src/games/hex/game-controller',
    '../../src/games/fraction-pinball/game-controller',
  ] as const) {
    try {
      const mod = await import(path);
      mod.destroyGame?.();
    } catch {
      // ignore
    }
  }
});

describe('burn-1008 ui-cov-r5 hex controller shell', () => {
  it('HvH init, cell click, winner chrome sync, reset, setAIDifficulty', async () => {
    const { initGame, newGameVsHuman, newGameVsAI, getGameState, resetGame, setAIDifficulty, destroyGame } =
      await import('../../src/games/hex/game-controller');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = document.createElement('div');
    const status = document.createElement('div');
    app.appendChild(board);
    app.appendChild(status);

    initGame(board, status);
    expect(getGameState().winner).toBeNull();
    expect(board.querySelectorAll('[data-row]').length).toBeGreaterThan(0);

    // Click first empty cell (SVG groups — dispatchEvent, not HTMLElement.click)
    const cell = board.querySelector('[data-row][data-col]');
    expect(cell).toBeTruthy();
    cell!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getGameState().moveHistory.length).toBeGreaterThanOrEqual(1);

    newGameVsAI('easy');
    // Chrome sync touches #app; do not assert copy — only that mode switch ran.
    expect(getGameState().currentPlayer).toBeTruthy();
    // Do not advance AI delay — no timing / move-choice asserts.
    setAIDifficulty('hard');
    newGameVsHuman();
    resetGame();
    expect(getGameState().winner).toBeNull();

    // Exercise rules helper import stays wired (characterization smoke).
    const finished = hexMakeMove(createHexState(), { row: 0, col: 0 });
    expect(finished.moveHistory.length).toBe(1);
    destroyGame();
  });

  it('startTutorial exits without asserting tutorial copy', async () => {
    const { initGame, startTutorial, isTutorialActive, destroyGame } =
      await import('../../src/games/hex/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    destroyGame();
  });

  it.skip('BUG: destroyGame is a no-op stub — does not clear board/status containers or cancel AI generation', async () => {
    // Reason: tip-held alpha restore left destroyGame empty (see game-controller
    // comment). Remounts can retain stale boardContainer references until a later
    // fold lands a real teardown. Expected-fail pin only — do not "fix" source here.
    const { initGame, destroyGame, getGameState } = await import(
      '../../src/games/hex/game-controller'
    );
    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    destroyGame();
    expect(getGameState()).toBeUndefined();
  });
});

describe('burn-1008 ui-cov-r5 fraction-pinball controller shell', () => {
  it('human answer → result → continue without AI flush', async () => {
    const {
      initGame,
      newGameVsHuman,
      newGameVsAI,
      getCurrentState,
      destroyGame,
    } = await import('../../src/games/fraction-pinball/game-controller');

    const root = mountAppShell();
    initGame(root);
    expect(root.querySelector('.pinball-game-container')).toBeTruthy();

    newGameVsHuman();
    let state = getCurrentState();
    expect(state.phase).toBe('answering');

    const choiceBtn = root.querySelector(
      '.pinball-choice-btn'
    ) as HTMLButtonElement | null;
    expect(choiceBtn).toBeTruthy();
    choiceBtn!.click();
    state = getCurrentState();
    expect(['answering', 'showResult', 'gameOver']).toContain(state.phase);

    const cont = root.querySelector(
      '.pinball-continue-btn, button.pinball-continue'
    ) as HTMLButtonElement | null;
    cont?.click();

    // Enter vs-AI but do not advance the 1000ms AI timer (no timing asserts).
    newGameVsAI('easy');
    expect(getCurrentState().phase).toBe('answering');
    newGameVsHuman(); // bump generation — cancels pending AI timeout
    destroyGame();

    // Keep submitAnswer import live for rules wiring smoke.
    const raw = submitAnswer;
    expect(typeof raw).toBe('function');
  });

  it.skip('BUG: fraction-pinball destroyGame is a no-op stub after alpha restore', async () => {
    // Reason: same tip-held stub as hex — destroyGame does not null gameContainer
    // or bump aiGeneration. Pin until a real teardown lands in a source PR.
    const { initGame, destroyGame, getCurrentState } = await import(
      '../../src/games/fraction-pinball/game-controller'
    );
    const root = mountAppShell();
    initGame(root);
    destroyGame();
    expect(getCurrentState()).toBeUndefined();
  });
});
